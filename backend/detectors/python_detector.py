"""Python code detector using AST"""
import ast
import re
from typing import List, Dict
from .base_detector import BaseDetector

class PythonDetector(BaseDetector):
    """Python bug detector using AST analysis"""
    
    def __init__(self):
        super().__init__()
        self.bugs = []
        self.code_lines = []
    
    def get_language(self) -> str:
        return "python"
    
    def _parse_code(self, code: str):
        """Parse Python code into AST"""
        return ast.parse(code)
    
    def detect_bugs(self, code: str) -> List[Dict]:
        """Detect bugs in Python code"""
        self.bugs = []
        self.code_lines = code.split('\n')
        
        try:
            tree = ast.parse(code)
            
            # Run all detection rules (copy from your existing bug_detector.py)
            self.detect_long_functions(tree)
            self.detect_eval_usage(tree)
            self.detect_hardcoded_secrets(code)
            self.detect_security_issues(tree)
            self.detect_code_smells(tree)
            self.detect_exception_handling_issues(tree)
            self.detect_unused_variables(tree)
            
        except SyntaxError as e:
            self.bugs.append({
                "type": "Syntax Error",
                "severity": "Critical",
                "line": e.lineno if hasattr(e, 'lineno') else 0,
                "message": f"Syntax error: {str(e)}",
                "category": "Syntax",
                "suggestion": "Fix syntax errors to enable further analysis"
            })
        
        return self.bugs
    
    # COPY ALL YOUR EXISTING DETECTION METHODS FROM bug_detector.py HERE:
    # detect_long_functions, detect_eval_usage, detect_hardcoded_secrets, etc.
    
    def detect_long_functions(self, tree: ast.AST):
        """Detect functions longer than 15 lines"""
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                if hasattr(node, 'end_lineno'):
                    line_count = node.end_lineno - node.lineno
                    if line_count > 15:
                        self.bugs.append({
                            "type": "Long Function",
                            "severity": "Medium",
                            "line": node.lineno,
                            "message": f"Function '{node.name}' is {line_count} lines long (recommended: ≤15)",
                            "category": "Code Smell",
                            "suggestion": "Break down into smaller, focused functions"
                        })
    
    def detect_eval_usage(self, tree: ast.AST):
        """Detect dangerous eval() usage"""
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id in ['eval', 'exec']:
                    self.bugs.append({
                        "type": "Dangerous Function",
                        "severity": "Critical",
                        "line": node.lineno,
                        "message": f"Avoid using {node.func.id}() - can execute arbitrary code",
                        "category": "Security",
                        "suggestion": "Use safer alternatives or validate input strictly"
                    })
    
    def detect_hardcoded_secrets(self, code: str):
        """Detect hardcoded passwords and secrets"""
        patterns = [
            (r'password\s*=\s*["\'].*["\']', "Hardcoded Password"),
            (r'api_key\s*=\s*["\'].*["\']', "Hardcoded API Key"),
            (r'secret\s*=\s*["\'].*["\']', "Hardcoded Secret"),
            (r'token\s*=\s*["\'].*["\']', "Hardcoded Token"),
        ]
        
        for i, line in enumerate(self.code_lines, 1):
            for pattern, bug_type in patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    self.bugs.append({
                        "type": bug_type,
                        "severity": "Critical",
                        "line": i,
                        "message": f"{bug_type} detected. Never hardcode sensitive data",
                        "category": "Security",
                        "suggestion": "Use environment variables or secure vaults"
                    })
    
    def detect_security_issues(self, tree: ast.AST):
        """Detect SQL injection and other security issues"""
        for node in ast.walk(tree):
            # SQL Injection
            if isinstance(node, ast.Call):
                if hasattr(node.func, 'attr') and node.func.attr == 'execute':
                    for arg in node.args:
                        if isinstance(arg, ast.BinOp) and isinstance(arg.op, ast.Add):
                            self.bugs.append({
                                "type": "SQL Injection Risk",
                                "severity": "Critical",
                                "line": node.lineno,
                                "message": "Potential SQL injection from string concatenation",
                                "category": "Security",
                                "suggestion": "Use parameterized queries"
                            })
    
    def detect_code_smells(self, tree: ast.AST):
        """Detect code quality issues"""
        for node in ast.walk(tree):
            # Too many parameters
            if isinstance(node, ast.FunctionDef):
                arg_count = len(node.args.args)
                if arg_count > 5:
                    self.bugs.append({
                        "type": "Too Many Parameters",
                        "severity": "Medium",
                        "line": node.lineno,
                        "message": f"Function '{node.name}' has {arg_count} parameters",
                        "category": "Code Smell",
                        "suggestion": "Consider using a configuration object"
                    })
            
            # Nested loops
            if isinstance(node, ast.For) or isinstance(node, ast.While):
                for child in ast.walk(node):
                    if child != node and (isinstance(child, ast.For) or isinstance(child, ast.While)):
                        self.bugs.append({
                            "type": "Nested Loop",
                            "severity": "Medium",
                            "line": node.lineno,
                            "message": "Nested loops can impact performance",
                            "category": "Performance",
                            "suggestion": "Consider refactoring or using list comprehensions"
                        })
                        break
    
    def detect_exception_handling_issues(self, tree: ast.AST):
        """Detect poor exception handling"""
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler):
                # Bare except
                if node.type is None:
                    self.bugs.append({
                        "type": "Bare Except Clause",
                        "severity": "High",
                        "line": node.lineno,
                        "message": "Bare 'except:' catches all exceptions including system exits",
                        "category": "Exception Handling",
                        "suggestion": "Catch specific exceptions"
                    })
                
                # Empty except block
                if not node.body or (len(node.body) == 1 and isinstance(node.body[0], ast.Pass)):
                    self.bugs.append({
                        "type": "Silent Exception",
                        "severity": "High",
                        "line": node.lineno,
                        "message": "Empty except block silently catches errors",
                        "category": "Exception Handling",
                        "suggestion": "At minimum, log the exception"
                    })
    
    def detect_unused_variables(self, tree: ast.AST):
        """Detect unused variables (simplified)"""
        assigned_vars = set()
        used_vars = set()
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        assigned_vars.add(target.id)
            
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
                used_vars.add(node.id)
        
        unused = assigned_vars - used_vars
        for var in unused:
            if not var.startswith('_'):  # Ignore private variables
                self.bugs.append({
                    "type": "Unused Variable",
                    "severity": "Low",
                    "line": 0,
                    "message": f"Variable '{var}' is assigned but never used",
                    "category": "Code Smell",
                    "suggestion": "Remove unused variables or prefix with '_' if intentional"
                })