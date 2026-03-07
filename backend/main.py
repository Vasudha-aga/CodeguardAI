from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any
import logging
import os

from bug_detector import BugDetector
from ai_reviewer import AICodeReviewer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Code Review & Bug Detection System")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount frontend static files
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/frontend", StaticFiles(directory=frontend_path), name="frontend")

class CodeAnalysisRequest(BaseModel):
    code: str

class CodeAnalysisResponse(BaseModel):
    success: bool
    bugs: List[Dict[str, Any]]
    ai_review: Dict[str, Any]
    quality_score: int
    summary: Dict[str, Any]

@app.get("/")
async def root():
    return {
        "message": "AI Code Review & Bug Detection System API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.post("/analyze", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
    """
    Main endpoint for code analysis
    Performs bug detection and AI code review
    """
    try:
        code = request.code.strip()
        
        if not code:
            raise HTTPException(status_code=400, detail="Code cannot be empty")
        
        # Initialize analyzers
        bug_detector = BugDetector()
        ai_reviewer = AICodeReviewer()
        
        # Step 1: Detect bugs using AST-based analysis
        logger.info("Starting bug detection...")
        bugs = bug_detector.analyze(code)
        
        # Step 2: Perform AI code review
        logger.info("Starting AI code review...")
        ai_review = ai_reviewer.review(code, bugs)
        
        # Step 3: Calculate quality score
        quality_score = calculate_quality_score(bugs, code)
        
        # Step 4: Generate summary
        summary = generate_summary(bugs, quality_score)
        
        return CodeAnalysisResponse(
            success=True,
            bugs=bugs,
            ai_review=ai_review,
            quality_score=quality_score,
            summary=summary
        )
    
    except SyntaxError as e:
        # Handle Python syntax errors
        return CodeAnalysisResponse(
            success=True,
            bugs=[{
                "type": "Syntax Error",
                "severity": "Critical",
                "line": e.lineno if hasattr(e, 'lineno') else 0,
                "message": f"Syntax Error: {str(e)}",
                "category": "Syntax"
            }],
            ai_review={
                "overall_assessment": "Code contains syntax errors and cannot be executed.",
                "suggestions": ["Fix syntax errors before proceeding with analysis"],
                "code_explanation": "Unable to parse code due to syntax errors"
            },
            quality_score=0,
            summary={
                "total_issues": 1,
                "critical": 1,
                "high": 0,
                "medium": 0,
                "low": 0
            }
        )
    
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def calculate_quality_score(bugs: List[Dict], code: str) -> int:
    """
    Calculate code quality score (0-100)
    Higher score = better quality
    """
    base_score = 100
    
    # Deduct points based on bug severity
    for bug in bugs:
        severity = bug.get("severity", "Low")
        if severity == "Critical":
            base_score -= 15
        elif severity == "High":
            base_score -= 10
        elif severity == "Medium":
            base_score -= 5
        elif severity == "Low":
            base_score -= 2
    
    # Bonus for good practices
    lines = code.split('\n')
    if len(lines) > 10 and any('"""' in line or "'''" in line for line in lines):
        base_score += 5  # Has documentation
    
    # Ensure score is between 0 and 100
    return max(0, min(100, base_score))

def generate_summary(bugs: List[Dict], quality_score: int) -> Dict[str, Any]:
    """Generate analysis summary"""
    severity_counts = {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0
    }
    
    for bug in bugs:
        severity = bug.get("severity", "Low").lower()
        if severity in severity_counts:
            severity_counts[severity] += 1
    
    return {
        "total_issues": len(bugs),
        "critical": severity_counts["critical"],
        "high": severity_counts["high"],
        "medium": severity_counts["medium"],
        "low": severity_counts["low"],
        "quality_score": quality_score,
        "status": "Poor" if quality_score < 50 else "Fair" if quality_score < 75 else "Good"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "code-analyzer"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Code Review & Bug Detection System...")
    print("📍 Backend running at: http://localhost:8000")
    print("📊 API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)