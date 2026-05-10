from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any
import logging
import os

# Import language-specific detectors
from detectors import PythonDetector, JavaScriptDetector, JavaDetector, CppDetector
from ai_reviewer import AICodeReviewer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Code Review & Bug Detection System")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount frontend
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/frontend", StaticFiles(directory=frontend_path), name="frontend")

class CodeAnalysisRequest(BaseModel):
    code: str
    language: str = "python"  # NEW: language parameter

class CodeAnalysisResponse(BaseModel):
    success: bool
    bugs: List[Dict[str, Any]]
    ai_review: Dict[str, Any]
    quality_score: int
    summary: Dict[str, Any]
    language: str  # NEW: return language info

# Language detector mapping
DETECTORS = {
    "python": PythonDetector,
    "javascript": JavaScriptDetector,
    "java": JavaDetector,
    "cpp": CppDetector,
    "c++": CppDetector,  # Alias for cpp
}

@app.get("/")
async def root():
    return {
        "message": "AI Code Review & Bug Detection System API",
        "version": "2.0.0",  # Updated version
        "status": "operational",
        "supported_languages": list(DETECTORS.keys())
    }

@app.post("/analyze", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
    """
    Main endpoint for code analysis
    Supports multiple languages: Python, JavaScript, Java, C++
    """
    try:
        code = request.code.strip()
        language = request.language.lower()
        
        if not code:
            raise HTTPException(status_code=400, detail="Code cannot be empty")
        
        # Validate language
        if language not in DETECTORS:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported language: {language}. Supported: {list(DETECTORS.keys())}"
            )
        
        # Get appropriate detector
        DetectorClass = DETECTORS[language]
        bug_detector = DetectorClass()
        ai_reviewer = AICodeReviewer()
        
        # Step 1: Detect bugs
        logger.info(f"Starting {language} bug detection...")
        bugs = bug_detector.detect_bugs(code)
        
        # Step 2: AI code review
        logger.info("Starting AI code review...")
        ai_review = ai_reviewer.review(code, bugs, language=language)
        
        # Step 3: Calculate quality score
        quality_score = calculate_quality_score(bugs, code)
        
        # Step 4: Generate summary
        summary = generate_summary(bugs, quality_score)
        
        return CodeAnalysisResponse(
            success=True,
            bugs=bugs,
            ai_review=ai_review,
            quality_score=quality_score,
            summary=summary,
            language=language
        )
    
    except HTTPException as e:
        raise e
    
    except SyntaxError as e:
        return CodeAnalysisResponse(
            success=True,
            bugs=[{
                "type": "Syntax Error",
                "severity": "Critical",
                "line": 0,
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
            },
            language=request.language.lower()
        )
    
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def calculate_quality_score(bugs: List[Dict], code: str) -> int:
    """Calculate code quality score (0-100)"""
    base_score = 100
    
    for bug in bugs:
        severity = bug.get("severity", "Low").lower()
        if severity == "critical":
            base_score -= 15
        elif severity == "high":
            base_score -= 10
        elif severity == "medium":
            base_score -= 5
        elif severity == "low":
            base_score -= 2
    
    # Bonus for documentation
    lines = code.split('\n')
    if len(lines) > 10:
        # Check for comments
        has_comments = any(line.strip().startswith(('#', '//', '/*', '*', '"""', "'''")) 
                          for line in lines)
        if has_comments:
            base_score += 5
    
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

@app.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    return {
        "languages": [
            {"id": "python", "name": "Python", "extension": ".py"},
            {"id": "javascript", "name": "JavaScript", "extension": ".js"},
            {"id": "java", "name": "Java", "extension": ".java"},
            {"id": "cpp", "name": "C++", "extension": ".cpp"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Multi-Language Code Review System...")
    print("📍 Backend running at: http://localhost:8000")
    print("📊 API Documentation: http://localhost:8000/docs")
    print("🌐 Supported Languages: Python, JavaScript, Java, C++")
    uvicorn.run(app, host=os.environ.get("HOST", "0.0.0.0"), port=int(os.environ.get("PORT", 8000)))