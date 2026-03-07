import ast
import re
from typing import List, Dict, Any

class BugDetector:
    """
    Advanced AST-based bug detection system
    Analyzes Python code for bugs, security issues, and code smells
    """
    
    def __init__(self):
        self.bugs = []
        self.code_lines = []
    
    def analyze(self, code: str) -> List[Dict[str, Any]]:
        """
        Main analysis method
        Returns list of detected bugs and issues
        """
        self.bugs = []
        self.code_lines = code.split('\n')
        
        try:
            tree = ast.parse(code)
            
            # Run all detection rules
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
    
    def detect_long_functions(self, tree: ast.AST):
        """Detect functions longer than 15 lines"""
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                func_lines = node.end_lineno - node.lineno + 1 if hasattr(node, 'end_lineno') else 0
                
                if func_lines > 15:
                    self.bugs.append({
                        "type": "Long Function",
                        "severity": "Medium",
                        "line": node.lineno,
                        "message": f"Function '{node.name}' is {func_lines} lines long (>15 lines)",
                        "category": "Code Smell",
                        "suggestion": "Consider breaking this function into smaller, more focused functions"
                    })
    
    def detect_eval_usage(self, tree: ast.AST):
        """Detect dangerous eval() usage"""
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id == 'eval':
                    self.bugs.append({
                        "type": "Dangerous Function",
                        "severity": "Critical",
                        "line": node.lineno,
                        "message": "Usage of eval() detected - major security risk",
                        "category": "Security",
                        "suggestion": "Never use eval(). Use ast.literal_eval() for safe evaluation or refactor logic"
                    })
                
                if isinstance(node.func, ast.Name) and node.func.id == 'exec':
                    self.bugs.append({
                        "type": "Dangerous Function",
                        "severity": "Critical",
                        "line": node.lineno,
                        "message": "Usage of exec() detected - security vulnerability",
                        "category": "Security",
                        "suggestion": "Avoid exec(). Refactor to use safer alternatives"
                    })
    
    def detect_hardcoded_secrets(self, code: str):
        """Detect hardcoded passwords, API keys, and sensitive data"""
        patterns = [
            (r'password\s*=\s*["\'](.+?)["\']', "Hardcoded Password"),
            (r'api[_-]?key\s*=\s*["\'](.+?)["\']', "Hardcoded API Key"),
            (r'secret\s*=\s*["\'](.+?)["\']', "Hardcoded Secret"),
            (r'token\s*=\s*["\'](.+?)["\']', "Hardcoded Token"),
            (r'aws[_-]?secret\s*=\s*["\'](.+?)["\']', "Hardcoded AWS Secret"),
        ]
        
        for line_num, line in enumerate(self.code_lines, 1):
            for pattern, issue_type in patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    self.bugs.append({
                        "type": issue_type,
                        "severity": "Critical",
                        "line": line_num,
                        "message": f"{issue_type} detected in source code",
                        "category": "Security",
                        "suggestion": "Use environment variables or secure vaults for sensitive data"
                    })
    
    def detect_security_issues(self, tree: ast.AST):
        """Detect various security vulnerabilities"""
        for node in ast.walk(tree):
            # SQL Injection risk
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Attribute):
                    if node.func.attr == 'execute' and any(
                        isinstance(arg, ast.BinOp) and isinstance(arg.op, ast.Add)
                        for arg in node.args
                    ):
                        self.bugs.append({
                            "type": "SQL Injection Risk",
                            "severity": "High",
                            "line": node.lineno,
                            "message": "Possible SQL injection - using string concatenation in execute()",
                            "category": "Security",
                            "suggestion": "Use parameterized queries instead of string concatenation"
                        })
            
            # Pickle usage (deserialization vulnerability)
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name == 'pickle':
                        self.bugs.append({
                            "type": "Insecure Deserialization",
                            "severity": "High",
                            "line": node.lineno,
                            "message": "Pickle module used - can execute arbitrary code",
                            "category": "Security",
                            "suggestion": "Use JSON or safer serialization methods"
                        })
    
    def detect_code_smells(self, tree: ast.AST):
        """Detect code quality issues and anti-patterns"""
        for node in ast.walk(tree):
            # Too many arguments
            if isinstance(node, ast.FunctionDef):
                num_args = len(node.args.args)
                if num_args > 5:
                    self.bugs.append({
                        "type": "Too Many Parameters",
                        "severity": "Low",
                        "line": node.lineno,
                        "message": f"Function '{node.name}' has {num_args} parameters (>5)",
                        "category": "Code Smell",
                        "suggestion": "Consider using a config object or dataclass to group parameters"
                    })
            
            # Nested loops (complexity)
            if isinstance(node, ast.For):
                for child in ast.walk(node):
                    if child != node and isinstance(child, (ast.For, ast.While)):
                        self.bugs.append({
                            "type": "High Complexity",
                            "severity": "Medium",
                            "line": node.lineno,
                            "message": "Nested loops detected - may cause performance issues",
                            "category": "Code Smell",
                            "suggestion": "Consider refactoring to reduce nesting or optimize algorithm"
                        })
                        break
            
            # Global variable usage
            if isinstance(node, ast.Global):
                self.bugs.append({
                    "type": "Global Variable",
                    "severity": "Low",
                    "line": node.lineno,
                    "message": "Global variable usage detected",
                    "category": "Code Smell",
                    "suggestion": "Minimize global state; pass data as function parameters"
                })
    
    def detect_exception_handling_issues(self, tree: ast.AST):
        """Detect poor exception handling practices"""
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler):
                # Bare except clause
                if node.type is None:
                    self.bugs.append({
                        "type": "Bare Except Clause",
                        "severity": "Medium",
                        "line": node.lineno,
                        "message": "Bare except: clause catches all exceptions including system exits",
                        "category": "Code Smell",
                        "suggestion": "Catch specific exceptions (e.g., except ValueError:)"
                    })
                
                # Exception pass (silently swallowing errors)
                if len(node.body) == 1 and isinstance(node.body[0], ast.Pass):
                    self.bugs.append({
                        "type": "Silent Exception",
                        "severity": "High",
                        "line": node.lineno,
                        "message": "Exception caught and ignored - errors will be silently swallowed",
                        "category": "Code Smell",
                        "suggestion": "Log exceptions or handle them appropriately"
                    })
    
    def detect_unused_variables(self, tree: ast.AST):
        """Detect potentially unused variables (basic check)"""
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
        
        # Filter out common patterns like '_' or private variables
        unused = {var for var in unused if not var.startswith('_')}
        
        for var in unused:
            self.bugs.append({
                "type": "Unused Variable",
                "severity": "Low",
                "line": 0,
                "message": f"Variable '{var}' assigned but never used",
                "category": "Code Smell",
                "suggestion": "Remove unused variables to keep code clean"
            })