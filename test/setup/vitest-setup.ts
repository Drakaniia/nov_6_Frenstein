import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock GSAP for testing environment
beforeAll(() => {
  // Mock GSAP
  vi.mock('gsap', () => ({
    gsap: {
      timeline: vi.fn(() => ({
        from: vi.fn().mockReturnThis(),
        to: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
      })),
      registerPlugin: vi.fn(),
      to: vi.fn(),
      set: vi.fn(),
      from: vi.fn(),
    },
    ScrollTrigger: {
      create: vi.fn(),
      getAll: vi.fn(() => []),
    }
  }))

  // Mock canvas-confetti
  vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
  }))

  // Mock asset imports
  vi.mock('@/assets/Hero Image.png', () => ({
    default: '/mock-hero-image.png'
  }))
  
  vi.mock('@/assets/giig.gif', () => ({
    default: '/mock-gif.gif'
  }))

  // Mock audio files
  vi.mock('@/assets/seven - Taylor Swift.mp3', () => ({
    default: '/mock-audio.mp3'
  }))

  // Mock other image assets
  const mockImageAssets = [
    'memory1.jpg', 'memory2.jpg', 'memory3.jpg', 'memory4.jpg',
    'Hover (1).jpg', 'Hover (2).jpg', 'Hover (3).jpg', 'Hover (4).jpg', 'Hover (5).jpg', 'Hover (6).jpg'
  ]
  
  mockImageAssets.forEach(asset => {
    vi.mock(`@/assets/${asset}`, () => ({
      default: `/mock-${asset}`
    }))
  })

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})