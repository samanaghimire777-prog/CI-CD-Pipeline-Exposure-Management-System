# Quick Start Guide

## Prerequisites Check

Before starting, verify you have:

```bash
# Check Docker
docker --version
docker-compose --version

# Check Python
python3 --version

# Check Node.js
node --version
npm --version

# Check Trivy (optional for local testing)
trivy --version
```

## Installation (5 Minutes)

### 1. Install Trivy (macOS)

```bash
brew install aquasecurity/trivy/trivy
```

### 2. Clone and Setup

```bash
# Clone repository
git clone <your-repo-url>
cd demoproject

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Frontend setup
cd frontend
npm install
cd ..
```

## Running the Application

### Option A: Docker Compose (Easiest)

```bash
# From project root
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Option B: Manual (Development)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## First Scan

1. Open http://localhost:3000
2. Enter `nginx:latest` or `ubuntu:20.04`
3. Click "Scan Image"
4. Wait 30-60 seconds for results

## Testing the API

```bash
# Health check
curl http://localhost:8000/

# Scan an image
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"image_name": "alpine:latest"}'

# Get results
curl http://localhost:8000/results

# Get stats
curl http://localhost:8000/stats
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Docker Socket Permission
```bash
sudo chmod 666 /var/run/docker.sock
```

### Trivy Not Found (in Docker)
The backend Dockerfile includes Trivy installation. If running manually:
```bash
brew install aquasecurity/trivy/trivy
```

## Project Structure Quick Reference

```
demoproject/
├── backend/          # FastAPI + Trivy
│   ├── main.py      # Main application
│   └── requirements.txt
├── frontend/        # React + TailwindCSS
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   └── package.json
├── .github/
│   └── workflows/   # CI/CD
└── docker-compose.yml
```

## Next Steps

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Enable GitHub Actions:**
   - Go to your repo → Actions tab
   - Workflows will run automatically

3. **Customize:**
   - Update [README.md](README.md) with your info
   - Add your repository URL
   - Configure environment variables

## Support

- Check [README.md](README.md) for detailed documentation
- Review API docs at http://localhost:8000/docs
- Open an issue on GitHub

## Quick Commands Reference

```bash
# Start everything
docker-compose up

# Stop everything
docker-compose down

# Rebuild
docker-compose up --build

# View logs
docker-compose logs -f

# Backend only
cd backend && python main.py

# Frontend only
cd frontend && npm run dev

# Run tests (when added)
cd backend && pytest
cd frontend && npm test
```
