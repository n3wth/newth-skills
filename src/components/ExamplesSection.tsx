import { useState } from 'react'
import { CodeExample } from './CodeExample'
import type { SkillExample } from '../data/skills'

interface ExamplesSectionProps {
  examples: SkillExample[]
  categoryColor?: string
}

export function ExamplesSection({ examples, categoryColor }: ExamplesSectionProps) {
  const [activeTab, setActiveTab] = useState(0)

  if (!examples || examples.length === 0) {
    return null
  }

  const activeExample = examples[activeTab]

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-white mb-6">
        Code Examples
      </h2>

      {/* Tab Navigation */}
      {examples.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === index ? 'active' : ''
              }`}
              style={{
                backgroundColor: activeTab === index 
                  ? categoryColor 
                    ? `${categoryColor}30` 
                    : 'var(--glass-highlight)'
                  : 'var(--glass-bg)',
                border: `1px solid ${
                  activeTab === index && categoryColor
                    ? categoryColor
                    : 'var(--glass-border)'
                }`,
                color: activeTab === index && categoryColor
                  ? categoryColor
                  : activeTab === index
                  ? 'var(--color-grey-100)'
                  : 'var(--color-grey-400)',
              }}
            >
              {example.title}
            </button>
          ))}
        </div>
      )}

      {/* Example Description */}
      {activeExample.description && (
        <div 
          className="p-4 rounded-lg mb-4"
          style={{
            backgroundColor: categoryColor ? `${categoryColor}15` : 'var(--glass-bg)',
            border: `1px solid ${categoryColor ? `${categoryColor}30` : 'var(--glass-border)'}`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="text-lg shrink-0 mt-0.5"
              role="img"
              aria-label="lightbulb"
            >
              💡
            </div>
            <div>
              <div 
                className="text-sm font-medium mb-1"
                style={{ color: categoryColor || 'var(--color-grey-200)' }}
              >
                Try this
              </div>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-grey-300)' }}
              >
                {activeExample.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Code Block */}
      <CodeExample
        code={activeExample.code}
        language={activeExample.language}
      />

      {/* Language Badge */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="text-xs uppercase tracking-wider px-2 py-1 rounded"
          style={{
            color: 'var(--color-grey-400)',
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
        >
          {activeExample.language}
        </span>
      </div>
    </div>
  )
}
