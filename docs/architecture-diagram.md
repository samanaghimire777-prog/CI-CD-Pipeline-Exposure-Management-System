# System Architecture Diagram

> Paste the code block below into [Mermaid Live Editor](https://mermaid.live) to render the diagram.

```mermaid
graph TB

    %% External actors
    DEV["Developer / User"]
    GH_REPO["GitHub Repository"]
    DOCKERHUB["Docker Hub"]
    SLACK["Slack API"]
    TRIVYDB["Trivy Advisory DB"]

    %% GitHub Actions CI/CD pipeline
    subgraph CICD["GitHub Actions CI/CD - security-scan.yml"]
        GH_CHECKOUT["1. Checkout Code"]
        GH_BUILD_BE["2. Build Backend Image"]
        GH_BUILD_FE["3. Build Frontend Image"]
        GH_TRIVY["4. Run Trivy Scan"]
        GH_ARTIFACTS["5. Upload Scan Artifacts"]
        GH_CHECK["6. Check CRITICAL / HIGH Count"]
        GH_SUMMARY["7. Generate Step Summary"]
        GH_NODE["Frontend Build Job - parallel"]

        GH_CHECKOUT --> GH_BUILD_BE --> GH_BUILD_FE --> GH_TRIVY
        GH_TRIVY --> GH_ARTIFACTS --> GH_CHECK --> GH_SUMMARY
        GH_CHECKOUT -.->|parallel job| GH_NODE
    end

    %% Frontend container
    subgraph FE["Frontend Container - Port 3000"]
        REACT["React + Vite SPA"]
        PG_DASH["Dashboard - Stats and Charts"]
        PG_SCAN["Remote Image Scanner"]
        PG_LOCAL["Local Docker Scanner"]
        PG_HIST["Scan History"]
        PG_LOOKUP["Scan Lookup"]
        PG_VULN["Vulnerabilities"]

        REACT --> PG_DASH
        REACT --> PG_SCAN
        REACT --> PG_LOCAL
        REACT --> PG_HIST
        REACT --> PG_LOOKUP
        REACT --> PG_VULN
    end

    %% Backend container
    subgraph BE["Backend Container - Port 8000"]
        FASTAPI["FastAPI Application - Python 3.11"]

        EP1["POST /scan - remote image"]
        EP2["POST /scan/local - local image"]
        EP3["GET /history"]
        EP4["GET /vulnerabilities"]
        EP5["GET /docker/images"]
        EP6["GET /report/pdf and /report/excel"]
        EP7["GET /events - SSE stream"]

        SCAN_ENGINE["Scan Engine - run_trivy_scan subprocess"]
        SLACK_MOD["Slack Alert Module - Webhook and Bot Token"]
        REPORT_GEN["Report Generator - PDF and Excel"]
        DOCKER_MON["Docker Event Monitor - SSE auto-scan"]
        DB_READ["SQLite Read"]

        FASTAPI --> EP1
        FASTAPI --> EP2
        FASTAPI --> EP3
        FASTAPI --> EP4
        FASTAPI --> EP5
        FASTAPI --> EP6
        FASTAPI --> EP7

        EP1 --> SCAN_ENGINE
        EP2 --> SCAN_ENGINE
        EP3 --> DB_READ
        EP4 --> DB_READ
        EP5 --> DB_READ
        EP6 --> REPORT_GEN
        EP7 --> DOCKER_MON
    end

    %% Persistence
    subgraph PERSIST["Persistence"]
        SQLITE[("SQLite - vulnerabilities.db")]
        T_SCANS["scans table"]
        T_VULN["vulnerabilities table"]

        SQLITE --- T_SCANS
        SQLITE --- T_VULN
    end

    %% Host resources
    subgraph RESOURCES["Host Resources"]
        TRIVY_BIN["Trivy Binary"]
        DOCKER_SOCK["Docker Socket - bind-mounted"]
        DATA_VOL["Named Volume - vulnerability-data"]
        ENV_CFG[".env Config"]
    end

    %% Connections
    DEV -->|"Browser port 3000"| REACT
    DEV -->|"git push / PR"| GH_REPO

    GH_REPO -->|"push / PR / schedule"| GH_CHECKOUT
    GH_TRIVY -->|"pull advisories"| TRIVYDB

    REACT -->|"REST HTTP port 8000"| FASTAPI

    SCAN_ENGINE --> TRIVY_BIN
    TRIVY_BIN --> DOCKER_SOCK
    DOCKER_SOCK -->|"docker pull remote images"| DOCKERHUB
    TRIVY_BIN -->|"fetch advisories"| TRIVYDB

    SCAN_ENGINE -->|"INSERT scan and vulns"| SQLITE
    DB_READ -->|"SELECT"| SQLITE

    SCAN_ENGINE -->|"critical vulns found"| SLACK_MOD
    SLACK_MOD -->|"POST alert"| SLACK

    DOCKER_MON --> DOCKER_SOCK
    DOCKER_MON -->|"auto-trigger scan on container start"| SCAN_ENGINE

    FASTAPI -->|"read on startup"| ENV_CFG
    SCAN_ENGINE -->|"persist db"| DATA_VOL

    %% Styles
    classDef external fill:#dfe6e9,stroke:#636e72,color:#2d3436
    classDef cicd fill:#d6eaf8,stroke:#2980b9,color:#1a5276
    classDef fe fill:#d5f5e3,stroke:#27ae60,color:#1e8449
    classDef be fill:#fdebd0,stroke:#e67e22,color:#784212
    classDef db fill:#f9ebea,stroke:#c0392b,color:#7b241c
    classDef res fill:#f5eef8,stroke:#8e44ad,color:#4a235a

    class DEV,GH_REPO,DOCKERHUB,SLACK,TRIVYDB external
    class GH_CHECKOUT,GH_BUILD_BE,GH_BUILD_FE,GH_TRIVY,GH_ARTIFACTS,GH_CHECK,GH_SUMMARY,GH_NODE cicd
    class REACT,PG_DASH,PG_SCAN,PG_LOCAL,PG_HIST,PG_LOOKUP,PG_VULN fe
    class FASTAPI,EP1,EP2,EP3,EP4,EP5,EP6,EP7,SCAN_ENGINE,SLACK_MOD,REPORT_GEN,DOCKER_MON,DB_READ be
    class SQLITE,T_SCANS,T_VULN db
    class TRIVY_BIN,DOCKER_SOCK,DATA_VOL,ENV_CFG res
```
