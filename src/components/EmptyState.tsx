'use client'
import { Character, Shape, CompositeShape, type Expression, type CompositePreset } from '@n3wth/ui'

export interface EmptyStateProps {
  title: string
  description: string
  expression?: Expression
  preset?: CompositePreset
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  expression = 'thinking',
  preset = 'cluster',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* Decorative composition */}
      <div className="relative mb-8">
        {/* Background shapes */}
        <div className="absolute -top-4 -left-8 opacity-40">
          <Shape type="circle" size={24} color="#A78BFA" />
        </div>
        <div className="absolute -bottom-2 -right-6 opacity-40">
          <Shape type="diamond" size={20} color="#FFD93D" />
        </div>
        <div className="absolute top-1/2 -right-12 opacity-30">
          <Shape type="triangle" size={16} color="#FF6B9D" rotation={15} />
        </div>

        {/* Main character or composite shape */}
        <div className="relative z-10 flex items-center gap-4">
          <Character
            expression={expression}
            size={80}
            color="#A78BFA"
            featureColor="#1d1d1f"
            animate
          />
          <div className="hidden sm:block opacity-60">
            <CompositeShape preset={preset} scale={0.7} />
          </div>
        </div>
      </div>

      {/* Text content */}
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
        {description}
      </p>

      {/* Action button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-highlight)] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
