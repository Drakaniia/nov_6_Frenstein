import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cake, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(heroRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: 'back.out',
    })
      .from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power3.out',
      })
      .from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.3')
      .from(cakeRef.current, {
        opacity: 0,
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: 'elastic.out',
      }, '-=0.4');

    // Continuous sparkle animation
    gsap.to('.sparkle', {
      rotation: 360,
      duration: 4,
      ease: 'linear',
      repeat: -1,
    });
  }, []);

  return (
    <section ref={heroRef} className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-glow" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center gap-8">
          <Sparkles className="sparkle w-12 h-12 text-primary" />
          <div ref={cakeRef}>
            <Cake className="w-24 h-24 text-secondary" fill="currentColor" />
          </div>
          <Sparkles className="sparkle w-12 h-12 text-accent" />
        </div>

        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-celebration bg-clip-text text-transparent"
        >
          🎉 Happy Birthday! 🎉
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed"
        >
          Today is your special day, and we're here to celebrate the amazing person you are!
        </p>

        <div className="mt-12 inline-block">
          <div className="animate-bounce text-4xl">👇</div>
          <p className="text-sm text-muted-foreground mt-2">Scroll down for a special message</p>
        </div>
      </div>
    </section>
  );
};
