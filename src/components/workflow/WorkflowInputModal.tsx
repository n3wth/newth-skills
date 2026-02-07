'use client'
import { useState } from 'react'
import type { getRequiredInputs } from '../../lib/workflowExecutor'

export type RequiredInput = ReturnType<typeof getRequiredInputs>[number]

export interface WorkflowInputModalProps {
  requiredInputs: RequiredInput[]
  onRun: (inputs: Record<string, Record<string, string>>) => void
  onClose: () => void
}

export function WorkflowInputModal({ requiredInputs, onRun, onClose }: WorkflowInputModalProps) {
  const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    requiredInputs.forEach(input => {
      initial[`${input.nodeId}:${input.inputId}`] = ''
    })
    return initial
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const structured: Record<string, Record<string, string>> = {}
    requiredInputs.forEach(input => {
      const value = inputValues[`${input.nodeId}:${input.inputId}`]
      if (value) {
        if (!structured[input.nodeId]) {
          structured[input.nodeId] = {}
        }
        structured[input.nodeId][input.inputId] = value
      }
    })

    onRun(structured)
  }

  const allFilled = requiredInputs.every(
    input => inputValues[`${input.nodeId}:${input.inputId}`]?.trim()
  )

  const inputsByNode = requiredInputs.reduce((acc, input) => {
    if (!acc[input.nodeId]) {
      acc[input.nodeId] = { nodeName: input.nodeName, inputs: [] }
    }
    acc[input.nodeId].inputs.push(input)
    return acc
  }, {} as Record<string, { nodeName: string; inputs: RequiredInput[] }>)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
        <h3 className="text-xl font-semibold text-[var(--color-white)] mb-2">Workflow Inputs</h3>
        <p className="text-sm text-[var(--color-grey-400)] mb-6">
          Provide the required inputs to run this workflow
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(inputsByNode).map(([nodeId, { nodeName, inputs }]) => (
            <NodeInputGroup
              key={nodeId}
              nodeId={nodeId}
              nodeName={nodeName}
              inputs={inputs}
              inputValues={inputValues}
              onInputChange={(key, value) => setInputValues(prev => ({ ...prev, [key]: value }))}
            />
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm text-[var(--color-grey-400)] hover:text-[var(--color-white)] border border-[var(--glass-border)] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allFilled}
              className="flex-1 px-4 py-3 text-sm bg-[var(--color-sage)] text-[var(--color-bg)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              Run Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface NodeInputGroupProps {
  nodeId: string
  nodeName: string
  inputs: RequiredInput[]
  inputValues: Record<string, string>
  onInputChange: (key: string, value: string) => void
}

function NodeInputGroup({
  nodeId,
  nodeName,
  inputs,
  inputValues,
  onInputChange
}: NodeInputGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
        <h4 className="text-sm font-medium text-[var(--color-grey-300)]">{nodeName}</h4>
      </div>

      {inputs.map(input => (
        <InputField
          key={`${nodeId}:${input.inputId}`}
          nodeId={nodeId}
          input={input}
          value={inputValues[`${nodeId}:${input.inputId}`] || ''}
          onChange={(value) => onInputChange(`${nodeId}:${input.inputId}`, value)}
        />
      ))}
    </div>
  )
}

interface InputFieldProps {
  nodeId: string
  input: RequiredInput
  value: string
  onChange: (value: string) => void
}

function InputField({ nodeId, input, value, onChange }: InputFieldProps) {
  const isTextArea = input.inputType === 'text' || input.inputType === 'code'
  const inputId = `workflow-input-${nodeId}-${input.inputId}`

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm text-[var(--color-grey-400)] mb-1.5">
        {input.inputName}
        <span className="text-xs text-[var(--color-grey-600)] ml-2">({input.inputType})</span>
      </label>
      {input.description && (
        <p className="text-xs text-[var(--color-grey-600)] mb-2">{input.description}</p>
      )}
      {isTextArea ? (
        <textarea
          id={inputId}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${input.inputName.toLowerCase()}...`}
          rows={3}
          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)] resize-none text-sm"
        />
      ) : (
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${input.inputName.toLowerCase()}...`}
          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)] text-sm"
        />
      )}
    </div>
  )
}
