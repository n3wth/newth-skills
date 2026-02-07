'use client'
import { useState } from 'react'
import type { Workflow } from '../../data/workflows'

export interface SaveWorkflowModalProps {
  workflow: Workflow
  onSave: (name: string, description: string, isPublic: boolean, tags: string[]) => void
  onClose: () => void
}

export function SaveWorkflowModal({ workflow, onSave, onClose }: SaveWorkflowModalProps) {
  const [name, setName] = useState(workflow.name)
  const [description, setDescription] = useState(workflow.description)
  const [isPublic, setIsPublic] = useState(workflow.isPublic)
  const [tagsInput, setTagsInput] = useState(workflow.tags.join(', '))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    onSave(name, description, isPublic, tags)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-[var(--color-white)] mb-4">Save Workflow</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="workflow-name" className="block text-sm text-[var(--color-grey-400)] mb-2">Name</label>
            <input
              id="workflow-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Workflow"
              required
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)]"
            />
          </div>

          <div>
            <label htmlFor="workflow-description" className="block text-sm text-[var(--color-grey-400)] mb-2">Description</label>
            <textarea
              id="workflow-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this workflow do?"
              rows={3}
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)] resize-none"
            />
          </div>

          <div>
            <label htmlFor="workflow-tags" className="block text-sm text-[var(--color-grey-400)] mb-2">Tags (comma-separated)</label>
            <input
              id="workflow-tags"
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="automation, research, documents"
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)]"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--glass-border)] bg-[var(--glass-bg)]"
            />
            <label htmlFor="isPublic" className="text-sm text-[var(--color-grey-300)]">
              Make this workflow public
            </label>
          </div>

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
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 text-sm bg-[var(--color-white)] text-[var(--color-bg)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
