import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LandingCard } from '@/components/LandingCard'

describe('LandingCard Component', () => {
  const mockOnOpen = vi.fn()

  beforeEach(() => {
    mockOnOpen.mockClear()
  })

  it('renders without crashing', () => {
    render(<LandingCard onOpen={mockOnOpen} />)
    expect(screen.getByText('Enter PIN to Unlock')).toBeInTheDocument()
  })

  it('displays PIN input fields', () => {
    render(<LandingCard onOpen={mockOnOpen} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(4)
  })

  it('displays GIF image', () => {
    render(<LandingCard onOpen={mockOnOpen} />)
    const gifImage = screen.getByAltText('Animated GIF')
    expect(gifImage).toBeInTheDocument()
    expect(gifImage).toHaveAttribute('src', '/mock-gif.gif')
  })

  it('handles PIN input correctly', async () => {
    render(<LandingCard onOpen={mockOnOpen} />)
    const inputs = screen.getAllByRole('textbox')
    
    // Enter correct PIN: 2306
    fireEvent.change(inputs[0], { target: { value: '2' } })
    fireEvent.change(inputs[1], { target: { value: '3' } })
    fireEvent.change(inputs[2], { target: { value: '0' } })
    fireEvent.change(inputs[3], { target: { value: '6' } })

    await waitFor(() => {
      expect(mockOnOpen).toHaveBeenCalled()
    }, { timeout: 1000 })
  })

  it('handles wrong PIN with shake animation', async () => {
    render(<LandingCard onOpen={mockOnOpen} />)
    const inputs = screen.getAllByRole('textbox')
    
    // Enter wrong PIN: 1234
    fireEvent.change(inputs[0], { target: { value: '1' } })
    fireEvent.change(inputs[1], { target: { value: '2' } })
    fireEvent.change(inputs[2], { target: { value: '3' } })
    fireEvent.change(inputs[3], { target: { value: '4' } })

    await waitFor(() => {
      // Should not call onOpen for wrong PIN
      expect(mockOnOpen).not.toHaveBeenCalled()
    })
  })

  it('renders number pad buttons', () => {
    render(<LandingCard onOpen={mockOnOpen} />)
    
    // Check for all number buttons 0-9
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument()
    }
    
    // Check for control buttons
    expect(screen.getByRole('button', { name: 'CLR' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<LandingCard onOpen={mockOnOpen} />)
    const inputs = screen.getAllByRole('textbox')
    
    inputs.forEach((input, index) => {
      expect(input).toHaveAttribute('inputMode', 'numeric')
      expect(input).toHaveAttribute('maxLength', '1')
      expect(input).toHaveAttribute('id', `pin-${index}`)
    })
  })
})