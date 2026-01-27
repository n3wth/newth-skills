---
name: Regex Builder
version: 1.0.0
author: newth.ai
category: development
tags:
  - regex
  - patterns
  - validation
  - parsing
compatibility:
  - gemini
  - claude
---

# Regex Builder

Build and test regular expressions with multi-language syntax support. Create complex patterns, validate against sample data, and explain regex in plain English with common pattern libraries.

## Triggers

Use this skill when the user requests:
- Building or creating regex patterns
- Validating data with regular expressions
- Parsing or extracting text patterns
- Explaining regex syntax
- Testing regex against sample data

Keywords: "regex", "regular expression", "pattern", "validate", "parse", "extract", "match"

## Features

- **Complex Pattern Building**: Construct sophisticated regex patterns step-by-step
- **Sample Data Testing**: Test patterns against real data with match highlighting
- **Plain English Explanations**: Translate regex into readable descriptions
- **Common Pattern Library**: Pre-built patterns for emails, URLs, phones, etc.
- **Multi-Language Support**: Syntax for JavaScript, Python, Java, C#, Ruby, and more

## Common Pattern Library

### Email Validation

**Basic:**
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

**Strict (RFC 5322):**
```regex
^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
```

### URL Matching

**HTTP/HTTPS URLs:**
```regex
https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)
```

**All protocols:**
```regex
^(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#\/%=~_|]
```

### Phone Numbers

**US Format:**
```regex
^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$
```

**International:**
```regex
^\+?[1-9]\d{1,14}$
```

### Dates

**YYYY-MM-DD:**
```regex
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
```

**MM/DD/YYYY:**
```regex
^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$
```

### IP Addresses

**IPv4:**
```regex
^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$
```

**IPv6:**
```regex
^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$
```

### Passwords

**Strong Password (8+ chars, upper, lower, number, special):**
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

### Credit Cards

**Generic card number:**
```regex
^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$
```

### Usernames

**Alphanumeric with underscore/hyphen (3-16 chars):**
```regex
^[a-zA-Z0-9_-]{3,16}$
```

### HTML Tags

**Match HTML tags:**
```regex
<\/?[a-z][\s\S]*>
```

### Hex Colors

**3 or 6 digit hex:**
```regex
^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$
```

## Language-Specific Syntax

### JavaScript

```javascript
// Literal notation
const regex = /pattern/flags;

// Constructor
const regex = new RegExp('pattern', 'flags');

// Flags
// g - global (find all matches)
// i - case insensitive
// m - multiline
// s - dotAll (. matches newlines)
// u - unicode
// y - sticky

// Methods
'text'.match(regex);        // Find matches
'text'.replace(regex, '');  // Replace matches
regex.test('text');         // Boolean test
regex.exec('text');         // Detailed match info

// Example
const email = /^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i;
email.test('user@example.com'); // true

// Named capture groups
const pattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = '2026-01-27'.match(pattern);
console.log(match.groups); // { year: '2026', month: '01', day: '27' }
```

### Python

```python
import re

# Compile pattern
pattern = re.compile(r'pattern', re.IGNORECASE)

# Flags
# re.IGNORECASE or re.I - case insensitive
# re.MULTILINE or re.M - multiline mode
# re.DOTALL or re.S - dot matches newlines
# re.VERBOSE or re.X - verbose (allows comments)

# Methods
re.search(pattern, text)    # Find first match
re.match(pattern, text)     # Match at start
re.findall(pattern, text)   # Find all matches
re.sub(pattern, repl, text) # Replace matches
re.split(pattern, text)     # Split by pattern

# Example
email_pattern = r'^[\w.+-]+@[\w.-]+\.[a-z]{2,}$'
if re.match(email_pattern, 'user@example.com', re.I):
    print('Valid email')

# Named groups
pattern = r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})'
match = re.search(pattern, '2026-01-27')
print(match.group('year'))  # '2026'
```

### Java

```java
import java.util.regex.*;

// Compile pattern
Pattern pattern = Pattern.compile("pattern", Pattern.CASE_INSENSITIVE);
Matcher matcher = pattern.matcher(text);

// Flags
// Pattern.CASE_INSENSITIVE
// Pattern.MULTILINE
// Pattern.DOTALL

// Methods
matcher.matches();      // Full match
matcher.find();         // Find next match
matcher.replaceAll();   // Replace all

// Example
String email = "^[\\w.+-]+@[\\w.-]+\\.[a-z]{2,}$";
Pattern pattern = Pattern.compile(email, Pattern.CASE_INSENSITIVE);
Matcher matcher = pattern.matcher("user@example.com");
boolean isValid = matcher.matches();

// Named groups
Pattern p = Pattern.compile("(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})");
Matcher m = p.matcher("2026-01-27");
if (m.find()) {
    String year = m.group("year");
}
```

### C#

```csharp
using System.Text.RegularExpressions;

// Create regex
Regex regex = new Regex(@"pattern", RegexOptions.IgnoreCase);

// Options
// RegexOptions.IgnoreCase
// RegexOptions.Multiline
// RegexOptions.Singleline (dotAll)

// Methods
regex.IsMatch(text);           // Boolean test
regex.Match(text);             // First match
regex.Matches(text);           // All matches
regex.Replace(text, "");       // Replace

// Example
string emailPattern = @"^[\w.+-]+@[\w.-]+\.[a-z]{2,}$";
Regex regex = new Regex(emailPattern, RegexOptions.IgnoreCase);
bool isValid = regex.IsMatch("user@example.com");

// Named groups
var pattern = @"(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})";
var match = Regex.Match("2026-01-27", pattern);
string year = match.Groups["year"].Value;
```

## Pattern Building Tips

### 1. Start Simple, Add Complexity

```regex
# Step 1: Match any email
.+@.+

# Step 2: Add character restrictions
[a-zA-Z0-9]+@[a-zA-Z0-9]+

# Step 3: Allow dots and hyphens
[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+

# Step 4: Require TLD
[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
```

### 2. Use Character Classes

```regex
\d      # Digit [0-9]
\w      # Word char [a-zA-Z0-9_]
\s      # Whitespace
.       # Any character (except newline)
\D      # Non-digit
\W      # Non-word
\S      # Non-whitespace
```

### 3. Quantifiers

```regex
*       # 0 or more
+       # 1 or more
?       # 0 or 1 (optional)
{n}     # Exactly n times
{n,}    # n or more times
{n,m}   # Between n and m times
```

### 4. Anchors

```regex
^       # Start of string/line
$       # End of string/line
\b      # Word boundary
\B      # Non-word boundary
```

### 5. Groups and Backreferences

```regex
(...)           # Capturing group
(?:...)         # Non-capturing group
(?<name>...)    # Named group
\1, \2          # Backreference to group
\k<name>        # Named backreference
```

### 6. Lookarounds

```regex
(?=...)     # Positive lookahead
(?!...)     # Negative lookahead
(?<=...)    # Positive lookbehind
(?<!...)    # Negative lookbehind
```

## Testing Patterns

### Create Test Cases

```javascript
const pattern = /^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i;

const testCases = [
  { input: 'user@example.com', expected: true },
  { input: 'john.doe+filter@company.co.uk', expected: true },
  { input: 'invalid@', expected: false },
  { input: '@example.com', expected: false },
  { input: 'no-at-sign.com', expected: false },
];

testCases.forEach(({ input, expected }) => {
  const result = pattern.test(input);
  console.log(`${input}: ${result === expected ? '✓' : '✗'}`);
});
```

### Online Testing Tools

Recommend these tools for interactive testing:
- **regex101.com** - Detailed explanations and debugging
- **regexr.com** - Visual highlighting and community library
- **debuggex.com** - Visual regex diagrams

## Common Pitfalls

### 1. Greedy vs Lazy Matching

```regex
# Greedy (matches as much as possible)
<.*>        # Matches: <div>Hello</div><span>World</span>

# Lazy (matches as little as possible)
<.*?>       # Matches: <div>, </div>, <span>, </span>
```

### 2. Escaping Special Characters

```regex
# Special chars need escaping: . * + ? ^ $ { } [ ] ( ) | \
\.          # Literal dot
\*          # Literal asterisk
\(          # Literal parenthesis
```

### 3. Case Sensitivity

```regex
# Case sensitive (default)
[a-z]+      # Matches: 'hello', not 'Hello'

# Case insensitive (use flag)
/[a-z]+/i   # Matches: 'hello', 'Hello', 'HELLO'
```

### 4. Multiline Mode

```regex
# Without multiline flag
^hello      # Matches only at start of string

# With multiline flag (/m or re.M)
^hello      # Matches at start of each line
```

## Performance Optimization

### 1. Be Specific

```regex
# Slow (backtracking)
.*text.*

# Faster
[^t]*text[^t]*
```

### 2. Use Non-Capturing Groups

```regex
# Slower (captures unnecessarily)
(foo|bar)

# Faster
(?:foo|bar)
```

### 3. Anchor When Possible

```regex
# Checks entire string
pattern

# Stops early if mismatch at start
^pattern
```

### 4. Avoid Nested Quantifiers

```regex
# Very slow (catastrophic backtracking)
(a+)+

# Better
a+
```

## Real-World Examples

### Extract URLs from Text

```javascript
const text = 'Visit https://example.com and http://test.org';
const urlRegex = /https?:\/\/[^\s]+/g;
const urls = text.match(urlRegex);
// ['https://example.com', 'http://test.org']
```

### Parse Log Entries

```python
import re

log = '2026-01-27 14:30:15 ERROR UserService: Connection timeout'
pattern = r'(?P<date>\S+) (?P<time>\S+) (?P<level>\w+) (?P<service>\w+): (?P<message>.*)'
match = re.match(pattern, log)

print(match.group('date'))     # '2026-01-27'
print(match.group('level'))    # 'ERROR'
print(match.group('message'))  # 'Connection timeout'
```

### Validate and Format Phone Numbers

```javascript
function formatPhone(phone) {
  const pattern = /^\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
  const match = phone.match(pattern);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return null;
}

formatPhone('1234567890');        // '(123) 456-7890'
formatPhone('(123) 456-7890');    // '(123) 456-7890'
formatPhone('+1-123-456-7890');   // '(123) 456-7890'
```

### Extract Code Blocks from Markdown

```python
import re

markdown = '''
# Title
Some text
```python
print("Hello")
```
More text
```javascript
console.log("World");
```
'''

pattern = r'```(\w+)\n(.*?)```'
matches = re.findall(pattern, markdown, re.DOTALL)

for lang, code in matches:
    print(f'Language: {lang}')
    print(f'Code: {code.strip()}\n')
```

### Sanitize User Input

```javascript
function sanitizeUsername(username) {
  // Remove non-alphanumeric except underscore and hyphen
  return username.replace(/[^a-zA-Z0-9_-]/g, '');
}

sanitizeUsername('john@doe#123');  // 'johndoe123'
sanitizeUsername('user_name-99');  // 'user_name-99'
```

## Best Practices

1. **Test thoroughly**: Use diverse test cases including edge cases
2. **Keep it readable**: Use verbose mode and comments for complex patterns
3. **Start simple**: Build complexity incrementally
4. **Avoid over-engineering**: Don't regex what simple string methods can do
5. **Document patterns**: Explain what your regex does
6. **Consider alternatives**: Sometimes parsing libraries are better than regex
7. **Validate carefully**: Regex validation is not foolproof (e.g., email DNS)
8. **Mind performance**: Test with realistic data sizes

## When Not to Use Regex

- **Parsing HTML/XML**: Use proper parsers (BeautifulSoup, lxml, DOMParser)
- **Complex nested structures**: Use parsers or state machines
- **Simple string operations**: Use indexOf, split, replace for simple cases
- **Email validation**: Regex can't verify DNS or deliverability
- **Critical validation**: Regex alone shouldn't be the only security layer
