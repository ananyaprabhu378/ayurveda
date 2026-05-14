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

def extract_text_from_pdf(filepath: str) -> List[Dict]:
    """
    Extracts text from PDF page by page.
    Returns a list of dicts with page content and metadata.
    """
    doc = fitz.open(filepath)
    pages_data = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text()
        if text.strip():
            pages_data.append({
                "page": page_num + 1,
                "text": text,
                "source": os.path.basename(filepath)
            })
            
    doc.close()
    return pages_data
