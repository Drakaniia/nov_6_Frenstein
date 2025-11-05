import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LandingCard } from '@/components/LandingCard'
import { HeroSection } from '@/components/HeroSection'

describe('CSS Integration Diagnostics', () => {
  it('should apply Tailwind classes correctly', () => {
    const { container } = render(<LandingCard onOpen={() => {}} />)
    
    // Check that Tailwind classes are present
    const elements = container.querySelectorAll('[class*="flex"], [class*="grid"], [class*="bg-"]')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('should handle custom CSS variables', () => {
    const { container } = render(<HeroSection />)
    
    // Check for elements that use CSS custom properties
    const gradientElements = container.querySelectorAll('[class*="gradient"]')
    expect(gradientElements.length).toBeGreaterThan(0)
  })

  it('should not have CSS import errors', () => {
    // This test ensures CSS imports don't throw errors
    expect(() => {
      render(<LandingCard onOpen={() => {}} />)
      render(<HeroSection />)
    }).not.toThrow()
  })

  it('should handle responsive classes', () => {
    const { container } = render(<LandingCard onOpen={() => {}} />)
    
    // Check for responsive Tailwind classes
    const responsiveElements = container.querySelectorAll('[class*="md:"], [class*="lg:"], [class*="sm:"]')
    expect(responsiveElements.length).toBeGreaterThan(0)
  })

  it('should apply animation classes', () => {
    const { container } = render(<HeroSection />)
    
    // Check for animation classes that might be stripped in production
    const animatedElements = container.querySelectorAll('[class*="animate"], [class*="transition"]')
    expect(animatedElements.length).toBeGreaterThan(0)
  })
})