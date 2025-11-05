import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryGallery } from '@/components/MemoryGallery'

describe('MemoryGallery Component', () => {
  it('renders without crashing', () => {
    render(<MemoryGallery />)
    expect(document.body).toBeInTheDocument()
  })

  it('handles image asset imports', () => {
    const { container } = render(<MemoryGallery />)
    // Check that component renders (images will be mocked)
    expect(container.firstChild).toBeInTheDocument()
  })

  // Memory gallery likely uses image assets that need to be properly bundled
  it('should not throw errors when loading memory images', () => {
    expect(() => {
      render(<MemoryGallery />)
    }).not.toThrow()
  })
})