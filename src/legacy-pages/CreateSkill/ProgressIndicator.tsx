import { WIZARD_STEPS, type WizardStep } from './types'

interface ProgressIndicatorProps {
  currentStep: WizardStep
  onStepClick: (step: WizardStep) => void
}

export function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  const currentIndex = WIZARD_STEPS.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center justify-between mb-12">
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = step.id === currentStep
        const isClickable = index <= currentIndex

        return (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex items-center gap-3 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isCurrent
                    ? 'bg-white text-black'
                    : isCompleted
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-sm hidden md:block ${
                  isCurrent ? 'text-white font-medium' : isCompleted ? 'text-white/70' : 'text-white/40'
                }`}
              >
                {step.label}
              </span>
            </button>
            {index < WIZARD_STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-4 ${
                  index < currentIndex ? 'bg-white/30' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
