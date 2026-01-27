import { useState, useCallback, useEffect, useRef } from 'react'
import { getAllBundles, createBundle, addSkillToBundle, type SkillBundle } from '../lib/community'

interface AddToBundleButtonProps {
  skillId: string
  skillName: string
  className?: string
  size?: 'sm' | 'md'
}

export function AddToBundleButton({ skillId, skillName, className = '', size = 'md' }: AddToBundleButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [bundles, setBundles] = useState<SkillBundle[]>(() => getAllBundles())
  const [showNewForm, setShowNewForm] = useState(false)
  const [newBundleName, setNewBundleName] = useState('')
  const [newBundleDesc, setNewBundleDesc] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Refresh bundles when dropdown opens
  const handleToggleWithRefresh = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOpen) {
      setBundles(getAllBundles())
    }
    setIsOpen(prev => !prev)
  }, [isOpen])
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setShowNewForm(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])
  
  
  const handleAddToBundle = useCallback((bundleId: string) => {
    addSkillToBundle(bundleId, skillId)
    setBundles(getAllBundles())
    setIsOpen(false)
  }, [skillId])
  
  const handleCreateBundle = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!newBundleName.trim()) return
    
    createBundle(newBundleName.trim(), newBundleDesc.trim(), [skillId])
    setNewBundleName('')
    setNewBundleDesc('')
    setShowNewForm(false)
    setBundles(getAllBundles())
    setIsOpen(false)
  }, [newBundleName, newBundleDesc, skillId])
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs gap-1'
    : 'px-3 py-1.5 text-sm gap-1.5'
  
  const iconSize = size === 'sm' ? 12 : 14
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggleWithRefresh}
        className={`inline-flex items-center rounded-full transition-all ${sizeClasses} ${className}`}
        style={{
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--color-grey-300)',
        }}
        title="Add to bundle"
        aria-label="Add to bundle"
        aria-expanded={isOpen}
      >
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
        <span className="font-medium">Bundle</span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute bottom-full mb-2 right-0 w-64 rounded-lg overflow-hidden z-50"
          style={{
            backgroundColor: 'rgba(20, 20, 20, 0.98)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {!showNewForm ? (
            <>
              <div className="p-3 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <p className="text-xs font-medium text-white mb-1">Add "{skillName}" to bundle</p>
                <p className="text-[10px]" style={{ color: 'var(--color-grey-400)' }}>
                  Select an existing bundle or create a new one
                </p>
              </div>
              
              <div className="max-h-48 overflow-y-auto">
                {bundles.length > 0 ? (
                  bundles.map(bundle => {
                    const isInBundle = bundle.skillIds.includes(skillId)
                    return (
                      <button
                        key={bundle.id}
                        onClick={() => !isInBundle && handleAddToBundle(bundle.id)}
                        disabled={isInBundle}
                        className="w-full px-3 py-2 text-left transition-colors hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <p className="text-xs font-medium text-white">{bundle.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--color-grey-400)' }}>
                          {isInBundle ? 'Already in bundle' : `${bundle.skillIds.length} skill${bundle.skillIds.length !== 1 ? 's' : ''}`}
                        </p>
                      </button>
                    )
                  })
                ) : (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                      No bundles yet
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-2 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="w-full px-3 py-2 rounded-md text-xs font-medium text-white transition-colors hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create New Bundle
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateBundle} className="p-3">
              <p className="text-xs font-medium text-white mb-3">Create New Bundle</p>
              
              <input
                type="text"
                value={newBundleName}
                onChange={(e) => setNewBundleName(e.target.value)}
                placeholder="Bundle name"
                className="w-full px-3 py-2 rounded-md text-xs mb-2 bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                style={{ borderColor: 'var(--glass-border)' }}
                autoFocus
              />
              
              <textarea
                value={newBundleDesc}
                onChange={(e) => setNewBundleDesc(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full px-3 py-2 rounded-md text-xs mb-3 bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                style={{ borderColor: 'var(--glass-border)' }}
              />
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-white/10"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newBundleName.trim()}
                  className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
