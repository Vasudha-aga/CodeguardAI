"""JavaScript code detector using regex patterns"""
import re
from typing import List, Dict
from .base_detector import BaseDetector

class JavaScriptDetector(BaseDetector):
    """JavaScript bug detector using pattern matching"""
    
    def get_language(self) -> str:
        return "javascript"
    
    def _parse_code(self, code: str):
        """Basic syntax validation"""
        # Simple check for balanced braces
        if code.count('{') != code.count('}'):
            raise SyntaxError("Unbalanced braces")
        if code.count('(') != code.count(')'):
            raise SyntaxError("Unbalanced parentheses")
        return True
    
    def detect_bugs(self, code: str) -> List[Dict]:
        """Detect bugs in JavaScript code"""
        bugs = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            # == instead of ===
            if '==' in line and '===' not in line and '!=' not in line:
                bugs.append({
                    "type": "Loose Equality",
                    "severity": "Medium",
                    "line": i,
                    "message": "Use '===' instead of '==' for strict equality",
                    "category": "Code Smell",
                    "suggestion": "Replace '==' with '===' to avoid type coercion"
                })
            
            # var instead of let/const
            if re.search(r'\bvar\s+', line):
                bugs.append({
                    "type": "Deprecated Var",
                    "severity": "Low",
                    "line": i,
                    "message": "Use 'let' or 'const' instead of 'var'",
                    "category": "Code Smell",
                    "suggestion": "Modern JavaScript prefers 'let' and 'const'"
                })
            
            # eval() usage
            if 'eval(' in line:
                bugs.append({
                    "type": "Dangerous Function",
                    "severity": "Critical",
                    "line": i,
                    "message": "eval() can execute arbitrary code",
                    "category": "Security",
                    "suggestion": "Avoid eval() - use safer alternatives"
                })
            
            # Hardcoded secrets
            secret_patterns = [
                (r'apiKey\s*[:=]\s*["\']', "Hardcoded API Key"),
                (r'password\s*[:=]\s*["\']', "Hardcoded Password"),
                (r'secret\s*[:=]\s*["\']', "Hardcoded Secret"),
                (r'token\s*[:=]\s*["\']', "Hardcoded Token"),
            ]
            
            for pattern, bug_type in secret_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    bugs.append({
                        "type": bug_type,
                        "severity": "Critical",
                        "line": i,
                        "message": f"{bug_type} detected",
                        "category": "Security",
                        "suggestion": "Use environment variables"
                    })
            
            # console.log in production
            if 'console.log(' in line:
                bugs.append({
                    "type": "Debug Statement",
                    "severity": "Low",
                    "line": i,
                    "message": "console.log() found - remove before production",
                    "category": "Code Smell",
                    "suggestion": "Use proper logging library"
                })
            
            # Missing semicolon (simplified check)
            stripped = line.strip()
            if stripped and not stripped.endswith((';', '{', '}', ',')):
                if any(keyword in stripped for keyword in ['let', 'const', 'var', 'return']):
                    bugs.append({
                        "type": "Missing Semicolon",
                        "severity": "Low",
                        "line": i,
                        "message": "Statement might be missing semicolon",
                        "category": "Code Smell",
                        "suggestion": "Add semicolon for clarity"
                    })
        
        # Function length check
        in_function = False
        function_start = 0
        function_name = ""
        brace_count = 0
        
        for i, line in enumerate(lines, 1):
            if 'function ' in line or '=>' in line:
                in_function = True
                function_start = i
                match = re.search(r'function\s+(\w+)', line)
                function_name = match.group(1) if match else "anonymous"
                brace_count = line.count('{') - line.count('}')
            elif in_function:
                brace_count += line.count('{') - line.count('}')
                if brace_count == 0:
                    function_length = i - function_start
                    if function_length > 20:
                        bugs.append({
                            "type": "Long Function",
                            "severity": "Medium",
                            "line": function_start,
                            "message": f"Function '{function_name}' is {function_length} lines long",
                            "category": "Code Smell",
                            "suggestion": "Break into smaller functions (recommended: ≤20 lines)"
                        })
                    in_function = False
        
        return bugs