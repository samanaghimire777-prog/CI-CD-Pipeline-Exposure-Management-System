# CI/CD Security Dashboard - Project Overview

## Project Information

**Project Name:** CI/CD Security Dashboard  
**Type:** Final Year Project (Interim Phase)  
**Created:** December 28, 2025  
**Author:** Santosh Ghimire  
**Environment:** macOS Air M1 2020  

## Project Summary

A full-stack security vulnerability scanning dashboard that integrates Trivy for Docker image scanning, stores results in SQLite, and provides an interactive React-based visualization dashboard.

## Architecture

### Backend (FastAPI + Python)
- **Framework:** FastAPI 0.109.0
- **Database:** SQLite
- **Scanner:** Trivy
- **Server:** Uvicorn

**Key Features:**
- RESTful API with 5 main endpoints
- Automatic vulnerability categorization by severity
- Real-time Docker image scanning
- Persistent storage of scan history
- CORS enabled for frontend communication

### Frontend (React + TailwindCSS)
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS 3.4
- **Charts:** Chart.js 4.4

**Key Features:**
- Real-time dashboard with auto-refresh
- Interactive charts (bar and line)
- Severity-based filtering
- Responsive design
- Paginated vulnerability table

### DevOps (Docker + GitHub Actions)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Automation:** Scheduled scans, artifact storage

## API Endpoints

| Method | Endpoint    | Description                           |
|--------|-------------|---------------------------------------|
| GET    | /           | Health check                          |
| POST   | /scan       | Scan Docker image                     |
| GET    | /results    | Get vulnerabilities (with filtering)  |
| GET    | /scans      | Get scan history                      |
| GET    | /stats      | Get dashboard statistics              |

## Database Schema

### Table: scans
- id (PRIMARY KEY)
- image_name
- scan_date
- total_vulnerabilities
- critical_count, high_count, medium_count, low_count

### Table: vulnerabilities
- id (PRIMARY KEY)
- scan_id (FOREIGN KEY)
- package_name
- installed_version
- fixed_version
- vulnerability_id
- severity
- description

## Technology Stack

| Layer      | Technology           | Version |
|------------|----------------------|---------|
| Backend    | Python               | 3.11    |
| Framework  | FastAPI              | 0.109.0 |
| Frontend   | React                | 18.2    |
| Styling    | TailwindCSS          | 3.4     |
| Charts     | Chart.js             | 4.4     |
| Build      | Vite                 | 5.0     |
| Scanner    | Trivy                | Latest  |
| Database   | SQLite               | 3       |
| Container  | Docker               | Latest  |
| CI/CD      | GitHub Actions       | -       |

## Project Goals (Interim Phase)

✅ Working backend with Trivy scanning  
✅ SQLite database integration  
✅ REST API with multiple endpoints  
✅ React frontend with TailwindCSS  
✅ Chart.js visualizations  
✅ Docker containerization  
✅ GitHub Actions CI/CD pipeline  
✅ Comprehensive documentation  

## 3.3 Sprint-Wise Development Summary

### 3.3.1 Sprint 1: Foundation & Planning

The first sprint was dedicated to establishing a solid foundation for the CI/CD Security Dashboard project. The team began by carefully defining the project scope, identifying the core problem of undetected container vulnerabilities in automated delivery pipelines, and agreeing on the key stakeholders and functional requirements. After a thorough evaluation of available tools and frameworks, the technology stack was finalised: GitHub Actions for CI/CD orchestration, Trivy for container image vulnerability scanning, FastAPI as the backend framework, React with TailwindCSS for the frontend dashboard, Docker and Docker Compose for containerisation, and SQLite for lightweight persistent storage. System design artifacts were produced during this sprint, including a component diagram that mapped the interactions between the CI pipeline, backend API, database, and frontend UI, alongside a use case diagram illustrating the primary actor workflows. The sprint concluded with a documented implementation roadmap and a task breakdown that gave each subsequent sprint clear boundaries and measurable goals.

### 3.3.2 Sprint 2: CI/CD Pipeline Setup

With the project scope and architecture defined, Sprint 2 focused entirely on building and validating the automated CI/CD pipeline using GitHub Actions. A workflow file was created that triggers automatically on every push to the repository, ensuring continuous integration from day one. The pipeline was structured to check out the latest source code, build Docker images for both the backend and frontend services, and then execute a Trivy security scan against the resulting images. A critical design decision made during this sprint was the enforcement of a security threshold: the pipeline is configured to fail immediately if any vulnerability rated CRITICAL or HIGH is discovered, thereby preventing unsafe builds from progressing further in the delivery cycle. The workflow also stores Trivy scan results as build artifacts and generates a human-readable summary within the GitHub Actions interface, giving developers immediate visibility into the security state of every commit. This sprint represented the first working integration of security scanning into the automated delivery process.

### 3.3.3 Sprint 3: Backend Intelligence

Sprint 3 shifted focus to the server-side application, where the FastAPI-based backend was designed and implemented in full. The backend serves as the intelligence layer of the system, responsible for invoking Trivy against a specified Docker image, receiving the raw JSON scan output, and parsing it into structured vulnerability records. Parsing logic was developed to extract and normalise all relevant fields from the Trivy report, including the vulnerability identifier (CVE ID), the affected package name, the installed and fixed versions, the severity rating, and a human-readable description. Parsed records are persisted into an SQLite database using two tables: one for scan metadata and one for individual vulnerability entries linked by a foreign key. Five RESTful API endpoints were exposed — a health check, a scan trigger, a filtered vulnerability retrieval endpoint, a scan history endpoint, and a statistics aggregation endpoint — each returning consistent JSON responses. CORS middleware was also configured to allow secure cross-origin communication with the React frontend. The result was a fully tested, stable data processing backend ready to serve any client.

### 3.3.4 Sprint 4: Frontend Visualization

Building on the completed backend, Sprint 4 was focused on delivering a polished and interactive frontend dashboard using React and TailwindCSS. The dashboard was designed to give security engineers and developers an intuitive view of vulnerability data without requiring them to interpret raw API responses directly. Five core React components were developed: a scan form that accepts a Docker image name and triggers a scan via the API; statistics cards that display totals for each severity level and double as interactive filters; a bar chart rendering the severity distribution using Chart.js; a line chart tracking vulnerability counts across multiple scans over time; and a paginated vulnerability table with colour-coded severity badges showing package-level detail. The UI was built to refresh its data automatically every thirty seconds, ensuring that results displayed are always current without requiring a manual page reload. Responsive design principles were applied throughout, ensuring the dashboard remains accessible on both desktop and smaller screens. By the end of this sprint the frontend was fully functional as a standalone interface backed by the completed API.

### 3.3.5 Sprint 5: Integration & Testing

Sprint 5 brought together all previously developed components into a fully integrated, end-to-end system. The frontend was connected to the live backend API and tested across all user flows: initiating a scan from the dashboard, waiting for the result, and observing the vulnerability table, charts, and statistics cards update with the newly ingested data. The scan history page was completed and verified to accurately reflect the chronological record of all scans stored in the database. Severity-based filtering was validated to correctly narrow the vulnerability table to the selected severity tier. Cross-component behaviour was tested, including the interaction between clicking a severity card and the corresponding filter being applied to the vulnerability table. Error handling was reviewed and refined so that API failures surface as informative UI messages rather than silent or broken states. The GitHub Actions workflow was also retested against updated images to confirm the security gate behaved correctly under both passing and failing conditions. The sprint delivered a fully functional, integrated system ready for demonstration and evaluation.

### 3.3.6 Evaluation and Documentation

The final phase of the project was devoted to systematic evaluation of the delivered system against the original requirements and a comprehensive consolidation of all project documentation. Each sprint goal was reviewed against the implemented functionality, confirming that the CI/CD pipeline correctly automates security scanning, the backend accurately parses and stores Trivy output, the frontend presents vulnerability data in a clear and navigable interface, and the system operates as a coherent end-to-end solution. The evaluation also identified known limitations and future improvement opportunities, including the absence of user authentication, the use of SQLite rather than a production-grade database, the lack of email or messaging notifications for critical findings, and the scope for exporting scan reports to PDF or CSV formats. On the documentation side, a comprehensive README was written covering installation, configuration, usage instructions, and API reference. A quick-start guide, a developer guide, a project overview, and environment configuration templates were also produced, ensuring that any new contributor can set up, run, and extend the project with minimal friction. The documentation baseline positions the project for continued development and aligns it with the standards expected for a final-year academic submission.

## Key Features Implemented

### Security Scanning
- Automated Trivy integration
- Support for any Docker image
- JSON parsing and storage
- Severity categorization

### Data Visualization
- Bar chart: Severity distribution
- Line chart: Scan timeline
- Stats cards: Quick metrics
- Vulnerability table: Detailed view

### User Experience
- One-click scanning
- Real-time updates
- Severity-based filtering
- Responsive design
- Clean, modern UI

### CI/CD Automation
- Automated builds on push
- Scheduled daily scans
- Artifact storage (30 days)
- Scan summary generation
- Critical vulnerability detection

## File Structure

```
demoproject/
├── backend/
│   ├── main.py                 # FastAPI application (390 lines)
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Backend container config
│   └── .env.example           # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/        # React components (5 files)
│   │   ├── App.jsx           # Main app component
│   │   ├── api.js            # API client
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── security-scan.yml  # CI/CD workflow
├── docker-compose.yml         # Multi-container setup
├── setup.sh                   # Automated setup script
├── start.sh                   # Development start script
├── README.md                  # Full documentation
├── QUICKSTART.md             # Quick start guide
└── LICENSE                    # MIT License
```

## Getting Started

### Quick Setup (Automated)
```bash
./setup.sh
docker-compose up --build
```

### Manual Setup
See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## Usage Examples

### Scan a Docker Image
```bash
# Via UI: http://localhost:3000
# Enter: nginx:latest, ubuntu:20.04, alpine:latest

# Via API:
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"image_name": "nginx:latest"}'
```

### View Results
```bash
# All vulnerabilities
curl http://localhost:8000/results

# Critical only
curl http://localhost:8000/results?severity=CRITICAL

# Dashboard stats
curl http://localhost:8000/stats
```

## Performance

- **Scan Time:** 30-120 seconds (depends on image size)
- **Database:** SQLite (no external dependencies)
- **Auto-refresh:** Every 30 seconds
- **Pagination:** 10 items per page

## Security Considerations

⚠️ **Development Phase - Not Production Ready**

For production deployment, implement:
- User authentication
- API rate limiting
- Input validation
- Environment variable security
- HTTPS/SSL
- Database encryption
- Audit logging

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Email/Slack notifications
- [ ] PostgreSQL migration
- [ ] Export to PDF/CSV
- [ ] Scheduled automated scans
- [ ] Docker registry integration
- [ ] Multi-user support
- [ ] Role-based access control

## Testing

### Manual Testing
```bash
# Test backend
curl http://localhost:8000/

# Test scan
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"image_name": "alpine:latest"}'

# Test frontend
open http://localhost:3000
```

### Automated Testing (Future)
```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

## Deployment Options

### Local Development
- Docker Compose (recommended)
- Manual setup with virtual environment

### Production (Future)
- AWS ECS/Fargate
- Google Cloud Run
- DigitalOcean App Platform
- Self-hosted VPS

## Support & Documentation

- **Full Documentation:** [README.md](README.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **API Docs:** http://localhost:8000/docs (when running)
- **GitHub Issues:** Open issues for bugs/features

## License

MIT License - See [LICENSE](LICENSE) file

## Acknowledgments

- **Trivy:** Aqua Security for the excellent scanner
- **FastAPI:** Sebastián Ramírez for the framework
- **React:** Meta for the frontend library
- **TailwindCSS:** Tailwind Labs for the styling framework
- **Chart.js:** Chart.js maintainers for visualization

---

**Last Updated:** December 28, 2025  
**Version:** 1.0.0 (Interim Phase)  
**Status:** ✅ Complete
