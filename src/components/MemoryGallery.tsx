import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/card';
import memory1 from '@/assets/memory1.jpg';
import memory2 from '@/assets/memory2.jpg';
import memory3 from '@/assets/memory3.jpg';
import memory4 from '@/assets/memory4.jpg';

gsap.registerPlugin(ScrollTrigger);

const memories = [
  { id: 1, label: 'Beautiful Smile', image: memory1 },
  { id: 2, label: 'Park Adventures', image: memory2 },
  { id: 3, label: 'Sweet Moments', image: memory3 },
  { id: 4, label: 'Fun Times', image: memory4 },
  { id: 5, label: 'Precious Memories', image: memory1 },
  { id: 6, label: 'Happy Days', image: memory2 },
  { id: 7, label: 'Together Forever', image: memory3 },
  { id: 8, label: 'Special Moments', image: memory4 },
];

export const MemoryGallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = galleryRef.current?.querySelectorAll('.memory-card');
    if (!cards) return;

    // Stagger fade-in animation on scroll
    gsap.from(cards, {
      opacity: 0,
      y: 100,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: galleryRef.current,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    });

    // After initial animation, create continuous scrolling effect
    const setupContinuousScroll = () => {
      // Row 1: Left to Right
      gsap.to(row1Ref.current, {
        x: '-20%',
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'bottom bottom',
        },
      });

      // Row 2: Right to Left
      gsap.to(row2Ref.current, {
        x: '20%',
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'bottom bottom',
        },
      });
    };

    // Delay continuous scroll until after initial animation
    setTimeout(setupContinuousScroll, 2000);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const halfLength = Math.ceil(memories.length / 2);
  const row1 = memories.slice(0, halfLength);
  const row2 = memories.slice(halfLength);

  return (
    <section className="py-20 bg-muted/30">
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-celebration bg-clip-text text-transparent">
          Memories Together 📸
        </h2>
        <p className="text-lg text-muted-foreground">
          Moments we'll treasure forever
        </p>
      </div>

      <div ref={galleryRef} className="space-y-8 overflow-hidden">
        {/* Row 1 - Scrolls Left to Right */}
        <div ref={row1Ref} className="flex gap-6 px-6">
          {row1.map((memory) => (
            <Card
              key={memory.id}
              className="memory-card flex-shrink-0 w-80 h-96 overflow-hidden hover:scale-105 transition-transform shadow-float"
            >
              <img 
                src={memory.image} 
                alt={memory.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-xl font-semibold text-white">{memory.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Row 2 - Scrolls Right to Left */}
        <div ref={row2Ref} className="flex gap-6 px-6">
          {row2.map((memory) => (
            <Card
              key={memory.id}
              className="memory-card flex-shrink-0 w-80 h-96 overflow-hidden hover:scale-105 transition-transform shadow-float relative"
            >
              <img 
                src={memory.image} 
                alt={memory.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-xl font-semibold text-white">{memory.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center mt-16 px-4">
        <p className="text-2xl md:text-3xl font-medium mb-4">
          Here's to many more memories! 🥂
        </p>
        <p className="text-lg text-muted-foreground">
          Wishing you a birthday as wonderful as you are!
        </p>
      </div>
    </section>
  );
};
