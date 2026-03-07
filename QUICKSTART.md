# ⚡ QUICK START - CodeGuard AI

## 🚀 3-Minute Setup

### 1️⃣ Start Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
✅ http://localhost:8000

### 2️⃣ Start Frontend (New Terminal)
```bash
cd frontend
npm install  
npm run dev
```
✅ http://localhost:5173

### 3️⃣ Use It!
1. Open http://localhost:5173
2. Go to "Code Analyzer"
3. Paste code → Click "Analyze"
4. See results! 🎉

---

## 🎯 Test Code Samples

### Good Code (High Score)
```python
from typing import List

def fibonacci(n: int) -> List[int]:
    """Calculate Fibonacci sequence."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence
```

### Bad Code (Many Issues)
```python
password = "admin123"
eval(user_input)
query = "SELECT * FROM users WHERE id=" + str(id)
```

---

## 📊 Real-time Features

All pages update automatically:
- ✅ **Dashboard** - Stats from latest analysis
- ✅ **Bug Detection** - Real bugs list
- ✅ **AI Code Review** - AI insights
- ✅ **History** - All analyses

**Zero Hardcoded Values!**

---

## 🆘 Common Issues

**Port 8000 busy:**
```bash
lsof -ti:8000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :8000   # Windows
```

**Can't connect:**
- Check backend is running: http://localhost:8000/health
- Check .env file: `VITE_API_BASE_URL=http://localhost:8000`

**No data showing:**
- Run an analysis in Code Analyzer first!

---

## 📝 How It Works

```
Code → POST /analyze → Backend Analysis
                            ↓
        bugs + ai_review + quality_score
                            ↓
              localStorage.setItem()
                            ↓
        All components reload with real data!
```

---

## 📚 Documentation

- **README.md** - Complete guide
- **SETUP.md** - Detailed setup
- **This file** - Quick reference

---

**Start analyzing code! 🚀**
