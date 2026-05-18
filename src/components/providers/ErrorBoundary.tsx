'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

export default class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream p-8">
          <div className="text-center">
            <h2 className="font-playfair text-2xl text-chocolate mb-2">Sami Sweets</h2>
            <p className="text-chocolate/60">Something went wrong. Please refresh the page.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
