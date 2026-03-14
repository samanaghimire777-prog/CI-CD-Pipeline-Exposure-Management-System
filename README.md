# 🔒 CI/CD Security Dashboard

A comprehensive security vulnerability scanning dashboard that scans Docker images using Trivy, stores results in SQLite, and visualizes vulnerabilities through an interactive React dashboard.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [CI/CD Pipeline](#cicd-pipeline)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Backend
- **FastAPI-based REST API** for vulnerability scanning
- **Trivy integration** for comprehensive Docker image security scanning
- **SQLite database** for persistent storage of scan results
- **Severity-based filtering** (CRITICAL, HIGH, MEDIUM, LOW)
- **Automatic vulnerability parsing** and categorization
- **RESTful endpoints** for scanning and retrieving results

### Frontend
- **Modern React dashboard** with TailwindCSS styling
- **Interactive Chart.js visualizations**:
  - Bar chart for vulnerability distribution by severity
  - Line chart for scan history timeline
- **Real-time data updates** every 30 seconds
- **Detailed vulnerability table** with pagination
- **Severity-based filtering** through clickable stats cards
- **Responsive design** for desktop and mobile

### CI/CD
- **Automated GitHub Actions workflow**
- **Scheduled daily scans** at 2 AM UTC
- **Artifact storage** of scan results
- **Summary generation** in GitHub Actions
- **Critical vulnerability detection** and alerting

## 🛠️ Tech Stack

### Backend
- Python 3.11
- FastAPI
- SQLite
- Trivy
- Uvicorn

### Frontend
- React 18
- TailwindCSS
- Chart.js
- Vite
- Axios

### DevOps
- Docker & Docker Compose
- GitHub Actions
- Git

## 📦 Prerequisites

Before running this project, ensure you have:

- **macOS Air M1** (or compatible system)
- **Docker Desktop** installed and running
- **Python 3.11+** installed
- **Node.js 20+** and npm installed
- **Git** for version control
- **Trivy** installed (for local testing)

### Installing Trivy on macOS

```bash
brew install aquasecurity/trivy/trivy
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/security-dashboard.git
cd demoproject
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## 💻 Usage

### Option 1: Using Docker Compose (Recommended)

```bash
# From project root
docker-compose up --build

# Access the application:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Start Backend

```bash
cd backend
source venv/bin/activate
python main.py

# Backend will run on http://localhost:8000
```

#### Start Frontend

```bash
cd frontend
npm run dev

# Frontend will run on http://localhost:3000
```

### Scanning a Docker Image

1. Open the dashboard at `http://localhost:3000`
2. Enter a Docker image name (e.g., `nginx:latest`, `ubuntu:20.04`)
3. Click **Scan Image**
4. View results in real-time on the dashboard

### Using the API Directly

```bash
# Scan an image
curl -X POST "http://localhost:8000/scan" \
  -H "Content-Type: application/json" \
  -d '{"image_name": "nginx:latest"}'

# Get all vulnerabilities
curl "http://localhost:8000/results"

# Filter by severity
curl "http://localhost:8000/results?severity=CRITICAL"

# Get scan history
curl "http://localhost:8000/scans"

# Get statistics
curl "http://localhost:8000/stats"
```

## 📚 API Documentation

### Endpoints

#### `GET /`
Health check endpoint.

**Response:**
```json
{
  "message": "CI/CD Security Dashboard API",
  "version": "1.0"
}
```

#### `POST /scan`
Scan a Docker image for vulnerabilities.

**Request:**
```json
{
  "image_name": "nginx:latest"
}
```

**Response:**
```json
{
  "success": true,
  "scan_id": 1,
  "image_name": "nginx:latest",
  "total_vulnerabilities": 42,
  "severity_counts": {
    "CRITICAL": 3,
    "HIGH": 10,
    "MEDIUM": 15,
    "LOW": 14
  },
  "message": "Scan completed successfully"
}
```

#### `GET /results`
Get vulnerability results with optional filtering.

**Parameters:**
- `severity` (optional): Filter by severity (CRITICAL, HIGH, MEDIUM, LOW)
- `limit` (optional): Maximum number of results (default: 100)

**Response:**
```json
{
  "success": true,
  "count": 42,
  "vulnerabilities": [...]
}
```

#### `GET /scans`
Get scan history.

**Parameters:**
- `limit` (optional): Maximum number of scans (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "scans": [...]
}
```

#### `GET /stats`
Get overall statistics for the dashboard.

**Response:**
```json
{
  "success": true,
  "total_scans": 10,
  "total_vulnerabilities": 420,
  "severity_distribution": {
    "CRITICAL": 30,
    "HIGH": 100,
    "MEDIUM": 150,
    "LOW": 140
  },
  "recent_scans": [...]
}
```

## 📁 Project Structure

```
demoproject/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Backend Docker configuration
│   └── .dockerignore       # Docker ignore file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScanForm.jsx
│   │   │   ├── SeverityChart.jsx
│   │   │   ├── TimelineChart.jsx
│   │   │   ├── VulnerabilityTable.jsx
│   │   │   └── StatsCards.jsx
│   │   ├── App.jsx
│   │   ├── api.js          # API client
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .dockerignore
├── .github/
│   └── workflows/
│       └── security-scan.yml  # CI/CD workflow
├── docker-compose.yml
└── README.md
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive GitHub Actions workflow that:

1. **Triggers on:**
   - Push to `main` or `develop` branches
   - Pull requests to `main`
   - Daily schedule at 2 AM UTC
   - Manual workflow dispatch

2. **Build and Scan Job:**
   - Builds the backend Docker image
   - Runs Trivy security scan
   - Uploads scan results as artifacts
   - Checks for critical vulnerabilities
   - Generates scan summary in GitHub Actions

3. **Frontend Build Job:**
   - Builds the React frontend
   - Uploads build artifacts

### Setting Up CI/CD

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/security-dashboard.git
git push -u origin main
```

2. The workflow will automatically run on push.

3. View results in the **Actions** tab of your GitHub repository.

### Optional: Auto-posting Results

Uncomment the last step in the workflow to automatically post scan results to your hosted API:

```yaml
- name: Post Scan Results to Dashboard
  env:
    DASHBOARD_API_URL: ${{ secrets.DASHBOARD_API_URL }}
    DASHBOARD_API_KEY: ${{ secrets.DASHBOARD_API_KEY }}
  run: |
    curl -X POST "$DASHBOARD_API_URL/scan" \
      -H "Authorization: Bearer $DASHBOARD_API_KEY" \
      -H "Content-Type: application/json" \
      -d @trivy-results.json
```

Add the secrets in your repository settings.

## 🎨 Dashboard Features

### Stats Cards
- **Total Scans**: Number of scans performed
- **Total Vulnerabilities**: Aggregate count of all vulnerabilities
- **Critical/High Severity Cards**: Click to filter the vulnerability table

### Charts
- **Severity Distribution**: Bar chart showing vulnerability counts by severity
- **Timeline**: Line chart showing vulnerability trends over time

### Vulnerability Table
- Paginated table with 10 items per page
- Columns: Package, Vulnerability ID, Severity, Installed Version, Fixed Version, Description
- Color-coded severity badges
- Click severity cards to filter results

## 🔧 Configuration

### Environment Variables

#### Backend
Create a `.env` file in the `backend` directory:

```env
DATABASE_PATH=vulnerabilities.db
```

#### Frontend
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

### Database

The SQLite database (`vulnerabilities.db`) is automatically created on first run with two tables:

- **scans**: Stores scan metadata
- **vulnerabilities**: Stores individual vulnerability details

## 🐛 Troubleshooting

### Docker Socket Permission Issues

If you encounter permission errors with Docker:

```bash
sudo chmod 666 /var/run/docker.sock
```

### Trivy Installation Issues on M1 Mac

```bash
# Use Homebrew
brew install aquasecurity/trivy/trivy

# Or use the official installation script
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
```

### Port Already in Use

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Issues

Ensure the backend `main.py` has proper CORS configuration:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📈 Future Enhancements

- [ ] User authentication and authorization
- [ ] Email/Slack notifications for critical vulnerabilities
- [ ] Multi-database support (PostgreSQL, MySQL)
- [ ] Historical trend analysis
- [ ] Export reports to PDF/CSV
- [ ] Integration with more security scanning tools
- [ ] Docker registry integration
- [ ] Scheduled automated scans
- [ ] Webhook support for CI/CD integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Trivy](https://github.com/aquasecurity/trivy) for the excellent security scanner
- [FastAPI](https://fastapi.tiangolo.com/) for the awesome Python framework
- [React](https://react.dev/) and [TailwindCSS](https://tailwindcss.com/) for the frontend
- [Chart.js](https://www.chartjs.org/) for beautiful charts

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainer.

---

**Note:** This is an interim phase project for educational purposes. For production use, implement proper authentication, security measures, and error handling.
