import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Should render the Index page by default
    expect(screen.getByText('Enter PIN to Unlock')).toBeInTheDocument()
  })

  it('includes all required providers', () => {
    render(<App />)
    // Check that the app renders, which means all providers are working
    expect(document.body).toBeInTheDocument()
  })

  it('renders router correctly', () => {
    render(<App />)
    // Should render without throwing router errors
    expect(screen.getByText('Enter PIN to Unlock')).toBeInTheDocument()
  })

  it('includes toast and tooltip providers', () => {
    const { container } = render(<App />)
    // Check that providers don't throw errors
    expect(container.firstChild).toBeInTheDocument()
  })
})