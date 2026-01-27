---
name: Cursor Usage Analytics
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - analytics
  - ai-coding
  - metrics
  - optimization
compatibility:
  - cursor
  - claude
---

# Cursor Usage Analytics

Track Cursor usage patterns, model preferences, and code quality improvements. Optimize your AI-assisted development workflow through data-driven insights.

## Triggers

Use this skill when the user requests:
- Tracking Cursor usage patterns
- Analyzing AI code generation quality
- Measuring productivity improvements
- Optimizing AI model costs
- Understanding agent mode effectiveness

Keywords: "cursor analytics", "ai metrics", "code quality", "usage patterns", "cost optimization", "cursor stats"

## Purpose

Understand how you use Cursor's AI features to optimize your configuration, reduce costs, and improve code quality. This skill helps you track agent modes, analyze code patterns, and measure the impact of AI assistance on your development workflow.

## Key Features

- **Agent Mode Tracking**: Monitor usage patterns across Composer, Chat, and Inline modes
- **Code Quality Analysis**: Measure improvements in code quality with AI assistance
- **Model Usage Optimization**: Track which models you use and optimize costs
- **Pattern Recognition**: Identify common code generation patterns and templates
- **Cost Analysis**: Calculate and optimize API usage costs

## Usage Examples

### Basic usage tracking

```python
import json
from datetime import datetime, timedelta
from collections import defaultdict

class CursorAnalytics:
    """Track and analyze Cursor usage patterns."""
    
    def __init__(self, log_file='cursor_usage.json'):
        self.log_file = log_file
        self.sessions = []
        self.load_sessions()
    
    def load_sessions(self):
        """Load existing session data."""
        try:
            with open(self.log_file, 'r') as f:
                self.sessions = json.load(f)
        except FileNotFoundError:
            self.sessions = []
    
    def save_sessions(self):
        """Save session data to file."""
        with open(self.log_file, 'w') as f:
            json.dump(self.sessions, f, indent=2)
    
    def log_session(self, mode, model, tokens_used, code_lines, duration_minutes):
        """Log a Cursor usage session.
        
        Args:
            mode: 'composer', 'chat', or 'inline'
            model: Model used (e.g., 'claude-3.5-sonnet', 'gpt-4')
            tokens_used: Approximate tokens consumed
            code_lines: Lines of code generated/modified
            duration_minutes: Session duration in minutes
        """
        session = {
            'timestamp': datetime.now().isoformat(),
            'mode': mode,
            'model': model,
            'tokens_used': tokens_used,
            'code_lines': code_lines,
            'duration_minutes': duration_minutes
        }
        self.sessions.append(session)
        self.save_sessions()
    
    def get_usage_summary(self, days=7):
        """Get usage summary for the last N days."""
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_sessions = [
            s for s in self.sessions 
            if datetime.fromisoformat(s['timestamp']) >= cutoff_date
        ]
        
        mode_stats = defaultdict(lambda: {'count': 0, 'tokens': 0, 'lines': 0, 'duration': 0})
        model_stats = defaultdict(lambda: {'count': 0, 'tokens': 0})
        
        for session in recent_sessions:
            mode = session['mode']
            model = session['model']
            
            mode_stats[mode]['count'] += 1
            mode_stats[mode]['tokens'] += session['tokens_used']
            mode_stats[mode]['lines'] += session['code_lines']
            mode_stats[mode]['duration'] += session['duration_minutes']
            
            model_stats[model]['count'] += 1
            model_stats[model]['tokens'] += session['tokens_used']
        
        return {
            'total_sessions': len(recent_sessions),
            'mode_breakdown': dict(mode_stats),
            'model_breakdown': dict(model_stats),
            'total_tokens': sum(s['tokens_used'] for s in recent_sessions),
            'total_lines': sum(s['code_lines'] for s in recent_sessions),
            'total_duration': sum(s['duration_minutes'] for s in recent_sessions)
        }

# Usage
analytics = CursorAnalytics()

# Log a session
analytics.log_session(
    mode='composer',
    model='claude-3.5-sonnet',
    tokens_used=2500,
    code_lines=45,
    duration_minutes=15
)

# Get weekly summary
summary = analytics.get_usage_summary(days=7)
print(f"Sessions this week: {summary['total_sessions']}")
print(f"Total lines generated: {summary['total_lines']}")
print(f"Total tokens used: {summary['total_tokens']}")
```

### Code quality metrics

```python
import subprocess
import json
from pathlib import Path

class CodeQualityAnalyzer:
    """Analyze code quality improvements with AI assistance."""
    
    def __init__(self, project_path='.'):
        self.project_path = Path(project_path)
    
    def run_linter(self, file_path):
        """Run linter on a file and return issues count."""
        try:
            # For Python files
            result = subprocess.run(
                ['ruff', 'check', file_path],
                capture_output=True,
                text=True
            )
            # Count lines in output (each line is typically an issue)
            return len(result.stdout.strip().split('\n')) if result.stdout else 0
        except FileNotFoundError:
            print("Linter not found. Install ruff: pip install ruff")
            return 0
    
    def check_test_coverage(self):
        """Get current test coverage percentage."""
        try:
            result = subprocess.run(
                ['pytest', '--cov=.', '--cov-report=json'],
                capture_output=True,
                cwd=self.project_path
            )
            
            with open(self.project_path / 'coverage.json') as f:
                coverage_data = json.load(f)
                return coverage_data['totals']['percent_covered']
        except:
            return None
    
    def analyze_ai_generated_code(self, file_path, original_issues=None):
        """Analyze quality of AI-generated code.
        
        Args:
            file_path: Path to file with AI-generated code
            original_issues: Baseline linting issues before AI generation
        
        Returns:
            Quality metrics dictionary
        """
        current_issues = self.run_linter(file_path)
        
        metrics = {
            'file': str(file_path),
            'linting_issues': current_issues,
            'improvement': None
        }
        
        if original_issues is not None:
            metrics['improvement'] = original_issues - current_issues
            metrics['improvement_percent'] = (
                ((original_issues - current_issues) / original_issues * 100)
                if original_issues > 0 else 0
            )
        
        return metrics
    
    def get_complexity_score(self, file_path):
        """Get cyclomatic complexity score."""
        try:
            result = subprocess.run(
                ['radon', 'cc', file_path, '-j'],
                capture_output=True,
                text=True
            )
            data = json.loads(result.stdout)
            # Calculate average complexity
            complexities = []
            for file_data in data.values():
                for item in file_data:
                    complexities.append(item['complexity'])
            
            return sum(complexities) / len(complexities) if complexities else 0
        except:
            return None

# Usage
analyzer = CodeQualityAnalyzer()

# Before AI generation
original_issues = analyzer.run_linter('src/module.py')

# After AI generation
metrics = analyzer.analyze_ai_generated_code(
    'src/module.py',
    original_issues=original_issues
)

print(f"Quality improvement: {metrics['improvement_percent']:.1f}%")
print(f"Remaining issues: {metrics['linting_issues']}")
```

### Cost optimization tracking

```python
from datetime import datetime, timedelta
import json

class CostOptimizer:
    """Track and optimize Cursor API costs."""
    
    # Approximate cost per 1M tokens (update with current pricing)
    MODEL_COSTS = {
        'claude-3.5-sonnet': {
            'input': 3.00,   # per 1M tokens
            'output': 15.00
        },
        'claude-3-opus': {
            'input': 15.00,
            'output': 75.00
        },
        'gpt-4': {
            'input': 30.00,
            'output': 60.00
        },
        'gpt-4-turbo': {
            'input': 10.00,
            'output': 30.00
        },
        'gpt-3.5-turbo': {
            'input': 0.50,
            'output': 1.50
        }
    }
    
    def __init__(self, analytics_file='cursor_usage.json'):
        self.analytics_file = analytics_file
        self.sessions = []
        self.load_sessions()
    
    def load_sessions(self):
        """Load session data."""
        try:
            with open(self.analytics_file, 'r') as f:
                self.sessions = json.load(f)
        except FileNotFoundError:
            self.sessions = []
    
    def estimate_session_cost(self, session):
        """Estimate cost for a single session.
        
        Assumes 2:1 ratio of input to output tokens.
        """
        model = session.get('model')
        total_tokens = session.get('tokens_used', 0)
        
        if model not in self.MODEL_COSTS:
            return 0
        
        # Rough estimate: 2/3 input, 1/3 output
        input_tokens = total_tokens * 0.67
        output_tokens = total_tokens * 0.33
        
        costs = self.MODEL_COSTS[model]
        cost = (
            (input_tokens / 1_000_000) * costs['input'] +
            (output_tokens / 1_000_000) * costs['output']
        )
        
        return cost
    
    def get_cost_breakdown(self, days=30):
        """Get cost breakdown for the last N days."""
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_sessions = [
            s for s in self.sessions 
            if datetime.fromisoformat(s['timestamp']) >= cutoff_date
        ]
        
        model_costs = {}
        total_cost = 0
        
        for session in recent_sessions:
            model = session.get('model')
            cost = self.estimate_session_cost(session)
            total_cost += cost
            
            if model not in model_costs:
                model_costs[model] = {
                    'sessions': 0,
                    'total_cost': 0,
                    'avg_cost_per_session': 0
                }
            
            model_costs[model]['sessions'] += 1
            model_costs[model]['total_cost'] += cost
        
        # Calculate averages
        for model_data in model_costs.values():
            model_data['avg_cost_per_session'] = (
                model_data['total_cost'] / model_data['sessions']
            )
        
        return {
            'total_cost': total_cost,
            'daily_average': total_cost / days,
            'model_breakdown': model_costs,
            'sessions_analyzed': len(recent_sessions)
        }
    
    def suggest_optimizations(self, days=30):
        """Suggest cost optimizations based on usage patterns."""
        breakdown = self.get_cost_breakdown(days)
        suggestions = []
        
        for model, data in breakdown['model_breakdown'].items():
            # If using expensive models for simple tasks
            if 'opus' in model.lower() and data['avg_cost_per_session'] < 0.05:
                suggestions.append(
                    f"Consider using claude-3.5-sonnet instead of {model} "
                    f"for simpler tasks (avg cost: ${data['avg_cost_per_session']:.4f}/session)"
                )
            
            # If using GPT-4 when cheaper alternatives exist
            if model == 'gpt-4' and data['sessions'] > 10:
                suggestions.append(
                    f"Consider gpt-4-turbo instead of gpt-4 "
                    f"(could save ~{(data['total_cost'] * 0.67):.2f} USD)"
                )
        
        return {
            'current_monthly_estimate': breakdown['daily_average'] * 30,
            'suggestions': suggestions
        }

# Usage
optimizer = CostOptimizer('cursor_usage.json')

# Get monthly cost breakdown
breakdown = optimizer.get_cost_breakdown(days=30)
print(f"Total cost (30 days): ${breakdown['total_cost']:.2f}")
print(f"Daily average: ${breakdown['daily_average']:.2f}")

# Get optimization suggestions
optimizations = optimizer.suggest_optimizations()
print(f"\nEstimated monthly cost: ${optimizations['current_monthly_estimate']:.2f}")
for suggestion in optimizations['suggestions']:
    print(f"💡 {suggestion}")
```

### Pattern recognition and templates

```python
from collections import Counter
import re
from pathlib import Path

class PatternAnalyzer:
    """Identify common code generation patterns."""
    
    def __init__(self):
        self.patterns = []
    
    def extract_code_patterns(self, file_path):
        """Extract common patterns from generated code.
        
        Looks for:
        - Function signatures
        - Class definitions
        - Import statements
        - Common code structures
        """
        with open(file_path, 'r') as f:
            content = f.read()
        
        patterns = {
            'functions': re.findall(r'def\s+(\w+)\s*\([^)]*\)', content),
            'classes': re.findall(r'class\s+(\w+)', content),
            'imports': re.findall(r'(?:from\s+[\w.]+\s+)?import\s+([\w,\s]+)', content),
            'decorators': re.findall(r'@(\w+)', content),
        }
        
        return patterns
    
    def analyze_common_patterns(self, project_path='.'):
        """Analyze patterns across all Python files in project."""
        all_patterns = {
            'functions': [],
            'classes': [],
            'imports': [],
            'decorators': []
        }
        
        for py_file in Path(project_path).rglob('*.py'):
            if 'venv' in str(py_file) or '.git' in str(py_file):
                continue
                
            patterns = self.extract_code_patterns(py_file)
            for key in all_patterns:
                all_patterns[key].extend(patterns[key])
        
        # Find most common patterns
        return {
            'common_function_names': Counter(all_patterns['functions']).most_common(10),
            'common_classes': Counter(all_patterns['classes']).most_common(10),
            'common_imports': Counter(all_patterns['imports']).most_common(10),
            'common_decorators': Counter(all_patterns['decorators']).most_common(5)
        }
    
    def suggest_templates(self, patterns):
        """Suggest reusable templates based on patterns."""
        templates = []
        
        # If seeing repeated function patterns
        if patterns['common_function_names']:
            top_functions = [name for name, _ in patterns['common_function_names'][:3]]
            templates.append({
                'type': 'function_template',
                'suggestion': f"Consider creating templates for: {', '.join(top_functions)}",
                'reason': 'These functions appear frequently in your codebase'
            })
        
        # If seeing repeated imports
        if patterns['common_imports']:
            top_imports = [imp for imp, _ in patterns['common_imports'][:5]]
            templates.append({
                'type': 'import_template',
                'suggestion': f"Create import snippets for: {', '.join(top_imports)}",
                'reason': 'These imports are used consistently'
            })
        
        return templates

# Usage
analyzer = PatternAnalyzer()
patterns = analyzer.analyze_common_patterns('.')

print("Most common function names:")
for name, count in patterns['common_function_names']:
    print(f"  {name}: {count} occurrences")

templates = analyzer.suggest_templates(patterns)
for template in templates:
    print(f"\n{template['type']}: {template['suggestion']}")
    print(f"  Reason: {template['reason']}")
```

## Best Practices

### 1. Consistent Logging

Create a habit of logging sessions immediately after use:

```python
# Add to your workflow
def log_cursor_session():
    """Quick logging helper."""
    analytics = CursorAnalytics()
    
    mode = input("Mode (composer/chat/inline): ")
    model = input("Model used: ")
    tokens = int(input("Approx tokens (or press Enter for 1000): ") or 1000)
    lines = int(input("Lines generated: "))
    duration = int(input("Duration (minutes): "))
    
    analytics.log_session(mode, model, tokens, lines, duration)
    print("✓ Session logged!")

# Or automate with git hooks
```

### 2. Weekly Reviews

Set up automated weekly reports:

```python
import schedule
import time

def weekly_report():
    """Generate and email weekly analytics report."""
    analytics = CursorAnalytics()
    optimizer = CostOptimizer()
    
    usage = analytics.get_usage_summary(days=7)
    costs = optimizer.get_cost_breakdown(days=7)
    
    report = f"""
    📊 Weekly Cursor Analytics Report
    
    Sessions: {usage['total_sessions']}
    Lines Generated: {usage['total_lines']}
    Total Duration: {usage['total_duration']} minutes
    
    💰 Cost Summary
    Total: ${costs['total_cost']:.2f}
    Daily Average: ${costs['daily_average']:.2f}
    
    📈 Most Used Mode: {max(usage['mode_breakdown'], key=lambda x: usage['mode_breakdown'][x]['count'])}
    """
    
    print(report)
    # Add email sending logic here

# Schedule weekly reports
schedule.every().monday.at("09:00").do(weekly_report)
```

### 3. Model Selection Strategy

Optimize model selection based on task complexity:

- **claude-3.5-sonnet**: Default for most coding tasks (best balance)
- **claude-3-opus**: Complex refactoring, architecture decisions
- **gpt-4-turbo**: Quick prototypes, simple fixes
- **gpt-3.5-turbo**: Documentation, comments, simple completions

### 4. Track Quality Metrics

Monitor these key metrics:
- Lines of code per session
- Linting issues before/after AI assistance
- Test coverage changes
- Code complexity scores
- Time saved vs manual coding

### 5. Cost Awareness

Set up budget alerts:

```python
def check_budget_alert(monthly_budget=50.0):
    """Alert if approaching monthly budget."""
    optimizer = CostOptimizer()
    estimate = optimizer.suggest_optimizations()
    
    monthly_est = estimate['current_monthly_estimate']
    
    if monthly_est > monthly_budget * 0.8:
        print(f"⚠️  WARNING: Approaching budget limit!")
        print(f"   Current pace: ${monthly_est:.2f}/month")
        print(f"   Budget: ${monthly_budget:.2f}/month")
        
        # Show suggestions
        for suggestion in estimate['suggestions']:
            print(f"   💡 {suggestion}")
```

## Integration with Cursor

### Cursor Settings Configuration

Add to your Cursor settings to optimize usage:

```json
{
  "cursor.general.enableTelemetry": true,
  "cursor.chat.defaultModel": "claude-3.5-sonnet",
  "cursor.composer.defaultModel": "claude-3.5-sonnet",
  "cursor.autocomplete.enabled": true
}
```

### Custom Rules for Analytics

Create `.cursorrules` with analytics hints:

```
When generating code:
- Prefer simple, readable solutions
- Add docstrings for all functions
- Include type hints
- Follow existing code patterns
- Optimize for maintainability over cleverness

Track usage:
- Log significant code generation sessions
- Note which patterns work well
- Identify areas for template creation
```

## Dependencies

```bash
# Python analytics tools
pip install pytest pytest-cov ruff radon

# Optional: Advanced metrics
pip install pylint bandit safety
```

## Monitoring Dashboard

For a visual dashboard, integrate with tools like:
- **Grafana**: Visualize usage trends
- **Jupyter Notebooks**: Interactive analysis
- **Streamlit**: Quick custom dashboards

Example Streamlit dashboard:

```python
import streamlit as st
import pandas as pd
from cursor_analytics import CursorAnalytics

st.title("🎯 Cursor Usage Dashboard")

analytics = CursorAnalytics()
summary = analytics.get_usage_summary(days=30)

col1, col2, col3 = st.columns(3)
col1.metric("Total Sessions", summary['total_sessions'])
col2.metric("Lines Generated", summary['total_lines'])
col3.metric("Total Tokens", f"{summary['total_tokens']:,}")

# Mode breakdown chart
mode_df = pd.DataFrame.from_dict(summary['mode_breakdown'], orient='index')
st.bar_chart(mode_df['count'])
```

## Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Claude API Pricing](https://www.anthropic.com/pricing)
- [OpenAI API Pricing](https://openai.com/pricing)
- Code Quality Tools: [Ruff](https://github.com/astral-sh/ruff), [Radon](https://radon.readthedocs.io/)
