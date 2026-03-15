import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-4 md:p-8">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                Something went wrong
              </h2>
              <p className="text-zinc-400 mb-4">
                An error occurred while rendering the application.
              </p>
              <p className="text-sm text-zinc-500 mb-6">
                {this.state.error?.message}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}