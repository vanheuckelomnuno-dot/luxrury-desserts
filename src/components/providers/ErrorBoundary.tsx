'use client'

import { Component, ReactNode } from 'react'

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center p-8">
            <h2 className="font-playfair text-2xl text-chocolate mb-2">
              Maison Dorée
            </h2>
            <p className="text-chocolate/60">
              Something went wrong. Please refresh the page.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
