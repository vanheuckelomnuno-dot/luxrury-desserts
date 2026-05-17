'use client'

import { Component, ReactNode } from 'react'

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message ?? String(error) }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream p-8">
          <div className="text-center max-w-lg">
            <h2 className="font-playfair text-2xl text-chocolate mb-4">
              Maison Dorée — Error
            </h2>
            <pre className="text-left text-xs bg-gray-100 text-red-700 p-4 rounded-lg overflow-auto mb-4 whitespace-pre-wrap break-all">
              {this.state.message}
            </pre>
            <p className="text-chocolate/60 text-sm">
              Refresh the page to try again.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
