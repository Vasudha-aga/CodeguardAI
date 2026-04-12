"""C++ code detector using regex patterns"""
import re
from typing import List, Dict
from .base_detector import BaseDetector

class CppDetector(BaseDetector):
    """C++ bug detector using pattern matching"""
    
    def get_language(self) -> str:
        return "cpp"
    
    def _parse_code(self, code: str):
        """Basic syntax validation"""
        if code.count('{') != code.count('}'):
            raise SyntaxError("Unbalanced braces")
        if code.count('(') != code.count(')'):
            raise SyntaxError("Unbalanced parentheses")
        return True
    
    def detect_bugs(self, code: str) -> List[Dict]:
        """Detect bugs in C++ code"""
        bugs = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Memory leak - new without delete
            if 'new ' in line and 'delete' not in code:
                bugs.append({
                    "type": "Potential Memory Leak",
                    "severity": "High",
                    "line": i,
                    "message": "'new' found but no corresponding 'delete'",
                    "category": "Memory Management",
                    "suggestion": "Use smart pointers or ensure proper delete"
                })
            
            # Using namespace std in header
            if 'using namespace std' in line:
                bugs.append({
                    "type": "Namespace Pollution",
                    "severity": "Medium",
                    "line": i,
                    "message": "'using namespace std' pollutes global namespace",
                    "category": "Code Smell",
                    "suggestion": "Use specific imports or std:: prefix"
                })
            
            # C-style cast
            if re.search(r'\([a-zA-Z_]\w*\s*\*?\)\s*\w+', line):
                bugs.append({
                    "type": "C-Style Cast",
                    "severity": "Low",
                    "line": i,
                    "message": "C-style cast detected",
                    "category": "Code Smell",
                    "suggestion": "Use C++ casts (static_cast, dynamic_cast, etc.)"
                })
            
            # Buffer overflow risk - gets(), strcpy()
            dangerous_functions = ['gets(', 'strcpy(', 'strcat(', 'sprintf(']
            for func in dangerous_functions:
                if func in line:
                    bugs.append({
                        "type": "Buffer Overflow Risk",
                        "severity": "Critical",
                        "line": i,
                        "message": f"Dangerous function {func[:-1]}() detected",
                        "category": "Security",
                        "suggestion": "Use safer alternatives (fgets, strncpy, snprintf)"
                    })
            
            # Uninitialized pointer
            if re.search(r'\*\s*\w+\s*;', line) and '=' not in line:
                bugs.append({
                    "type": "Uninitialized Pointer",
                    "severity": "High",
                    "line": i,
                    "message": "Pointer declared but not initialized",
                    "category": "Memory Management",
                    "suggestion": "Initialize pointer to nullptr"
                })
            
            # Missing virtual destructor
            if 'class ' in line and 'virtual' in code:
                # Check if there's a virtual destructor
                if '~' not in code or 'virtual ~' not in code:
                    bugs.append({
                        "type": "Missing Virtual Destructor",
                        "severity": "Medium",
                        "line": i,
                        "message": "Class with virtual functions needs virtual destructor",
                        "category": "Code Smell",
                        "suggestion": "Add virtual destructor"
                    })
        
        # Function length check
        in_function = False
        function_start = 0
        function_name = ""
        brace_count = 0
        
        for i, line in enumerate(lines, 1):
            # Detect function definition
            func_match = re.search(r'(\w+)\s*\([^)]*\)\s*{', line)
            if func_match and 'if' not in line and 'while' not in line and 'for' not in line:
                in_function = True
                function_start = i
                function_name = func_match.group(1)
                brace_count = line.count('{') - line.count('}')
            elif in_function:
                brace_count += line.count('{') - line.count('}')
                if brace_count == 0:
                    function_length = i - function_start
                    if function_length > 30:
                        bugs.append({
                            "type": "Long Function",
                            "severity": "Medium",
                            "line": function_start,
                            "message": f"Function '{function_name}' is {function_length} lines long",
                            "category": "Code Smell",
                            "suggestion": "Break into smaller functions (recommended: ≤30 lines)"
                        })
                    in_function = False
        
        return bugs