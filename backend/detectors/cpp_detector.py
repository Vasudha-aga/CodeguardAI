# """C++ code detector using regex patterns"""
# import re
# from typing import List, Dict
# from .base_detector import BaseDetector

# class CppDetector(BaseDetector):
#     """C++ bug detector using pattern matching"""
    
#     def get_language(self) -> str:
#         return "cpp"
    
#     def _parse_code(self, code: str):
#         """Basic syntax validation"""
#         if code.count('{') != code.count('}'):
#             raise SyntaxError("Unbalanced braces")
#         if code.count('(') != code.count(')'):
#             raise SyntaxError("Unbalanced parentheses")
#         return True
    
#     def detect_bugs(self, code: str) -> List[Dict]:
#         """Detect bugs in C++ code"""
#         bugs = []
#         lines = code.split('\n')
        
#         for i, line in enumerate(lines, 1):
#             # Memory leak - new without delete
#             if 'new ' in line and 'delete' not in code:
#                 bugs.append({
#                     "type": "Potential Memory Leak",
#                     "severity": "High",
#                     "line": i,
#                     "message": "'new' found but no corresponding 'delete'",
#                     "category": "Memory Management",
#                     "suggestion": "Use smart pointers or ensure proper delete"
#                 })
            
#             # Using namespace std in header
#             if 'using namespace std' in line:
#                 bugs.append({
#                     "type": "Namespace Pollution",
#                     "severity": "Medium",
#                     "line": i,
#                     "message": "'using namespace std' pollutes global namespace",
#                     "category": "Code Smell",
#                     "suggestion": "Use specific imports or std:: prefix"
#                 })
            
#             # C-style cast
#             if re.search(r'\([a-zA-Z_]\w*\s*\*?\)\s*\w+', line):
#                 bugs.append({
#                     "type": "C-Style Cast",
#                     "severity": "Low",
#                     "line": i,
#                     "message": "C-style cast detected",
#                     "category": "Code Smell",
#                     "suggestion": "Use C++ casts (static_cast, dynamic_cast, etc.)"
#                 })
            
#             # Buffer overflow risk - gets(), strcpy()
#             dangerous_functions = ['gets(', 'strcpy(', 'strcat(', 'sprintf(']
#             for func in dangerous_functions:
#                 if func in line:
#                     bugs.append({
#                         "type": "Buffer Overflow Risk",
#                         "severity": "Critical",
#                         "line": i,
#                         "message": f"Dangerous function {func[:-1]}() detected",
#                         "category": "Security",
#                         "suggestion": "Use safer alternatives (fgets, strncpy, snprintf)"
#                     })
            
#             # Uninitialized pointer
#             if re.search(r'\*\s*\w+\s*;', line) and '=' not in line:
#                 bugs.append({
#                     "type": "Uninitialized Pointer",
#                     "severity": "High",
#                     "line": i,
#                     "message": "Pointer declared but not initialized",
#                     "category": "Memory Management",
#                     "suggestion": "Initialize pointer to nullptr"
#                 })
            
#             # Missing virtual destructor
#             if 'class ' in line and 'virtual' in code:
#                 # Check if there's a virtual destructor
#                 if '~' not in code or 'virtual ~' not in code:
#                     bugs.append({
#                         "type": "Missing Virtual Destructor",
#                         "severity": "Medium",
#                         "line": i,
#                         "message": "Class with virtual functions needs virtual destructor",
#                         "category": "Code Smell",
#                         "suggestion": "Add virtual destructor"
#                     })
        
#         # Function length check
#         in_function = False
#         function_start = 0
#         function_name = ""
#         brace_count = 0
        
#         for i, line in enumerate(lines, 1):
#             # Detect function definition
#             func_match = re.search(r'(\w+)\s*\([^)]*\)\s*{', line)
#             if func_match and 'if' not in line and 'while' not in line and 'for' not in line:
#                 in_function = True
#                 function_start = i
#                 function_name = func_match.group(1)
#                 brace_count = line.count('{') - line.count('}')
#             elif in_function:
#                 brace_count += line.count('{') - line.count('}')
#                 if brace_count == 0:
#                     function_length = i - function_start
#                     if function_length > 30:
#                         bugs.append({
#                             "type": "Long Function",
#                             "severity": "Medium",
#                             "line": function_start,
#                             "message": f"Function '{function_name}' is {function_length} lines long",
#                             "category": "Code Smell",
#                             "suggestion": "Break into smaller functions (recommended: ≤30 lines)"
#                         })
#                     in_function = False
        
#         return bugs
import re
from typing import List, Dict
from .base_detector import BaseDetector

class CppDetector(BaseDetector):
    def get_language(self) -> str:
        return "cpp"
    
    def detect_bugs(self, code: str) -> List[Dict]:
        bugs = []
        lines = code.split('\n')
        
        # 1. Missing Semicolon Detection
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            # Skip empty lines, comments, and lines that shouldn't have semicolons
            if not stripped or stripped.startswith('//') or stripped.startswith('/*'):
                continue
            
            # Check if line needs semicolon but doesn't have it
            if any(keyword in stripped for keyword in ['cout', 'cin', 'return', 'int ', 'float ', 'double ', 'char ', 'std::', 'using']):
                if not stripped.endswith((';', '{', '}', ':', ')', '#')):
                    # Check if it's not a function/class declaration
                    if not re.search(r'\b(if|else|while|for|switch|class|struct|namespace|void|int|float|double)\s*\(', stripped):
                        if not stripped.endswith('\\'):  # Not a multiline continuation
                            bugs.append({
                                "type": "Missing Semicolon",
                                "severity": "high",
                                "category": "Syntax Error",
                                "message": f"Statement missing semicolon",
                                "line": i,
                                "code": stripped,
                                "suggestion": "Add semicolon at the end of the statement"
                            })
        
        # 2. Memory Leak Detection
        new_pattern = r'\bnew\s+'
        delete_pattern = r'\bdelete\s+'
        
        has_new = bool(re.search(new_pattern, code))
        has_delete = bool(re.search(delete_pattern, code))
        
        if has_new and not has_delete:
            bugs.append({
                "type": "Memory Leak",
                "severity": "critical",
                "category": "Memory Management",
                "message": "Memory allocated with 'new' but not deallocated with 'delete'",
                "suggestion": "Use smart pointers (unique_ptr, shared_ptr) or ensure proper delete calls",
                "line": self._find_pattern_line(code, new_pattern)
            })
        
        # 3. Namespace Pollution
        if re.search(r'using\s+namespace\s+std\s*;', code):
            bugs.append({
                "type": "Namespace Pollution",
                "severity": "medium",
                "category": "Code Smell",
                "message": "Using 'using namespace std;' can cause name conflicts",
                "suggestion": "Use std:: prefix or specific using declarations",
                "line": self._find_pattern_line(code, r'using\s+namespace\s+std')
            })
        
        # 4. C-style Cast
        c_cast = re.search(r'\([a-zA-Z_][a-zA-Z0-9_]*\s*\*?\)', code)
        if c_cast:
            bugs.append({
                "type": "C-style Cast",
                "severity": "medium",
                "category": "Code Quality",
                "message": "C-style cast detected. Consider using C++ casts",
                "suggestion": "Use static_cast, dynamic_cast, or reinterpret_cast",
                "line": self._find_pattern_line(code, r'\([a-zA-Z_][a-zA-Z0-9_]*\s*\*?\)')
            })
        
        # 5. Buffer Overflow Risks
        dangerous_functions = ['gets', 'strcpy', 'strcat', 'sprintf']
        for func in dangerous_functions:
            if re.search(rf'\b{func}\s*\(', code):
                bugs.append({
                    "type": "Buffer Overflow Risk",
                    "severity": "critical",
                    "category": "Security",
                    "message": f"Using dangerous function '{func}' which can cause buffer overflow",
                    "suggestion": f"Use safer alternatives like fgets, strncpy, strncat, or snprintf",
                    "line": self._find_pattern_line(code, rf'\b{func}\s*\(')
                })
        
        # 6. Uninitialized Pointers
        pointer_declarations = re.finditer(r'\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\*\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*;', code)
        for match in pointer_declarations:
            bugs.append({
                "type": "Uninitialized Pointer",
                "severity": "high",
                "category": "Memory Management",
                "message": f"Pointer '{match.group(2)}' declared but not initialized",
                "suggestion": "Initialize pointer to nullptr or valid address",
                "line": self._find_pattern_line(code, match.group(0))
            })
        
        # 7. Long Functions
        functions = re.finditer(r'(\w+)\s+(\w+)\s*\([^)]*\)\s*\{', code)
        for func_match in functions:
            func_start = func_match.start()
            func_name = func_match.group(2)
            
            # Count lines in function (simple heuristic)
            brace_count = 0
            func_lines = 0
            in_function = False
            
            for i, char in enumerate(code[func_start:], start=func_start):
                if char == '{':
                    brace_count += 1
                    in_function = True
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0 and in_function:
                        break
                elif char == '\n' and in_function:
                    func_lines += 1
            
            if func_lines > 30:
                bugs.append({
                    "type": "Long Function",
                    "severity": "medium",
                    "category": "Code Smell",
                    "message": f"Function '{func_name}' is too long ({func_lines} lines)",
                    "suggestion": "Break down into smaller functions (recommended: < 30 lines)",
                    "line": code[:func_start].count('\n') + 1
                })
        
        return bugs
    
    # def validate_code(self, code: str) -> bool:
    #     # Basic C++ syntax validation
    #     return bool(re.search(r'#include|int\s+main|void|class|struct', code))
    def validate_code(self, code: str) -> bool:
        # Relaxed validation for C++ snippets
        cpp_keywords = [
            '#include',
            'int main',
            'std::',
            'cout',
            'cin',
            'class',
            'struct',
            'using namespace',
            'vector<',
            'string'
        ]
        return any(keyword in code for keyword in cpp_keywords)
    
    def _find_pattern_line(self, code: str, pattern: str) -> int:
        match = re.search(pattern, code)
        if match:
            return code[:match.start()].count('\n') + 1
        return 1
    
    def _parse_code(self, code: str):
        """
        Basic C++ syntax validation
        """
        if code.count('{') != code.count('}'):
            raise SyntaxError("Unbalanced braces")

        if code.count('(') != code.count(')'):
            raise SyntaxError("Unbalanced parentheses")

        return True