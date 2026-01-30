'use client'
import { useMemo } from 'react'

interface CodeBlockProps {
  code: string
  language?: 'javascript' | 'typescript' | 'json'
}

interface Token {
  type: 'keyword' | 'string' | 'number' | 'comment' | 'property' | 'punctuation' | 'text'
  value: string
}

const COLORS = {
  keyword: 'var(--color-coral)',      // pink/coral for keywords
  string: 'var(--color-mint)',        // mint for strings
  number: 'var(--color-gold)',        // gold for numbers
  comment: 'var(--color-grey-500)',   // grey for comments
  property: 'var(--color-sage)',      // sage for property names
  punctuation: 'var(--color-grey-400)', // subtle grey for punctuation
  text: 'var(--color-grey-200)',      // default text color
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let remaining = code

  const patterns: [RegExp, Token['type']][] = [
    [/^\/\/.*$/m, 'comment'],
    [/^\/\*[\s\S]*?\*\//, 'comment'],
    [/^'[^']*'/, 'string'],
    [/^"[^"]*"/, 'string'],
    [/^`[^`]*`/, 'string'],
    [/^\b(const|let|var|function|return|if|else|for|while|import|export|from|default|class|extends|new|this|true|false|null|undefined)\b/, 'keyword'],
    [/^\b\d+(\.\d+)?\b/, 'number'],
    [/^[a-zA-Z_][a-zA-Z0-9_]*(?=\s*:)/, 'property'],
    [/^[{}[\](),;:]/, 'punctuation'],
    [/^\s+/, 'text'],
    [/^[^\s{}[\](),;:'"`]+/, 'text'],
  ]

  while (remaining.length > 0) {
    let matched = false

    for (const [pattern, type] of patterns) {
      const match = remaining.match(pattern)
      if (match) {
        tokens.push({ type, value: match[0] })
        remaining = remaining.slice(match[0].length)
        matched = true
        break
      }
    }

    if (!matched) {
      tokens.push({ type: 'text', value: remaining[0] })
      remaining = remaining.slice(1)
    }
  }

  return tokens
}

export function CodeBlock({ code, language: _language = 'javascript' }: CodeBlockProps) {
  const tokens = useMemo(() => tokenize(code), [code])

  return (
    <pre
      className="text-sm font-mono whitespace-pre overflow-x-auto"
      style={{ color: 'var(--color-grey-200)' }}
    >
      <code>
        {tokens.map((token, i) => (
          <span key={i} style={{ color: COLORS[token.type] }}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  )
}
