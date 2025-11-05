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
      utils: {
        unitize: vi.fn((fn) => fn)
      }
    },
    ScrollTrigger: {
      create: vi.fn(),
      getAll: vi.fn(() => []),
    }
  }))

  // Mock GSAP modules
  vi.mock('gsap/ScrollTrigger', () => ({
    ScrollTrigger: {
      create: vi.fn(),
      getAll: vi.fn(() => []),
    }
  }))

  // Mock canvas-confetti
  vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
  }))

  // Mock asset imports - Fixed: removed the commented line that caused the error
  vi.mock('@/assets/Hero Image.png', () => ({
    default: '/mock-hero-image.png'
  }))
  
  vi.mock('@/assets/giig.gif', () => ({
    default: '/mock-gif.gif'
  }))

  vi.mock('@/assets/Cover of seven by Taylor Swift.jpg', () => ({
    default: '/mock-cover.jpg'
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
      addListener: vi.fn(),
      removeListener: vi.fn(),
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
  })) as any

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as any

  // Mock HTMLMediaElement
  window.HTMLMediaElement.prototype.load = vi.fn()
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  window.HTMLMediaElement.prototype.pause = vi.fn()
})