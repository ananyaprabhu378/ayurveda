import os
import fitz  # PyMuPDF
import hashlib
from typing import List, Dict

def get_file_hash(filepath: str) -> str:
    hasher = hashlib.md5()
    with open(filepath, 'rb') as afile:
        buf = afile.read()
        hasher.update(buf)
    return hasher.hexdigest()


