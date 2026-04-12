"""Base class for all language detectors"""
from abc import ABC, abstractmethod
from typing import List, Dict

class BaseDetector(ABC):
    """Abstract base class for code detectors"""
    
    def __init__(self):
        self.language = self.get_language()
    
    @abstractmethod
    def get_language(self) -> str:
        """Return language name"""
        pass
    
    @abstractmethod
    def detect_bugs(self, code: str) -> List[Dict]:
        """
        Detect bugs in code
        
        Returns:
            List of bug dictionaries with:
            - type: str (bug type)
            - severity: str (Critical, High, Medium, Low)
            - line: int (line number)
            - message: str (description)
            - category: str (Security, Code Smell, Exception, Performance)
        """
        pass
    
    def validate_code(self, code: str) -> bool:
        """Validate if code is syntactically correct"""
        try:
            self._parse_code(code)
            return True
        except:
            return False
    
    @abstractmethod
    def _parse_code(self, code: str):
        """Parse code - language specific implementation"""
        pass