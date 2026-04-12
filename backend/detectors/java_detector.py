"""Java code detector using regex patterns"""
import re
from typing import List, Dict
from .base_detector import BaseDetector

class JavaDetector(BaseDetector):
    """Java bug detector using pattern matching"""
    
    def get_language(self) -> str:
        return "java"
    
    def _parse_code(self, code: str):
        """Basic syntax validation"""
        if code.count('{') != code.count('}'):
            raise SyntaxError("Unbalanced braces")
        if code.count('(') != code.count(')'):
            raise SyntaxError("Unbalanced parentheses")
        return True
    
    def detect_bugs(self, code: str) -> List[Dict]:
        """Detect bugs in Java code"""
        bugs = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            # System.out.println (debug statement)
            if 'System.out.println(' in line:
                bugs.append({
                    "type": "Debug Statement",
                    "severity": "Low",
                    "line": i,
                    "message": "System.out.println() found - use proper logging",
                    "category": "Code Smell",
                    "suggestion": "Use Log4j or SLF4J instead"
                })
            
            # Hardcoded secrets
            secret_patterns = [
                (r'String\s+password\s*=\s*"', "Hardcoded Password"),
                (r'String\s+apiKey\s*=\s*"', "Hardcoded API Key"),
                (r'String\s+secret\s*=\s*"', "Hardcoded Secret"),
            ]
            
            for pattern, bug_type in secret_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    bugs.append({
                        "type": bug_type,
                        "severity": "Critical",
                        "line": i,
                        "message": f"{bug_type} detected",
                        "category": "Security",
                        "suggestion": "Use configuration files or environment variables"
                    })
            
            # Empty catch block
            if 'catch' in line:
                # Check next few lines for empty block
                next_line_idx = i
                if next_line_idx < len(lines):
                    next_line = lines[next_line_idx].strip()
                    if next_line == '}' or next_line == '{}':
                        bugs.append({
                            "type": "Empty Catch Block",
                            "severity": "High",
                            "line": i,
                            "message": "Empty catch block suppresses exceptions",
                            "category": "Exception Handling",
                            "suggestion": "At minimum, log the exception"
                        })
            
            # SQL concatenation (SQL Injection risk)
            if re.search(r'executeQuery.*\+', line) or re.search(r'executeUpdate.*\+', line):
                bugs.append({
                    "type": "SQL Injection Risk",
                    "severity": "Critical",
                    "line": i,
                    "message": "String concatenation in SQL query",
                    "category": "Security",
                    "suggestion": "Use PreparedStatement instead"
                })
            
            # Magic numbers
            if re.search(r'=\s*\d{2,}[^.]', line):
                bugs.append({
                    "type": "Magic Number",
                    "severity": "Low",
                    "line": i,
                    "message": "Magic number detected",
                    "category": "Code Smell",
                    "suggestion": "Define as named constant"
                })
        
        # Method length check
        in_method = False
        method_start = 0
        method_name = ""
        brace_count = 0
        
        for i, line in enumerate(lines, 1):
            # Detect method declaration
            method_match = re.search(r'(public|private|protected).*\s+(\w+)\s*\(', line)
            if method_match and '{' in line:
                in_method = True
                method_start = i
                method_name = method_match.group(2)
                brace_count = line.count('{') - line.count('}')
            elif in_method:
                brace_count += line.count('{') - line.count('}')
                if brace_count == 0:
                    method_length = i - method_start
                    if method_length > 25:
                        bugs.append({
                            "type": "Long Method",
                            "severity": "Medium",
                            "line": method_start,
                            "message": f"Method '{method_name}' is {method_length} lines long",
                            "category": "Code Smell",
                            "suggestion": "Break into smaller methods (recommended: ≤25 lines)"
                        })
                    in_method = False
        
        return bugs