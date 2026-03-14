from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import subprocess
import json
import sqlite3
from datetime import datetime
import os

app = FastAPI(title="CI/CD Security Dashboard API")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
DATABASE_PATH = "vulnerabilities.db"


def init_db():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_name TEXT NOT NULL,
            scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            total_vulnerabilities INTEGER DEFAULT 0,
            critical_count INTEGER DEFAULT 0,
            high_count INTEGER DEFAULT 0,
            medium_count INTEGER DEFAULT 0,
            low_count INTEGER DEFAULT 0
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vulnerabilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_id INTEGER NOT NULL,
            package_name TEXT,
            installed_version TEXT,
            fixed_version TEXT,
            vulnerability_id TEXT,
            severity TEXT,
            description TEXT,
            FOREIGN KEY (scan_id) REFERENCES scans(id)
        )
    """)
    
    conn.commit()
    conn.close()


# Initialize database on startup
init_db()


class ScanRequest(BaseModel):
    image_name: str


class VulnerabilityResponse(BaseModel):
    id: int
    scan_id: int
    package_name: Optional[str]
    installed_version: Optional[str]
    fixed_version: Optional[str]
    vulnerability_id: Optional[str]
    severity: str
    description: Optional[str]


class ScanSummary(BaseModel):
    id: int
    image_name: str
    scan_date: str
    total_vulnerabilities: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int


@app.get("/")
def read_root():
    return {"message": "CI/CD Security Dashboard API", "version": "1.0"}


@app.post("/scan")
async def scan_image(request: ScanRequest):
    """
    Scan a Docker image using Trivy and store results in SQLite
    """
    image_name = request.image_name
    
    try:
        # Pull the Docker image first
        print(f"Pulling image: {image_name}")
        pull_result = subprocess.run(
            ["docker", "pull", image_name],
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if pull_result.returncode != 0:
            print(f"Warning: Failed to pull image: {pull_result.stderr}")
            # Continue anyway - image might already exist locally
        
        # Run Trivy scan
        print(f"Scanning image: {image_name}")
        result = subprocess.run(
            ["trivy", "image", "--format", "json", "--quiet", image_name],
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Trivy scan failed: {result.stderr}"
            )
        
        # Parse JSON results
        scan_results = json.loads(result.stdout)
        
        # Extract vulnerabilities
        vulnerabilities = []
        for item in scan_results.get("Results", []):
            vulns = item.get("Vulnerabilities", [])
            if vulns:
                vulnerabilities.extend(vulns)
        
        # Count by severity
        severity_counts = {
            "CRITICAL": 0,
            "HIGH": 0,
            "MEDIUM": 0,
            "LOW": 0
        }
        
        for vuln in vulnerabilities:
            severity = vuln.get("Severity", "UNKNOWN")
            if severity in severity_counts:
                severity_counts[severity] += 1
        
        # Store in database
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Insert scan record
        cursor.execute("""
            INSERT INTO scans (
                image_name, total_vulnerabilities, 
                critical_count, high_count, medium_count, low_count
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            image_name,
            len(vulnerabilities),
            severity_counts["CRITICAL"],
            severity_counts["HIGH"],
            severity_counts["MEDIUM"],
            severity_counts["LOW"]
        ))
        
        scan_id = cursor.lastrowid
        
        # Insert vulnerabilities
        for vuln in vulnerabilities:
            cursor.execute("""
                INSERT INTO vulnerabilities (
                    scan_id, package_name, installed_version, 
                    fixed_version, vulnerability_id, severity, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                scan_id,
                vuln.get("PkgName"),
                vuln.get("InstalledVersion"),
                vuln.get("FixedVersion"),
                vuln.get("VulnerabilityID"),
                vuln.get("Severity"),
                vuln.get("Description")
            ))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "scan_id": scan_id,
            "image_name": image_name,
            "total_vulnerabilities": len(vulnerabilities),
            "severity_counts": severity_counts,
            "message": "Scan completed successfully"
        }
        
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Scan timed out")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse Trivy output")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/results")
async def get_results(severity: Optional[str] = None, limit: int = 100):
    """
    Get vulnerability results with optional severity filtering
    """
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        if severity:
            severity = severity.upper()
            cursor.execute("""
                SELECT * FROM vulnerabilities 
                WHERE severity = ? 
                ORDER BY id DESC 
                LIMIT ?
            """, (severity, limit))
        else:
            cursor.execute("""
                SELECT * FROM vulnerabilities 
                ORDER BY id DESC 
                LIMIT ?
            """, (limit,))
        
        vulnerabilities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {
            "success": True,
            "count": len(vulnerabilities),
            "vulnerabilities": vulnerabilities
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/scans")
async def get_scans(limit: int = 20):
    """
    Get scan history
    """
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM scans 
            ORDER BY scan_date DESC 
            LIMIT ?
        """, (limit,))
        
        scans = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {
            "success": True,
            "count": len(scans),
            "scans": scans
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/stats")
async def get_stats():
    """
    Get overall statistics for dashboard
    """
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get total scans
        cursor.execute("SELECT COUNT(*) as count FROM scans")
        total_scans = cursor.fetchone()["count"]
        
        # Get total vulnerabilities
        cursor.execute("SELECT COUNT(*) as count FROM vulnerabilities")
        total_vulnerabilities = cursor.fetchone()["count"]
        
        # Get severity distribution
        cursor.execute("""
            SELECT severity, COUNT(*) as count 
            FROM vulnerabilities 
            GROUP BY severity
        """)
        severity_distribution = {row["severity"]: row["count"] for row in cursor.fetchall()}
        
        # Get recent scans for timeline
        cursor.execute("""
            SELECT scan_date, total_vulnerabilities, critical_count, 
                   high_count, medium_count, low_count, image_name
            FROM scans 
            ORDER BY scan_date DESC 
            LIMIT 10
        """)
        recent_scans = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "success": True,
            "total_scans": total_scans,
            "total_vulnerabilities": total_vulnerabilities,
            "severity_distribution": severity_distribution,
            "recent_scans": recent_scans
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
