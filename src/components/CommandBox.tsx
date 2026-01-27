import { useState } from 'react'

interface CommandBoxProps {
  name: string
  command: string
  primary: boolean
}

export function CommandBox({ name, command, primary }: CommandBoxProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={handleCopy}
      className={`command-box flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 cursor-pointer ${primary ? 'primary' : ''}`}
    >
      <span
        className="label shrink-0 sm:w-24"
        style={{ color: primary ? 'var(--color-accent)' : 'var(--color-grey-400)' }}
      >
        {name}
      </span>
      <code
        className="flex-1 text-xs sm:text-sm overflow-x-auto whitespace-nowrap font-mono"
        style={{ color: 'var(--color-grey-200)' }}
      >
        {command}
      </code>
      <span className={`label px-3 py-1.5 rounded-lg copy-btn ${copied ? 'copied' : ''}`}>
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </div>
  )
}
