import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/HeroSection'

describe('HeroSection Component', () => {
  it('renders without crashing', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Happy Birthday My Baby!/)).toBeInTheDocument()
  })

  it('displays the main heading', () => {
    render(<HeroSection />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Happy Birthday My Baby! 🎉')
  })

  it('displays hero image with correct src', () => {
    render(<HeroSection />)
    const heroImage = screen.getByAltText('Hero Image')
    expect(heroImage).toBeInTheDocument()
    expect(heroImage).toHaveAttribute('src', '/mock-hero-image.png')
  })

  it('displays scroll message', () => {
    render(<HeroSection />)
    expect(screen.getByText('Scroll to see more')).toBeInTheDocument()
  })

  it('has proper section structure', () => {
    render(<HeroSection />)
    const section = screen.getByRole('region')
    expect(section).toHaveClass('min-h-screen')
  })

  it('displays cake and sparkle icons', () => {
    render(<HeroSection />)
    // Check for Lucide icons by their container classes
    const sparkleIcons = document.querySelectorAll('.sparkle')
    expect(sparkleIcons).toHaveLength(2)
  })

  it('has celebration gradient styling', () => {
    render(<HeroSection />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('bg-gradient-celebration')
    expect(heading).toHaveClass('bg-clip-text')
    expect(heading).toHaveClass('text-transparent')
  })
})