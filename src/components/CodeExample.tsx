import { useState, useEffect } from 'react'
import { createHighlighter } from 'shiki'

interface CodeExampleProps {
  code: string
  language: string
  title?: string
}

export function CodeExample({ code, language, title }: CodeExampleProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    async function highlight() {
      try {
        setIsLoading(true)
        const highlighter = await createHighlighter({
          themes: ['github-dark'],
          langs: [language as any],
        })
        
        if (isMounted) {
          const html = highlighter.codeToHtml(code, {
            lang: language,
            theme: 'github-dark',
          })
          setHighlightedCode(html)
        }
      } catch (error) {
        console.error('Failed to highlight code:', error)
        // Fallback to plain text
        if (isMounted) {
          setHighlightedCode(`<pre><code>${code}</code></pre>`)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    highlight()

    return () => {
      isMounted = false
    }
  }, [code, language])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      {title && (
        <div 
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--color-grey-300)' }}
        >
          {title}
        </div>
      )}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'rgb(13, 17, 23)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 z-10"
          style={{
            backgroundColor: copied ? 'var(--color-sage)' : 'rgba(255, 255, 255, 0.1)',
            color: copied ? 'var(--color-bg)' : 'var(--color-grey-200)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        
        {isLoading ? (
          <div className="p-4 text-sm" style={{ color: 'var(--color-grey-400)' }}>
            Loading...
          </div>
        ) : (
          <div
            className="code-example-content overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          />
        )}
      </div>
    </div>
  )
}
