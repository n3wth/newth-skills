---
name: Code Reviewer
version: 1.0.0
author: Community Contributor
category: development
tags:
  - code-review
  - quality
  - best-practices
  - refactoring
compatibility:
  - gemini
  - claude
---

# Code Reviewer

Automated code review with best practices. Identify code smells, suggest refactoring improvements, check for security issues, enforce coding standards, and provide performance optimization recommendations.

## Triggers

Use this skill when the user requests:
- Code review or feedback
- Identifying code smells
- Refactoring suggestions
- Security vulnerability checks
- Coding standards enforcement
- Performance optimization advice

Keywords: "review", "code quality", "refactor", "best practices", "security check", "code smell", "optimize", "clean code"

## Features

- **Code Smell Detection**: Identify anti-patterns and problematic code structures
- **Refactoring Suggestions**: Recommend improvements for better maintainability
- **Security Analysis**: Check for common security vulnerabilities
- **Standards Enforcement**: Ensure code follows language-specific conventions
- **Performance Recommendations**: Suggest optimizations for better efficiency

## Code Smells to Identify

### Common Anti-Patterns

**1. Long Functions/Methods**
- Functions with too many lines (>50)
- Multiple levels of nesting (>3)
- Too many parameters (>4)

**Solution**: Break into smaller, focused functions

**2. Duplicate Code**
- Copy-pasted logic
- Similar code blocks
- Repeated patterns

**Solution**: Extract to reusable functions or utilities

**3. Magic Numbers**
```javascript
// Bad
if (user.age > 18) { /* ... */ }

// Good
const MINIMUM_AGE = 18;
if (user.age > MINIMUM_AGE) { /* ... */ }
```

**4. God Objects**
- Classes with too many responsibilities
- Files with thousands of lines
- Objects doing too much

**Solution**: Follow Single Responsibility Principle (SRP)

**5. Poor Naming**
```javascript
// Bad
function f(x) { return x * 2; }

// Good
function doubleValue(number) { return number * 2; }
```

## Refactoring Patterns

### Extract Method

```javascript
// Before
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Empty order');
  }
  if (!order.customer) {
    throw new Error('Missing customer');
  }
  
  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  
  // Apply discount
  if (order.customer.isPremium) {
    total *= 0.9;
  }
  
  return total;
}

// After
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order);
  return applyDiscount(total, order.customer);
}

function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    throw new Error('Empty order');
  }
  if (!order.customer) {
    throw new Error('Missing customer');
  }
}

function calculateTotal(order) {
  return order.items.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );
}

function applyDiscount(total, customer) {
  return customer.isPremium ? total * 0.9 : total;
}
```

### Replace Conditional with Polymorphism

```javascript
// Before
class Bird {
  getSpeed() {
    switch (this.type) {
      case 'european':
        return this.baseSpeed;
      case 'african':
        return this.baseSpeed - this.loadFactor;
      case 'norwegian':
        return this.isNailed ? 0 : this.baseSpeed;
    }
  }
}

// After
class Bird {
  getSpeed() {
    return this.baseSpeed;
  }
}

class EuropeanBird extends Bird {}

class AfricanBird extends Bird {
  getSpeed() {
    return this.baseSpeed - this.loadFactor;
  }
}

class NorwegianBlueBird extends Bird {
  getSpeed() {
    return this.isNailed ? 0 : this.baseSpeed;
  }
}
```

### Introduce Parameter Object

```javascript
// Before
function createUser(name, email, age, address, phone) {
  // ...
}

// After
interface UserData {
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
}

function createUser(userData: UserData) {
  // ...
}
```

## Security Checks

### Common Vulnerabilities

**1. SQL Injection**
```javascript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// ✅ Secure
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [userInput]);
```

**2. Cross-Site Scripting (XSS)**
```javascript
// ❌ Vulnerable
element.innerHTML = userInput;

// ✅ Secure
element.textContent = userInput;
// Or use a sanitization library
```

**3. Command Injection**
```javascript
// ❌ Vulnerable
exec(`convert ${userFilename}.jpg output.png`);

// ✅ Secure
const sanitized = path.basename(userFilename);
execFile('convert', [`${sanitized}.jpg`, 'output.png']);
```

**4. Insecure Direct Object References**
```javascript
// ❌ Vulnerable
app.get('/user/:id', (req, res) => {
  const user = db.getUser(req.params.id);
  res.json(user);
});

// ✅ Secure
app.get('/user/:id', authenticate, (req, res) => {
  const user = db.getUser(req.params.id);
  if (user.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(user);
});
```

**5. Sensitive Data Exposure**
```javascript
// ❌ Bad
console.log('API Key:', process.env.API_KEY);

// ✅ Good
console.log('API Key: [REDACTED]');

// ❌ Bad
res.json({ user, password: user.password });

// ✅ Good
const { password, ...safeUser } = user;
res.json(safeUser);
```

## Coding Standards

### JavaScript/TypeScript

**Variable Declaration**
```typescript
// Use const by default, let when reassignment needed
const MAX_RETRIES = 3;
let retryCount = 0;

// Avoid var
```

**Function Style**
```typescript
// Prefer arrow functions for callbacks
array.map(item => item.value);

// Use regular functions for methods
class MyClass {
  processData() {
    // ...
  }
}
```

**Async/Await over Promises**
```typescript
// ✅ Good
async function fetchUserData(id: string) {
  const user = await db.getUser(id);
  const posts = await db.getUserPosts(id);
  return { user, posts };
}

// ❌ Avoid
function fetchUserData(id: string) {
  return db.getUser(id)
    .then(user => db.getUserPosts(id)
      .then(posts => ({ user, posts }))
    );
}
```

### Python

**PEP 8 Compliance**
```python
# ✅ Good
def calculate_total_price(items: list[Item]) -> float:
    """Calculate the total price of items."""
    return sum(item.price for item in items)

# ❌ Bad
def calculateTotalPrice(items):
    total = 0
    for item in items:
        total = total + item.price
    return total
```

**Type Hints**
```python
# ✅ Good
def process_data(data: dict[str, Any]) -> list[str]:
    return [str(value) for value in data.values()]

# ❌ Bad
def process_data(data):
    return [str(value) for value in data.values()]
```

### React/JSX

**Component Structure**
```tsx
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary' 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ❌ Bad
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

## Performance Recommendations

### JavaScript Optimization

**1. Avoid Unnecessary Re-renders**
```tsx
// ❌ Bad - Creates new function on every render
function Component() {
  return <Child onClick={() => console.log('clicked')} />;
}

// ✅ Good - Memoized callback
function Component() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <Child onClick={handleClick} />;
}
```

**2. Use Appropriate Data Structures**
```javascript
// ❌ Bad - O(n) lookup
const users = [];
const user = users.find(u => u.id === targetId);

// ✅ Good - O(1) lookup
const usersMap = new Map();
const user = usersMap.get(targetId);
```

**3. Lazy Loading**
```javascript
// ✅ Good - Load component only when needed
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**4. Debounce Expensive Operations**
```javascript
// ✅ Good
const debouncedSearch = debounce((query) => {
  fetchResults(query);
}, 300);

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Database Queries

**1. Use Indexes**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_created_at ON orders(created_at);
```

**2. Avoid N+1 Queries**
```javascript
// ❌ Bad - N+1 queries
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Good - Single query with join
const users = await User.findAll({
  include: [{ model: Post }]
});
```

**3. Paginate Large Results**
```javascript
// ✅ Good
const page = 1;
const limit = 50;
const offset = (page - 1) * limit;

const results = await db.query(
  'SELECT * FROM items ORDER BY created_at DESC LIMIT ? OFFSET ?',
  [limit, offset]
);
```

## Review Checklist

When reviewing code, systematically check:

- [ ] **Readability**: Clear variable/function names, proper formatting
- [ ] **Maintainability**: Modular design, single responsibility
- [ ] **Security**: Input validation, no injection vulnerabilities
- [ ] **Performance**: Efficient algorithms, appropriate data structures
- [ ] **Testing**: Adequate test coverage, edge cases handled
- [ ] **Error Handling**: Graceful degradation, informative errors
- [ ] **Documentation**: Comments for complex logic, API documentation
- [ ] **Standards**: Follows team/language conventions
- [ ] **Dependencies**: No unnecessary dependencies, up-to-date versions
- [ ] **Accessibility**: UI is accessible (if applicable)

## Best Practices

1. **Be Constructive**: Focus on improvement, not criticism
2. **Provide Examples**: Show better alternatives with code samples
3. **Prioritize Issues**: Critical security issues first, then style
4. **Consider Context**: Understand requirements before suggesting changes
5. **Automate When Possible**: Use linters and static analysis tools
6. **Stay Current**: Keep up with language/framework best practices
7. **Learn Continuously**: Code review is learning for both reviewer and author
