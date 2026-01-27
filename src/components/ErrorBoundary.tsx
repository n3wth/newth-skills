import { Component, type ReactNode } from 'react'
import { trackError } from '../lib/analytics'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    trackError(error.message, {
      componentStack: errorInfo.componentStack || undefined,
      errorName: error.name,
    })
    
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-coral/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-coral"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-grey-400 mb-6">
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={this.handleRetry}
              className="glass-pill px-6 py-3 rounded-full font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

interface PageErrorFallbackProps {
  title?: string
  message?: string
  showHomeLink?: boolean
}

export function PageErrorFallback({
  title = 'Page Error',
  message = 'This page encountered an error and could not be displayed.',
  showHomeLink = true,
}: PageErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <div className="text-center max-w-md relative z-10">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-coral/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-coral"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-3">{title}</h1>
        <p className="text-grey-400 mb-8">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="glass-pill px-6 py-3 rounded-full font-medium"
          >
            Reload Page
          </button>
          {showHomeLink && (
            <a
              href="/"
              className="glass-pill px-6 py-3 rounded-full font-medium"
            >
              Go Home
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
