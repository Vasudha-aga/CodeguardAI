# 🛡️ CodeGuard AI - Complete Integration

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://codeguard-ai-steel.vercel.app/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

Full-stack AI-powered code analysis with **ZERO hardcoded values**. All data updates in real-time from backend API.

## 🌐 Live Demo

**🚀 Try it now:** [https://codeguard-ai-steel.vercel.app/](https://codeguard-ai-steel.vercel.app/)

Experience CodeGuard AI in action - analyze your code instantly with our deployed application!

> **Note:** The live demo is a frontend deployment. For full functionality with real-time analysis, run the backend locally following the instructions below.

## ✨ Key Features

✅ **Real-time Code Analysis** - Live bug detection and AI review  
✅ **Multi-Language Support** - Python, JavaScript, Java, C++  
✅ **No Hardcoded Values** - Everything loads from backend API  
✅ **Dynamic Dashboard** - Updates automatically with each analysis  
✅ **Live History** - Real-time analysis tracking  
✅ **Interactive UI** - Beautiful modern dark theme  
✅ **Smart Bug Detection** - AST-based code analysis  
✅ **AI Code Review** - Intelligent suggestions and recommendations  
✅ **Named Analysis** - Save and track analysis with custom names  
✅ **PDF Export** - Download detailed analysis reports  
✅ **Deployed & Live** - Access anywhere at [codeguard-ai-steel.vercel.app](https://codeguard-ai-steel.vercel.app/)

## 🚀 Quick Start (3 Minutes)

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- npm

### Step 1: Start Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

✅ Backend runs on: **http://localhost:8000**

### Step 2: Start Frontend

Open **NEW terminal**:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs on: **http://localhost:5173**

### Step 3: Test It!

1. Open http://localhost:5173
2. Go to "Code Analyzer"
3. Paste this code:

```python
password = "admin123"
eval(user_input)
```

4. Click "Analyze Code"
5. See real-time results! 🎉

## 📂 Project Structure

```
codeguard-ai-v2/
├── backend/                    # FastAPI Backend
│   ├── main.py                # API endpoints (/analyze)
│   ├── bug_detector.py        # Bug detection engine
│   ├── ai_reviewer.py         # AI code review
│   └── requirements.txt       # Python dependencies
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── app/components/
    │   │   ├── CodeAnalyzer.tsx      # ✅ Real-time analysis
    │   │   ├── Dashboard.tsx         # ✅ Real-time stats
    │   │   ├── BugDetection.tsx      # ✅ Real-time bugs
    │   │   ├── AICodeReview.tsx      # ✅ Real-time AI review
    │   │   └── History.tsx           # ✅ Real-time history
    │   ├── config/api.ts       # API configuration
    │   └── styles/             # Figma design CSS
    └── package.json
```

## 🔄 How Real-time Updates Work

### 1. **Code Analysis Flow**

```
User pastes code → CodeAnalyzer.tsx
                        ↓
    POST /analyze (FastAPI backend)
                        ↓
    Bug Detector + AI Reviewer
                        ↓
    JSON Response with bugs, review, score
                        ↓
    localStorage.setItem('latestAnalysis')
                        ↓
    All components reload automatically
```

### 2. **Data Flow**

- **CodeAnalyzer** → Calls `/analyze` → Stores result
- **Dashboard** → Reads from localStorage → Shows stats
- **BugDetection** → Reads `bugs` array → Lists issues
- **AICodeReview** → Reads `ai_review` → Shows insights
- **History** → Reads `analysisHistory` → Shows past analyses

### 3. **No Hardcoded Values**

All components use:
```typescript
const data = localStorage.getItem('latestAnalysis');
// Parse and use real data from backend
```

## 🎨 UI Design

Frontend preserves **100% Figma design** - koi change nahi!

- Glass-morphism effects ✅
- Gradient backgrounds ✅
- Animations ✅
- Color scheme ✅
- Layout structure ✅

## 🔧 Configuration

### Backend (port 8000)
Edit `backend/main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Frontend (port 5173)
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📊 API Endpoints

### POST /analyze
Analyze code and return results

**Request:**
```json
{
  "code": "def hello():\n    print('world')"
}
```

**Response:**
```json
{
  "success": true,
  "quality_score": 85,
  "bugs": [...],
  "ai_review": {
    "overall_assessment": "...",
    "suggestions": [...],
    "positive_aspects": [...]
  },
  "summary": {
    "total_issues": 2,
    "critical": 0,
    "high": 1,
    "medium": 1
  }
}
```

### GET /health
Health check endpoint

### GET /
API information

## 🐛 Bug Detection Categories

1. **Security Issues**
   - Hardcoded passwords/API keys
   - eval() / exec() usage
   - SQL injection risks
   - Unsafe deserialization

2. **Code Smells**
   - Long functions (>15 lines)
   - Too many parameters
   - Nested loops
   - Global variables

3. **Exception Handling**
   - Bare except clauses
   - Silent exception swallowing

4. **Code Quality**
   - Unused variables
   - Missing documentation

## ✅ Real-time Features

### ✅ Dashboard
- Total issues count → from latest analysis
- Quality score → from backend response
- Files analyzed → from history length
- Chart data → from analysis history

### ✅ Bug Detection
- Bug list → from `bugs` array
- Severity counts → calculated real-time
- Bug details → from backend response
- Filtering → works on real data

### ✅ AI Code Review
- Overall assessment → from `ai_review.overall_assessment`
- Suggestions → from `ai_review.suggestions`
- Positive aspects → from `ai_review.positive_aspects`
- Security/Performance scores → calculated from bugs

### ✅ History
- All analyses → from localStorage
- Timestamps → real analysis times
- Quality scores → from each analysis
- Export to PDF → uses real data

## 🌍 Deployment

### Live Application
The application is deployed at: **[https://codeguard-ai-steel.vercel.app/](https://codeguard-ai-steel.vercel.app/)**

### Deploy Your Own

#### Frontend (Vercel)
1. Fork this repository
2. Connect to Vercel
3. Configure build settings:
   - Framework: Vite
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
4. Deploy!

#### Backend (Railway/Render)
1. Create new service
2. Connect repository
3. Set build command:
   ```bash
   cd backend && pip install -r requirements.txt
   ```
4. Set start command:
   ```bash
   cd backend && python main.py
   ```
5. Deploy!

## 🆘 Troubleshooting

### Backend not reachable
```bash
# Check if backend is running
curl http://localhost:8000/health

# Should return: {"status": "healthy"}
```

### Frontend can't connect
1. Check `.env` file exists in frontend/
2. Verify VITE_API_BASE_URL=http://localhost:8000
3. Restart frontend: `npm run dev`

### No data showing
1. Run an analysis in Code Analyzer first
2. Check browser console for errors
3. Verify localStorage has 'latestAnalysis' key

### Port already in use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or change port in main.py
```
