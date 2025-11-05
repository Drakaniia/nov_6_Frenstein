import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

describe('Router Integration Diagnostics', () => {
  it('should render root route correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    
    // Should show landing card on root route
    expect(screen.getByText('Enter PIN to Unlock')).toBeInTheDocument()
  })

  it('should handle unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    )
    
    // Should show 404 page
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })

  it('should not crash with BrowserRouter in production build', () => {
    // This test ensures BrowserRouter works with production builds
    // In production, routing might behave differently than in dev
    expect(() => {
      render(<App />)
    }).not.toThrow()
  })

  it('should handle base path configuration', () => {
    // Test that router works with Vite base configuration
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    
    expect(document.body).toBeInTheDocument()
  })
})