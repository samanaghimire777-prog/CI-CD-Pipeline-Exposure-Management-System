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
- Defined the project scope for a CI/CD Security Dashboard.
- Finalized core technologies: GitHub Actions, Trivy, FastAPI, React, Docker, and SQLite.
- Prepared high-level system design artifacts (use case and component-level architecture).
- Established the implementation roadmap and sprint-level task breakdown.

### 3.3.2 Sprint 2: CI/CD Pipeline Setup
- Implemented the initial GitHub Actions workflow for automated pipeline execution on repository events.
- Added build automation for backend and frontend Docker images.
- Integrated Trivy scanning in the CI flow.
- Enforced security gates so builds fail when HIGH or CRITICAL vulnerabilities are detected.

### 3.3.3 Sprint 3: Backend Intelligence
- Developed the FastAPI backend and core REST endpoints.
- Implemented parsing and processing logic for Trivy vulnerability data.
- Structured outputs around severity distribution, affected packages, versions, and remediation details.
- Added stable data handling with SQLite-backed scan and vulnerability records.

### 3.3.4 Sprint 4: Frontend Visualization
- Built the React dashboard UI and integrated reusable components.
- Added vulnerability tables, severity indicators, statistics cards, and chart-based visualizations.
- Implemented filtering and pagination to improve usability.
- Ensured a responsive interface for rapid security posture review.

### 3.3.5 Sprint 5: Integration & Testing
- Connected frontend views with backend APIs for end-to-end scan visibility.
- Verified full workflow: scan trigger, data persistence, retrieval, and visualization.
- Added scan-history views and severity-based exploration across dashboard sections.
- Improved operational reliability with clearer pipeline outcomes and artifact-based reporting.

### 3.3.6 Evaluation and Documentation
- Evaluated the complete system against sprint goals and interim project requirements.
- Confirmed successful delivery of CI automation, vulnerability scanning, backend APIs, and frontend analytics.
- Consolidated setup, usage, architecture, and development guidance into project documentation.
- Prepared the project baseline for future enhancements such as notifications, authentication, and advanced reporting.

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
