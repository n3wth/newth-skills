---
name: PDF Toolkit
version: 1.0.0
author: newth.ai
category: documents
tags:
  - pdf
  - documents
  - extraction
compatibility:
  - gemini
  - claude
---

# PDF Toolkit

Comprehensive PDF manipulation for extracting text and tables, creating new PDFs, merging and splitting documents, and handling fillable forms.

## Triggers

Use this skill when the user needs to:
- Fill in a PDF form
- Extract text or tables from PDFs
- Create new PDF documents
- Merge multiple PDFs into one
- Split a PDF into separate pages
- Process PDF documents programmatically

Keywords: "pdf", "fill form", "extract text", "merge pdf", "split pdf", "pdf form", "create pdf"

## Features

- **Text Extraction**: Extract all text content while preserving structure and formatting
- **Table Extraction**: Identify and extract tabular data into structured formats
- **PDF Creation**: Generate new PDF documents from scratch with text, images, and formatting
- **Merging**: Combine multiple PDF files into a single document
- **Splitting**: Separate a multi-page PDF into individual files
- **Form Processing**: Read form field values and fill in PDF forms programmatically

## Usage Examples

### Extract text from PDF (Python)

```python
import pdfplumber

with pdfplumber.open('document.pdf') as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)

        # Extract tables
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                print(row)
```

### Create a PDF (Python)

```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas('output.pdf', pagesize=letter)
c.setFont('Helvetica', 12)
c.drawString(100, 750, 'Hello, PDF!')
c.save()
```

### Merge PDFs (Python)

```python
from PyPDF2 import PdfMerger

merger = PdfMerger()
merger.append('document1.pdf')
merger.append('document2.pdf')
merger.write('merged.pdf')
merger.close()
```

### Fill PDF form (Python)

```python
from PyPDF2 import PdfReader, PdfWriter

reader = PdfReader('form.pdf')
writer = PdfWriter()

page = reader.pages[0]
fields = reader.get_fields()

writer.add_page(page)
writer.update_page_form_field_values(
    writer.pages[0],
    {'name_field': 'John Doe', 'email_field': 'john@example.com'}
)

with open('filled_form.pdf', 'wb') as output:
    writer.write(output)
```

## Dependencies

### Python

```bash
pip install pdfplumber PyPDF2 reportlab
```

### Node.js

```bash
npm install pdf-lib pdf-parse
```

## Best Practices

1. **Use pdfplumber for extraction** - it handles complex layouts better than other libraries
2. **Check for encrypted PDFs** before processing - handle gracefully with proper error messages
3. **Preserve metadata** when merging documents
4. **Validate form fields exist** before attempting to fill them
5. **Handle encoding issues** - some PDFs have non-standard character encodings
