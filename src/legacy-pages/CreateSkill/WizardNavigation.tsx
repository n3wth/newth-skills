import { Link } from 'react-router-dom'
import type { WizardStep } from './types'

interface WizardNavigationProps {
  currentStep: WizardStep
  selectedTemplate: string | null
  onBack: () => void
  onNext: () => void
}

export function WizardNavigation({
  currentStep,
  selectedTemplate,
  onBack,
  onNext
}: WizardNavigationProps) {
  return (
    <div className="flex justify-between mt-12 pt-8" style={{ borderTop: '1px solid var(--glass-border)' }}>
      <button
        onClick={onBack}
        disabled={currentStep === 'template'}
        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
          currentStep === 'template'
            ? 'opacity-0 pointer-events-none'
            : 'glass-pill hover:bg-white/10'
        }`}
      >
        Back
      </button>

      {currentStep !== 'preview' ? (
        <button
          onClick={onNext}
          disabled={currentStep === 'template' && !selectedTemplate}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            currentStep === 'template' && !selectedTemplate
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          Continue
        </button>
      ) : (
        <Link
          to="/submit"
          className="px-6 py-3 rounded-xl text-sm font-medium bg-white text-black hover:bg-white/90 transition-all"
        >
          Submit to Catalog
        </Link>
      )}
    </div>
  )
}
