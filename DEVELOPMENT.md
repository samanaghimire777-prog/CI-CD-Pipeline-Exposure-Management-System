# Development Guide

## Development Environment Setup

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

1. **Python:**
   - Python (Microsoft)
   - Pylance
   - Python Debugger

2. **JavaScript/React:**
   - ES7+ React/Redux/React-Native snippets
   - ESLint
   - Prettier

3. **General:**
   - Docker
   - GitLens
   - Tailwind CSS IntelliSense
   - Auto Rename Tag

## Project Commands

### Backend Commands

```bash
# Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py
# or with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test API
curl http://localhost:8000/

# Deactivate virtual environment
deactivate
```

### Frontend Commands

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend
docker-compose restart frontend

# Remove volumes (reset database)
docker-compose down -v

# Build only backend
docker build -t security-backend ./backend

# Build only frontend
docker build -t security-frontend ./frontend
```

## Code Structure

### Backend (FastAPI)

**main.py** structure:
```
1. Imports and app initialization
2. CORS middleware setup
3. Database initialization function
4. Pydantic models
5. API endpoints:
   - GET / (health check)
   - POST /scan (scan image)
   - GET /results (get vulnerabilities)
   - GET /scans (get history)
   - GET /stats (get statistics)
6. Main entry point
```

**Adding a new endpoint:**

```python
@app.get("/your-endpoint")
async def your_function():
    """Your documentation"""
    try:
        # Your logic here
        return {"success": True, "data": "your data"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Frontend (React)

**Component hierarchy:**
```
App.jsx
├── ScanForm.jsx
├── StatsCards.jsx
├── SeverityChart.jsx
├── TimelineChart.jsx
└── VulnerabilityTable.jsx
```

**Creating a new component:**

```jsx
import React from 'react';

const YourComponent = ({ prop1, prop2 }) => {
  return (
    <div className="your-tailwind-classes">
      {/* Your JSX */}
    </div>
  );
};

export default YourComponent;
```

**Adding a new API call (api.js):**

```javascript
export const yourNewFunction = async (param) => {
  const response = await api.get('/your-endpoint', { 
    params: { param } 
  });
  return response.data;
};
```

## Database Management

### SQLite Commands

```bash
# Open database
sqlite3 backend/vulnerabilities.db

# View tables
.tables

# View schema
.schema scans
.schema vulnerabilities

# Query data
SELECT * FROM scans ORDER BY scan_date DESC LIMIT 5;
SELECT severity, COUNT(*) FROM vulnerabilities GROUP BY severity;

# Exit
.quit
```

### Reset Database

```bash
# Remove database file
rm backend/vulnerabilities.db

# Restart backend (will recreate database)
cd backend && python main.py
```

## Debugging

### Backend Debugging

Add breakpoints in VS Code and use the debugger:

**.vscode/launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8000"
      ],
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/backend"
      }
    }
  ]
}
```

### Frontend Debugging

Use React DevTools and browser console:

```javascript
// Add console logs
console.log('Data:', data);

// Use React DevTools
// Install: https://chrome.google.com/webstore/detail/react-developer-tools
```

## Testing

### Manual API Testing

Use the built-in FastAPI docs:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

Or use curl:

```bash
# Scan image
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"image_name": "alpine:latest"}'

# Get critical vulnerabilities
curl "http://localhost:8000/results?severity=CRITICAL"

# Get statistics
curl http://localhost:8000/stats
```

### Frontend Testing

```bash
# Manual testing
npm run dev
# Open http://localhost:3000

# Future: Add automated tests
# npm test
```

## Environment Variables

### Backend (.env)

```env
DATABASE_PATH=vulnerabilities.db
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

## Common Development Tasks

### Add a New Severity Level

1. **Backend (main.py):**
```python
severity_counts = {
    "CRITICAL": 0,
    "HIGH": 0,
    "MEDIUM": 0,
    "LOW": 0,
    "NEW_LEVEL": 0  # Add here
}
```

2. **Frontend (tailwind.config.js):**
```javascript
colors: {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#f59e0b',
  low: '#22c55e',
  newlevel: '#your-color',  // Add here
}
```

### Add a New Chart

1. Create component in `frontend/src/components/YourChart.jsx`
2. Import Chart.js elements
3. Use in `App.jsx`:

```jsx
import YourChart from './components/YourChart';

// In App.jsx
<YourChart data={yourData} />
```

### Modify Database Schema

1. Update database initialization in `backend/main.py`
2. Delete old database: `rm backend/vulnerabilities.db`
3. Restart backend to recreate

## Performance Optimization

### Backend

- Use database indexes for frequent queries
- Implement caching for statistics
- Use async/await for I/O operations
- Optimize Trivy scan parameters

### Frontend

- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize Chart.js rendering
- Implement virtual scrolling for large tables

## Deployment Preparation

### Backend

```bash
# Install production dependencies only
pip install --no-cache-dir -r requirements.txt

# Run with production settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

```bash
# Build for production
npm run build

# Output will be in frontend/dist/
# Serve with a static file server
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub

# Merge and delete branch
git checkout main
git pull origin main
git branch -d feature/your-feature
```

## Code Style Guidelines

### Python (Backend)

- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Maximum line length: 100 characters

```python
async def scan_image(request: ScanRequest) -> dict:
    """
    Scan a Docker image for vulnerabilities.
    
    Args:
        request: ScanRequest object with image_name
        
    Returns:
        dict: Scan results with vulnerability counts
    """
```

### JavaScript (Frontend)

- Use functional components
- Use hooks (useState, useEffect)
- Destructure props
- Use meaningful variable names

```javascript
const ScanForm = ({ onScanComplete }) => {
  const [imageName, setImageName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic here
  };
  
  return (/* JSX */);
};
```

## Useful Resources

- **FastAPI Tutorial:** https://fastapi.tiangolo.com/tutorial/
- **React Docs:** https://react.dev/learn
- **TailwindCSS:** https://tailwindcss.com/docs
- **Chart.js:** https://www.chartjs.org/docs/
- **Trivy:** https://aquasecurity.github.io/trivy/
- **SQLite:** https://www.sqlite.org/docs.html

## Getting Help

1. Check documentation in README.md
2. Review API docs: http://localhost:8000/docs
3. Check browser console for frontend errors
4. Check terminal logs for backend errors
5. Review Docker logs: `docker-compose logs -f`

## Tips and Tricks

### Quick Database Query

```bash
# View latest scans
sqlite3 backend/vulnerabilities.db "SELECT * FROM scans ORDER BY scan_date DESC LIMIT 5;"

# Count vulnerabilities by severity
sqlite3 backend/vulnerabilities.db "SELECT severity, COUNT(*) as count FROM vulnerabilities GROUP BY severity;"
```

### Quick API Test

```bash
# Save as test-api.sh
#!/bin/bash
echo "Testing API..."
curl -s http://localhost:8000/ | jq
echo -e "\nScanning alpine:latest..."
curl -s -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"image_name": "alpine:latest"}' | jq
```

### Auto-reload Frontend on Save

Vite automatically reloads on save. If it doesn't:
```bash
# Check vite.config.js has:
server: {
  watch: {
    usePolling: true,
  }
}
```

---

Happy coding! 🚀
