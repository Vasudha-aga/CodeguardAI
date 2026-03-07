import ast
import re
from typing import Dict, Any, List

class AICodeReviewer:
    """
    AI-powered code reviewer that provides intelligent, human-like feedback
    Simulates senior developer code review with contextual suggestions
    """
    
    def __init__(self):
        self.code = ""
        self.tree = None
        self.bugs = []
    
    def review(self, code: str, bugs: List[Dict]) -> Dict[str, Any]:
        """
        Perform comprehensive AI code review
        Returns structured review with explanation, assessment, and suggestions
        """
        self.code = code
        self.bugs = bugs
        
        try:
            self.tree = ast.parse(code)
        except SyntaxError:
            return {
                "overall_assessment": "The code contains syntax errors that prevent execution.",
                "code_explanation": "Unable to parse code due to syntax errors.",
                "suggestions": ["Fix syntax errors before proceeding"],
                "design_issues": ["Code cannot be analyzed due to syntax errors"],
                "positive_aspects": []
            }
        
        # Analyze code structure
        code_explanation = self.explain_code()
        overall_assessment = self.generate_overall_assessment()
        suggestions = self.generate_suggestions()
        design_issues = self.identify_design_issues()
        positive_aspects = self.identify_positive_aspects()
        
        return {
            "overall_assessment": overall_assessment,
            "code_explanation": code_explanation,
            "suggestions": suggestions,
            "design_issues": design_issues,
            "positive_aspects": positive_aspects
        }
    
    def explain_code(self) -> str:
        """Generate high-level explanation of what the code does"""
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
                "Never hardcode credentials or use dangerous functions like eval(). "
                "Use environment variables and parameterized queries."
            )
        
        # Code structure suggestions
        long_functions = [b for b in self.bugs if "Long Function" in b.get("type", "")]
        if long_functions:
            suggestions.append(
                "📐 Code Structure: Break down long functions into smaller, single-responsibility functions. "
                "This improves readability, testability, and maintainability. "
                "Aim for functions under 15 lines."
            )
        
        # Exception handling
        exception_bugs = [b for b in self.bugs if "Exception" in b.get("type", "")]
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
                "Consider reducing nested loops, limiting function parameters, and avoiding global state."
            )
        
        # Add documentation suggestion if needed
        if '"""' not in self.code and "'''" not in self.code:
            suggestions.append(
                "📝 Documentation: Add docstrings to functions and classes. "
                "Good documentation helps other developers understand your code's purpose and usage."
            )
        
        # Add testing suggestion
        if "test" not in self.code.lower() and "assert" not in self.code.lower():
            suggestions.append(
                "🧪 Testing: Consider adding unit tests to ensure code reliability. "
                "Tests help catch bugs early and make refactoring safer."
            )
        
        # Type hints suggestion
        if "->" not in self.code and ":" not in self.code:
            suggestions.append(
                "🏷️ Type Hints: Add type annotations to function parameters and return values. "
                "This improves code clarity and helps catch type-related bugs early."
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
        
        # Check for separation of concerns
        functions = [node for node in ast.walk(self.tree) if isinstance(node, ast.FunctionDef)]
        if len(functions) == 1 and len(self.code.split('\n')) > 30:
            issues.append(
                "Single large function detected. Consider separating concerns into multiple functions "
                "for better modularity."
            )
        
        # Check for mixed responsibilities
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
        
        # Check for hardcoded values
        hardcoded_strings = [
            node for node in ast.walk(self.tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, str) and len(node.value) > 10
        ]
        if len(hardcoded_strings) > 3:
            issues.append(
                "Multiple hardcoded string values found. Consider moving configuration "
                "to constants or a config file."
            )
        
        # Check for missing error handling
        has_try = any(isinstance(node, ast.Try) for node in ast.walk(self.tree))
        has_risky_operations = any(
            isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and 
            node.func.id in ['open', 'int', 'float']
            for node in ast.walk(self.tree)
        )
        
        if has_risky_operations and not has_try:
            issues.append(
                "No error handling detected for operations that may fail. "
                "Add try-except blocks around file operations and type conversions."
            )
        
        return issues
    
    def identify_positive_aspects(self) -> List[str]:
        """Identify good practices in the code"""
        positives = []
        
        # Check for documentation
        has_docstrings = '"""' in self.code or "'''" in self.code
        if has_docstrings:
            positives.append("✓ Code includes documentation/docstrings")
        
        # Check for type hints
        if "->" in self.code:
            positives.append("✓ Uses type hints for better code clarity")
        
        # Check for error handling
        has_try = any(isinstance(node, ast.Try) for node in ast.walk(self.tree))
        if has_try:
            positives.append("✓ Implements error handling")
        
        # Check for constants
        has_constants = any(
            isinstance(node, ast.Assign) and 
            all(isinstance(t, ast.Name) and t.id.isupper() for t in node.targets)
            for node in ast.walk(self.tree)
        )
        if has_constants:
            positives.append("✓ Uses named constants for better maintainability")
        
        # Check for list comprehensions (pythonic)
        has_comprehensions = any(
            isinstance(node, (ast.ListComp, ast.DictComp))
            for node in ast.walk(self.tree)
        )
        if has_comprehensions:
            positives.append("✓ Uses Pythonic constructs like comprehensions")
        
        # Check for main guard
        if 'if __name__ == "__main__"' in self.code:
            positives.append("✓ Uses if __name__ == '__main__' guard for proper module structure")
        
        if not positives:
            positives.append("Code is functional and can be improved by adopting best practices")
        
        return positives