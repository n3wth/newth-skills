---
name: MCP Builder
version: 2.0.0
author: newth.ai
category: development
tags:
  - mcp
  - servers
  - api
  - integration
compatibility:
  - claude
---

# MCP Builder

Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Build custom integrations for databases, APIs, and services.

## Triggers

Use this skill when the user wants to:
- Build an MCP server
- Create tools for Claude or other LLMs
- Integrate external APIs with AI assistants
- Connect databases to AI workflows
- Build automation with MCP

Keywords: "mcp", "mcp server", "tool", "fastmcp", "model context protocol", "integration"

## MCP Architecture Overview

```
User <-> Claude <-> MCP Server <-> External Service
                         |
                    Tools + Resources
```

MCP servers expose:
- **Tools**: Functions the LLM can call (e.g., `get_weather`, `create_issue`)
- **Resources**: Data the LLM can read (e.g., documents, database records)
- **Prompts**: Reusable prompt templates

## Usage Examples

### Basic FastMCP server (Python)

```python
from fastmcp import FastMCP

mcp = FastMCP('my-server')

@mcp.tool()
async def greet(name: str) -> str:
    """Greet a person by name."""
    return f"Hello, {name}!"

@mcp.tool()
async def add_numbers(a: int, b: int) -> int:
    """Add two numbers together."""
    return a + b

if __name__ == '__main__':
    mcp.run()
```

### API integration example

```python
from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
import httpx

mcp = FastMCP('weather-server')

@mcp.tool()
async def get_weather(city: str) -> dict:
    """Get current weather for a city.

    Args:
        city: Name of the city (e.g., "San Francisco")

    Returns:
        Weather data including temperature and conditions
    """
    if not city:
        raise ToolError('City name is required')

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                'https://api.weather.example/v1/current',
                params={'city': city},
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException:
            raise ToolError(f'Weather service timeout for {city}')
        except httpx.HTTPStatusError as e:
            raise ToolError(f'Weather API error: {e.response.status_code}')

if __name__ == '__main__':
    mcp.run()
```

### Database integration

```python
from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
import asyncpg

mcp = FastMCP('database-server')

@mcp.tool()
async def query_users(email: str | None = None, limit: int = 10) -> list[dict]:
    """Query users from the database.

    Args:
        email: Optional email to filter by
        limit: Maximum number of results (default 10, max 100)

    Returns:
        List of user records
    """
    limit = min(limit, 100)  # Enforce maximum

    conn = await asyncpg.connect('postgresql://...')
    try:
        if email:
            rows = await conn.fetch(
                'SELECT id, name, email FROM users WHERE email = $1 LIMIT $2',
                email, limit
            )
        else:
            rows = await conn.fetch(
                'SELECT id, name, email FROM users LIMIT $1',
                limit
            )
        return [dict(row) for row in rows]
    finally:
        await conn.close()

if __name__ == '__main__':
    mcp.run()
```

## Best Practices

### Tool Design
1. **Clear descriptions**: Write comprehensive docstrings - they're shown to the LLM
2. **Type hints**: Use proper types for all parameters
3. **Validation**: Validate inputs early and return helpful errors
4. **Idempotency**: Prefer idempotent operations where possible

### Error Handling
1. Use `ToolError` for user-facing errors
2. Include actionable information in error messages
3. Log internal errors but don't expose implementation details
4. Handle timeouts gracefully

### Security
1. Never expose credentials in tool responses
2. Validate and sanitize all inputs
3. Use environment variables for secrets
4. Implement rate limiting for external APIs

## Configuration

### Claude Desktop integration

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["/path/to/server.py"]
    }
  }
}
```

### Environment variables

```python
import os
from fastmcp import FastMCP

mcp = FastMCP('secure-server')

API_KEY = os.environ.get('API_KEY')
if not API_KEY:
    raise RuntimeError('API_KEY environment variable required')
```

## Dependencies

```bash
pip install fastmcp httpx
```

For TypeScript:
```bash
npm install @modelcontextprotocol/sdk
```
