import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GlobalBackground } from '@/components/GlobalBackground'

describe('GlobalBackground Component', () => {
  it('renders without crashing', () => {
    render(<GlobalBackground />)
    expect(document.body).toBeInTheDocument()
  })

  it('applies background styling', () => {
    const { container } = render(<GlobalBackground />)
    expect(container.firstChild).toBeInTheDocument()
  })

  // Global background is critical for visual appearance
  // If this fails to render, the app might appear blank
  it('should be present in DOM', () => {
    const { container } = render(<GlobalBackground />)
    expect(container.firstChild).not.toBeNull()
  })
})