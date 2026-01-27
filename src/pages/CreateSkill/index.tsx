import { Link } from 'react-router-dom'
import { Nav } from '../../components/Nav'
import { Footer } from '../../components/Footer'
import { SEO } from '../../components/SEO'
import { ProgressIndicator } from './ProgressIndicator'
import { TemplateStep } from './TemplateStep'
import { BasicsStep } from './BasicsStep'
import { DetailsStep } from './DetailsStep'
import { PreviewStep } from './PreviewStep'
import { WizardNavigation } from './WizardNavigation'
import { useSkillWizard } from './useSkillWizard'

export function CreateSkill() {
  const {
    currentStep,
    setCurrentStep,
    selectedTemplate,
    draft,
    errors,
    filteredTemplates,
    handleTemplateSelect,
    handleStartFromScratch,
    handleNext,
    handleBack,
    handleChange,
    handleCompatibilityChange
  } = useSkillWizard()

  return (
    <div className="min-h-screen relative">
      <SEO
        title="Create a Skill - newth.ai skills"
        description="Create your own AI coding skill with our interactive wizard. Choose from templates or start from scratch."
        canonicalUrl="/create"
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-tight">
            Create a Skill
          </h1>
          <p
            className="text-lg mb-12"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Build your own AI coding skill with our guided wizard. Start from a template or create from scratch.
          </p>

          <ProgressIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

          {currentStep === 'template' && (
            <TemplateStep
              selectedTemplate={selectedTemplate}
              templates={filteredTemplates}
              onTemplateSelect={handleTemplateSelect}
              onStartFromScratch={handleStartFromScratch}
            />
          )}

          {currentStep === 'basics' && (
            <BasicsStep
              draft={draft}
              errors={errors}
              onChange={handleChange}
              onCompatibilityChange={handleCompatibilityChange}
            />
          )}

          {currentStep === 'details' && (
            <DetailsStep
              draft={draft}
              errors={errors}
              onChange={handleChange}
            />
          )}

          {currentStep === 'preview' && (
            <PreviewStep draft={draft} />
          )}

          <WizardNavigation
            currentStep={currentStep}
            selectedTemplate={selectedTemplate}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
