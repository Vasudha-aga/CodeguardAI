# 📋 SETUP GUIDE - CodeGuard AI

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Setup](#quick-setup)
3. [Manual Setup](#manual-setup)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Required Software
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Check Installed Versions
```bash
python --version   # or python3 --version
node --version
npm --version
```

---

## Quick Setup

### Option 1: Automated Script

#### Windows:
```cmd
start.bat
```

#### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

The script will:
- ✅ Install all dependencies
- ✅ Start backend (port 8000)
- ✅ Start frontend (port 5173)
- ✅ Open in browser automatically

---

## Manual Setup

If automated script doesn't work, follow these steps:

### Step 1: Setup Backend

```bash
# Go to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```

**Expected Output:**
```
🚀 Starting AI Code Review & Bug Detection System...
🔧 Backend running at: http://localhost:8000
📊 API Documentation: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Verify:** Open http://localhost:8000 in browser

---

### Step 2: Setup Frontend

**Open a NEW terminal** (keep backend running):

```bash
# Go to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

✅ **Verify:** Open http://localhost:5173 in browser

---

## Testing

### Test 1: Basic Analysis

1. Go to http://localhost:5173
2. Click "Code Analyzer" in sidebar
3. Paste this code:

```python
def hello():
    print("Hello World")
```

4. Click "Analyze Code"
5. Should show: High quality score (90-100)

---

### Test 2: Security Issues

Paste this code:

```python
import pickle

password = "admin123"
api_key = "sk-1234567890"

user_input = input("Enter code: ")
eval(user_input)

query = "SELECT * FROM users WHERE id=" + str(user_id)
```

Expected Results:
- ❌ Critical: Hardcoded credentials
- ❌ Critical: eval() usage
- ❌ High: SQL injection
- ❌ High: Pickle usage
- 📉 Quality Score: 0-30

---

### Test 3: Real-time Updates

1. Analyze code (Test 2)
2. Go to "Dashboard" → Should show stats
3. Go to "Bug Detection" → Should list bugs
4. Go to "AI Code Review" → Should show AI insights
5. Go to "History" → Should show analysis entry

**All pages should show REAL data from your analysis!**

---

## Troubleshooting

### Issue 1: Backend not starting

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

### Issue 2: Port 8000 already in use

**Windows:**
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Or change port in `backend/main.py`:**
```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

Then update `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8001
```

---

### Issue 3: Frontend can't connect to backend

**Symptoms:**
- "Backend not reachable" error
- Network errors in console

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status": "healthy", ...}
   ```

2. **Check .env file:**
   ```bash
   cd frontend
   cat .env  # Should show: VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Restart frontend:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

---

### Issue 4: npm install fails

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

### Issue 5: No data showing on pages

**Cause:** No analysis has been run yet

**Solution:**
1. Go to "Code Analyzer"
2. Paste any Python code
3. Click "Analyze Code"
4. Now all pages will show real data!

---

### Issue 6: Python command not found

**Windows:** Use `python` instead of `python3`

**Linux/Mac:** Use `python3` instead of `python`

---

## Port Configuration

### Change Backend Port (from 8000)

Edit `backend/main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=YOUR_PORT)
```

Update `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:YOUR_PORT
```

### Change Frontend Port (from 5173)

Edit `frontend/vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: YOUR_PORT
  }
})
```

---

## Success Checklist

Before using the app, verify:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can analyze code successfully
- [ ] Dashboard shows real data
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## File Structure Check

Ensure your project has this structure:

```
codeguard-ai-v2/
├── backend/
│   ├── main.py
│   ├── ai_reviewer.py
│   ├── bug_detector.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env (create from .env.example)
├── README.md
├── start.sh (Linux/Mac)
└── start.bat (Windows)
```

---

## Next Steps

Once everything is running:

1. ✅ Try different code samples
2. ✅ Explore all pages (Dashboard, Bug Detection, AI Review, History)
3. ✅ Check API docs at http://localhost:8000/docs
4. ✅ Export reports as PDF
5. ✅ Customize and extend!

---

## Getting Help

If you still face issues:

1. Check browser console (F12)
2. Check terminal output for errors
3. Verify all files are present
4. Try restarting both servers
5. Check the main README.md

---

## 🎉 You're All Set!

Your CodeGuard AI is ready to analyze code with:
- ✅ Zero hardcoded values
- ✅ Real-time updates
- ✅ Full backend integration
- ✅ Beautiful UI

**Happy Coding! 🚀**
