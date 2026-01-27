---
name: Spreadsheets
version: 1.2.0
author: newth.ai
category: documents
tags:
  - excel
  - spreadsheets
  - data
compatibility:
  - gemini
  - claude
---

# Spreadsheets

Spreadsheet creation, editing, and analysis with formulas, formatting, data analysis, and visualization. Work with Excel files and CSV data programmatically.

## Triggers

Use this skill when the user requests:
- Creating Excel spreadsheets
- Working with .xlsx files
- Adding formulas and calculations
- Data analysis and pivot tables
- Conditional formatting
- Chart generation

Keywords: "excel", "xlsx", "spreadsheet", "formula", "pivot table", "chart", "csv", "data analysis"

## Features

- **Formula Creation**: Build complex formulas and calculations
- **Conditional Formatting**: Apply visual rules based on data values
- **Data Analysis**: Create pivot tables and summaries
- **Chart Generation**: Build visualizations from data
- **Multi-Sheet Workbooks**: Manage complex workbook structures

## Usage Examples

### Create a workbook with openpyxl

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Sales Report"

# Headers with styling
headers = ['Product', 'Q1', 'Q2', 'Q3', 'Q4', 'Total']
header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
header_font = Font(color="FFFFFF", bold=True)

for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=header)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal='center')

# Data with formulas
data = [
    ['Widget A', 1200, 1350, 1500, 1800],
    ['Widget B', 800, 950, 1100, 1250],
    ['Widget C', 2000, 2200, 2400, 2600],
]

for row_num, row_data in enumerate(data, 2):
    for col_num, value in enumerate(row_data, 1):
        ws.cell(row=row_num, column=col_num, value=value)
    # Add SUM formula for total
    ws.cell(row=row_num, column=6, value=f'=SUM(B{row_num}:E{row_num})')

# Column widths
for col in range(1, 7):
    ws.column_dimensions[get_column_letter(col)].width = 12

wb.save('sales_report.xlsx')
```

### Add conditional formatting

```python
from openpyxl import Workbook
from openpyxl.formatting.rule import ColorScaleRule, CellIsRule, FormulaRule
from openpyxl.styles import PatternFill

wb = Workbook()
ws = wb.active

# Sample data
for row in range(1, 11):
    ws.cell(row=row, column=1, value=row * 10)

# Color scale (green to red)
color_scale = ColorScaleRule(
    start_type='min', start_color='63BE7B',
    mid_type='percentile', mid_value=50, mid_color='FFEB84',
    end_type='max', end_color='F8696B'
)
ws.conditional_formatting.add('A1:A10', color_scale)

# Highlight cells greater than 50
red_fill = PatternFill(start_color='FFC7CE', end_color='FFC7CE', fill_type='solid')
ws.conditional_formatting.add(
    'A1:A10',
    CellIsRule(operator='greaterThan', formula=['50'], fill=red_fill)
)

wb.save('conditional_formatting.xlsx')
```

### Create charts

```python
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference, LineChart

wb = Workbook()
ws = wb.active

# Data for chart
data = [
    ['Month', 'Sales', 'Expenses'],
    ['Jan', 4000, 3000],
    ['Feb', 4200, 3100],
    ['Mar', 4500, 3200],
    ['Apr', 4800, 3300],
]

for row in data:
    ws.append(row)

# Create bar chart
chart = BarChart()
chart.type = "col"
chart.title = "Monthly Performance"
chart.y_axis.title = "Amount ($)"
chart.x_axis.title = "Month"

data_ref = Reference(ws, min_col=2, min_row=1, max_col=3, max_row=5)
cats = Reference(ws, min_col=1, min_row=2, max_row=5)

chart.add_data(data_ref, titles_from_data=True)
chart.set_categories(cats)
chart.shape = 4

ws.add_chart(chart, "E2")

wb.save('chart_example.xlsx')
```

### Read and analyze data with pandas

```python
import pandas as pd

# Read Excel file
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Basic analysis
summary = df.describe()
print(summary)

# Group and aggregate
grouped = df.groupby('Category').agg({
    'Sales': 'sum',
    'Quantity': 'mean',
    'Profit': 'sum'
}).round(2)

# Create pivot table
pivot = pd.pivot_table(
    df,
    values='Sales',
    index='Region',
    columns='Product',
    aggfunc='sum',
    fill_value=0
)

# Write results to new Excel file
with pd.ExcelWriter('analysis_results.xlsx', engine='openpyxl') as writer:
    summary.to_excel(writer, sheet_name='Summary')
    grouped.to_excel(writer, sheet_name='By Category')
    pivot.to_excel(writer, sheet_name='Pivot Table')
```

### Formula examples

```python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active

# Common formulas
ws['A1'] = 'Value'
ws['A2'] = 100
ws['A3'] = 200
ws['A4'] = 300

ws['C1'] = 'Formula'
ws['D1'] = 'Result'

# SUM
ws['C2'] = 'SUM'
ws['D2'] = '=SUM(A2:A4)'

# AVERAGE
ws['C3'] = 'AVERAGE'
ws['D3'] = '=AVERAGE(A2:A4)'

# IF statement
ws['C4'] = 'IF'
ws['D4'] = '=IF(A2>150,"High","Low")'

# VLOOKUP
ws['C5'] = 'VLOOKUP'
ws['D5'] = '=VLOOKUP(200,A2:A4,1,FALSE)'

# COUNTIF
ws['C6'] = 'COUNTIF'
ws['D6'] = '=COUNTIF(A2:A4,">150")'

wb.save('formulas.xlsx')
```

## Dependencies

```bash
pip install openpyxl pandas xlrd
```

For reading older .xls files:
```bash
pip install xlrd
```

## Best Practices

1. **Use named ranges** for complex formulas to improve readability
2. **Validate data types** before writing to prevent Excel errors
3. **Handle large files** with `read_only=True` or `write_only=True` modes
4. **Preserve formatting** when editing by loading with `load_workbook()`
5. **Test formulas** in Excel to verify they calculate correctly
