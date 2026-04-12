import ast
import re
from typing import Dict, Any, List, Optional

class AICodeReviewer:
    """
    AI-powered code reviewer that provides intelligent, human-like feedback
    Simulates senior developer code review with contextual suggestions
    """
    
    def __init__(self):
        self.code = ""
        self.tree: Optional[ast.AST] = None
        self.bugs = []
        self.language = "python"
    
    def review(self, code: str, bugs: List[Dict], language: str = "python") -> Dict[str, Any]:
        """
        Perform comprehensive AI code review
        
        Args:
            code: Source code to review
            bugs: List of detected bugs
            language: Programming language (python, javascript, java, cpp)
        
        Returns structured review with explanation, assessment, and suggestions
        """
        self.code = code
        self.bugs = bugs
        self.language = language.lower()
        
        # Only parse for Python
        if self.language == "python":
            try:
                self.tree = ast.parse(code)
            except SyntaxError:
                return {
                    "overall_assessment": "The code contains syntax errors that prevent execution.",
                    "code_explanation": "Unable to parse code due to syntax errors.",
                    "suggestions": ["Fix syntax errors before proceeding"],
                    "design_issues": ["Code cannot be analyzed due to syntax errors"],
                    "positive_aspects": [],
                    "language_tips": self._get_language_tips()
                }
        
        # Analyze code structure
        code_explanation = self.explain_code()
        overall_assessment = self.generate_overall_assessment()
        suggestions = self.generate_suggestions()
        design_issues = self.identify_design_issues()
        positive_aspects = self.identify_positive_aspects()
        language_tips = self._get_language_tips()
        
        return {
            "overall_assessment": overall_assessment,
            "code_explanation": code_explanation,
            "suggestions": suggestions,
            "design_issues": design_issues,
            "positive_aspects": positive_aspects,
            "language_tips": language_tips
        }
    
    def _get_language_tips(self) -> str:
        """Get language-specific best practice tips"""
        tips = {
            "python": "💡 Python Tips: Follow PEP 8 style guide, use type hints, prefer list comprehensions, and always use context managers for file operations.",
            "javascript": "💡 JavaScript Tips: Use const/let instead of var, adopt ES6+ features, implement proper error handling with try-catch, and avoid callback hell with async/await.",
            "java": "💡 Java Tips: Follow Java naming conventions, use proper OOP principles, prefer composition over inheritance, and always close resources properly.",
            "cpp": "💡 C++ Tips: Use smart pointers for memory management, follow RAII principles, prefer std::array over C-style arrays, and use const-correctness."
        }
        return tips.get(self.language, "")
    
    def explain_code(self) -> str:
        """Generate high-level explanation of what the code does"""
        # Language-specific explanations
        if self.language == "python" and self.tree is not None:
            return self._explain_python_code()
        else:
            return self._explain_generic_code()
    
    def _explain_python_code(self) -> str:
        """Explain Python code using AST"""
        if self.tree is None:
            return ""
            
        functions = [node.name for node in ast.walk(self.tree) if isinstance(node, ast.FunctionDef)]
        classes = [node.name for node in ast.walk(self.tree) if isinstance(node, ast.ClassDef)]
        imports = []
        
        for node in ast.walk(self.tree):
            if isinstance(node, ast.Import):
                imports.extend([alias.name for alias in node.names])
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)
        
        explanation_parts = []
        
        if classes:
            explanation_parts.append(f"This code defines {len(classes)} class(es): {', '.join(classes)}.")
        
        if functions:
            explanation_parts.append(f"It contains {len(functions)} function(s): {', '.join(functions)}.")
        
        if imports:
            unique_imports = list(set(imports))[:5]
            explanation_parts.append(f"The code uses external libraries including: {', '.join(unique_imports)}.")
        
        # Analyze complexity
        total_lines = len(self.code.split('\n'))
        if total_lines < 20:
            explanation_parts.append("This is a relatively small code snippet.")
        elif total_lines < 100:
            explanation_parts.append("This is a moderately-sized module.")
        else:
            explanation_parts.append("This is a substantial codebase.")
        
        if not explanation_parts:
            return "This appears to be a simple script with basic operations."
        
        return " ".join(explanation_parts)
    
    def _explain_generic_code(self) -> str:
        """Explain code for non-Python languages"""
        total_lines = len(self.code.split('\n'))
        
        # Count functions/methods (simple regex)
        function_patterns = {
            "javascript": r'function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>',
            "java": r'(public|private|protected)\s+\w+\s+\w+\s*\(',
            "cpp": r'\w+\s+\w+\s*\([^)]*\)\s*{'
        }
        
        pattern = function_patterns.get(self.language, r'function|def|void')
        functions = re.findall(pattern, self.code)
        
        explanation_parts = []
        
        if len(functions) > 0:
            explanation_parts.append(f"This {self.language} code contains approximately {len(functions)} function(s)/method(s).")
        
        # Analyze size
        if total_lines < 20:
            explanation_parts.append("This is a relatively small code snippet.")
        elif total_lines < 100:
            explanation_parts.append("This is a moderately-sized module.")
        else:
            explanation_parts.append("This is a substantial codebase.")
        
        if not explanation_parts:
            return f"This appears to be a simple {self.language} script with basic operations."
        
        return " ".join(explanation_parts)
    
    def generate_overall_assessment(self) -> str:
        """Generate overall quality assessment"""
        critical_bugs = sum(1 for bug in self.bugs if bug.get("severity") == "Critical")
        high_bugs = sum(1 for bug in self.bugs if bug.get("severity") == "High")
        total_bugs = len(self.bugs)
        
        if critical_bugs > 0:
            return (
                f"⚠️ This code has {critical_bugs} critical issue(s) that must be addressed immediately. "
                "These issues pose security risks or will cause runtime failures. "
                "The code should not be deployed in its current state."
            )
        elif high_bugs > 2:
            return (
                f"The code has {high_bugs} high-severity issues that significantly impact security or reliability. "
                "These should be prioritized for immediate fixing."
            )
        elif total_bugs > 5:
            return (
                f"The code has {total_bugs} issues that should be addressed. "
                "While functional, there are opportunities to improve code quality, maintainability, and security."
            )
        elif total_bugs > 0:
            return (
                f"The code is generally functional with {total_bugs} minor issue(s). "
                "Addressing these will improve code quality and maintainability."
            )
        else:
            return (
                "✅ The code appears clean with no major issues detected. "
                "It follows good practices and is well-structured."
            )
    
    def generate_suggestions(self) -> List[str]:
        """Generate actionable improvement suggestions"""
        suggestions = []
        
        # Security-focused suggestions
        security_bugs = [b for b in self.bugs if b.get("category") == "Security"]
        if security_bugs:
            suggestions.append(
                "🔒 Security: Address all security vulnerabilities immediately. "
                "Never hardcode credentials or use dangerous functions. "
                "Use environment variables and parameterized queries."
            )
        
        # Code structure suggestions
        long_functions = [b for b in self.bugs if "Long Function" in b.get("type", "") or "Long Method" in b.get("type", "")]
        if long_functions:
            max_lines = {"python": 15, "javascript": 20, "java": 25, "cpp": 30}
            recommended = max_lines.get(self.language, 20)
            suggestions.append(
                f"📐 Code Structure: Break down long functions into smaller, single-responsibility functions. "
                f"Aim for functions under {recommended} lines for better readability and maintainability."
            )
        
        # Exception handling
        exception_bugs = [b for b in self.bugs if "Exception" in b.get("type", "") or "catch" in b.get("type", "").lower()]
        if exception_bugs:
            suggestions.append(
                "⚡ Error Handling: Improve exception handling by catching specific exceptions "
                "and logging errors appropriately. Never silently swallow exceptions."
            )
        
        # Code quality
        code_smell_bugs = [b for b in self.bugs if b.get("category") == "Code Smell"]
        if code_smell_bugs:
            suggestions.append(
                "🧹 Code Quality: Refactor to reduce complexity and improve maintainability. "
                "Consider reducing nested loops, limiting function parameters, and following SOLID principles."
            )
        
        # Memory management for C++
        if self.language == "cpp":
            memory_bugs = [b for b in self.bugs if "Memory" in b.get("type", "")]
            if memory_bugs:
                suggestions.append(
                    "🧠 Memory Management: Use smart pointers (unique_ptr, shared_ptr) instead of raw pointers. "
                    "Follow RAII principles to prevent memory leaks."
                )
        
        # Add documentation suggestion
        has_docs = '"""' in self.code or "'''" in self.code or "/*" in self.code or "//" in self.code
        if not has_docs or len(self.code.split('\n')) > 20:
            suggestions.append(
                "📝 Documentation: Add comments and documentation to functions and classes. "
                "Good documentation helps other developers understand your code's purpose and usage."
            )
        
        # Add testing suggestion
        if "test" not in self.code.lower() and "assert" not in self.code.lower():
            suggestions.append(
                "🧪 Testing: Consider adding unit tests to ensure code reliability. "
                "Tests help catch bugs early and make refactoring safer."
            )
        
        if not suggestions:
            suggestions.append(
                "✨ Your code looks good! Consider adding comprehensive tests and documentation "
                "to make it production-ready."
            )
        
        return suggestions
    
    def identify_design_issues(self) -> List[str]:
        """Identify architectural and design problems"""
        issues = []
        
        # Check for mixed responsibilities (Python only with AST)
        if self.language == "python" and self.tree is not None:
            functions = [node for node in ast.walk(self.tree) if isinstance(node, ast.FunctionDef)]
            
            if len(functions) == 1 and len(self.code.split('\n')) > 30:
                issues.append(
                    "Single large function detected. Consider separating concerns into multiple functions "
                    "for better modularity."
                )
            
            has_io = False
            has_logic = False
            
            for node in ast.walk(self.tree):
                if isinstance(node, ast.Call):
                    if isinstance(node.func, ast.Name):
                        if node.func.id in ['print', 'input', 'open']:
                            has_io = True
                        if node.func.id in ['map', 'filter', 'sorted']:
                            has_logic = True
            
            if has_io and has_logic and len(functions) < 3:
                issues.append(
                    "Mixing I/O operations with business logic. Consider separating data access "
                    "from processing logic for better testability."
                )
        
        # Generic checks for all languages
        total_lines = len(self.code.split('\n'))
        if total_lines > 200:
            issues.append(
                "Large file detected. Consider breaking this into smaller, more focused modules."
            )
        
        # Check for deeply nested code
        max_indent = max([len(line) - len(line.lstrip()) for line in self.code.split('\n') if line.strip()], default=0)
        if max_indent > 20:
            issues.append(
                "Deep nesting detected. Consider flattening the code structure or extracting functions."
            )
        
        return issues
    
    def identify_positive_aspects(self) -> List[str]:
        """Identify good practices in the code"""
        positives = []
        
        # Check for documentation
        doc_patterns = ['"""', "'''", "/*", "//", "#"]
        has_docs = any(pattern in self.code for pattern in doc_patterns)
        if has_docs:
            positives.append("✓ Code includes comments and documentation")
        
        # Language-specific positive checks
        if self.language == "python":
            if "->" in self.code:
                positives.append("✓ Uses type hints for better code clarity")
            
            if 'if __name__ == "__main__"' in self.code:
                positives.append("✓ Uses if __name__ == '__main__' guard for proper module structure")
            
            if any(isinstance(node, ast.Try) for node in ast.walk(self.tree)) if self.tree else False:
                positives.append("✓ Implements error handling with try-except blocks")
        
        elif self.language == "javascript":
            if 'const' in self.code or 'let' in self.code:
                positives.append("✓ Uses modern ES6+ variable declarations (const/let)")
            
            if 'async' in self.code and 'await' in self.code:
                positives.append("✓ Uses async/await for asynchronous operations")
        
        elif self.language == "java":
            if re.search(r'@Override|@Test|@Autowired', self.code):
                positives.append("✓ Uses Java annotations appropriately")
            
            if 'try' in self.code and 'catch' in self.code:
                positives.append("✓ Implements proper exception handling")
        
        elif self.language == "cpp":
            if 'std::' in self.code:
                positives.append("✓ Uses std:: namespace prefix for clarity")
            
            if 'unique_ptr' in self.code or 'shared_ptr' in self.code:
                positives.append("✓ Uses smart pointers for memory management")
        
        # Check for reasonable function sizes
        lines = self.code.split('\n')
        if len(lines) < 50 and len(lines) > 5:
            positives.append("✓ Code size is manageable and well-scoped")
        
        if not positives:
            positives.append("Code is functional and can be improved by adopting best practices")
        
        return positives