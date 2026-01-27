---
name: Word Documents
version: 1.1.0
author: newth.ai
category: documents
tags:
  - word
  - documents
  - office
compatibility:
  - gemini
  - claude
---

# Word Documents

Document creation and editing with tracked changes, comments, formatting preservation, and text extraction. Work with Microsoft Word documents programmatically.

## Triggers

Use this skill when the user requests:
- Creating Word documents
- Editing .docx files
- Adding tracked changes or comments
- Extracting text from Word documents
- Document formatting and styling

Keywords: "word", "docx", "document", "tracked changes", "comments", "formatting", "microsoft word"

## Features

- **Document Creation**: Build new documents with proper structure
- **Tracked Changes**: Add and manage revision tracking
- **Comment Management**: Insert, read, and reply to comments
- **Formatting Preservation**: Maintain styles when editing
- **Text Extraction**: Extract content while preserving structure

## Usage Examples

### Create a document with python-docx

```python
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# Add title
title = doc.add_heading('Project Report', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Add paragraph with formatting
para = doc.add_paragraph()
run = para.add_run('Executive Summary')
run.bold = True
run.font.size = Pt(14)

doc.add_paragraph(
    'This report outlines the key findings and recommendations '
    'from our Q4 analysis.'
)

# Add bullet points
doc.add_paragraph('Key Findings:', style='Heading 2')
for finding in ['Revenue increased 15%', 'Customer satisfaction at 92%', 'Costs reduced by 8%']:
    doc.add_paragraph(finding, style='List Bullet')

# Add table
table = doc.add_table(rows=3, cols=3)
table.style = 'Table Grid'
headers = table.rows[0].cells
headers[0].text = 'Metric'
headers[1].text = 'Q3'
headers[2].text = 'Q4'

# Save
doc.save('report.docx')
```

### Extract text with structure

```python
from docx import Document

def extract_document_content(filepath):
    doc = Document(filepath)
    content = {
        'paragraphs': [],
        'tables': [],
        'headings': []
    }
    
    for para in doc.paragraphs:
        if para.style.name.startswith('Heading'):
            content['headings'].append({
                'level': para.style.name,
                'text': para.text
            })
        else:
            content['paragraphs'].append(para.text)
    
    for table in doc.tables:
        table_data = []
        for row in table.rows:
            row_data = [cell.text for cell in row.cells]
            table_data.append(row_data)
        content['tables'].append(table_data)
    
    return content

# Usage
content = extract_document_content('document.docx')
print(f"Found {len(content['headings'])} headings")
print(f"Found {len(content['tables'])} tables")
```

### Add comments (using python-docx-ng or lxml)

```python
from docx import Document
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from datetime import datetime

def add_comment(paragraph, comment_text, author="Author"):
    """Add a comment to a paragraph."""
    # Create comment reference
    comment_id = str(hash(comment_text) % 10000)
    
    # Add comment range start
    comment_start = OxmlElement('w:commentRangeStart')
    comment_start.set(qn('w:id'), comment_id)
    paragraph._p.insert(0, comment_start)
    
    # Add comment range end
    comment_end = OxmlElement('w:commentRangeEnd')
    comment_end.set(qn('w:id'), comment_id)
    paragraph._p.append(comment_end)
    
    # Add comment reference
    comment_ref = OxmlElement('w:commentReference')
    comment_ref.set(qn('w:id'), comment_id)
    
    run = paragraph.add_run()
    run._r.append(comment_ref)
    
    return comment_id

# Note: Full comment support requires modifying the comments.xml part
```

### Template-based document generation

```python
from docx import Document
from docx.shared import Pt

def generate_from_template(template_path, replacements, output_path):
    """Generate document from template with placeholder replacement."""
    doc = Document(template_path)
    
    for para in doc.paragraphs:
        for key, value in replacements.items():
            if f'{{{{{key}}}}}' in para.text:
                for run in para.runs:
                    run.text = run.text.replace(f'{{{{{key}}}}}', str(value))
    
    # Also check tables
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    for key, value in replacements.items():
                        if f'{{{{{key}}}}}' in para.text:
                            for run in para.runs:
                                run.text = run.text.replace(f'{{{{{key}}}}}', str(value))
    
    doc.save(output_path)

# Usage
replacements = {
    'client_name': 'Acme Corp',
    'date': '2026-01-27',
    'amount': '$50,000'
}
generate_from_template('contract_template.docx', replacements, 'contract_acme.docx')
```

## Dependencies

```bash
pip install python-docx
```

For advanced features:
```bash
pip install python-docx-ng  # Enhanced fork with more features
```

## Best Practices

1. **Use styles** instead of direct formatting for consistency
2. **Preserve formatting** when editing by working with runs, not replacing paragraph text
3. **Handle encoding** properly for international characters
4. **Test with Word** to verify complex documents render correctly
5. **Use templates** for consistent document generation
