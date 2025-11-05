import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card } from '@/components/ui/card';

import memory1 from '@/assets/Hover (3).jpg';
import memory2 from '@/assets/Hover (5).jpg';
import memory3 from '@/assets/memory3.jpg';
import memory4 from '@/assets/Hover (1).jpg';

const memories = [
  { id: 1, image: memory1 },
  { id: 2, image: memory2 },
  { id: 3, image: memory3 },
  { id: 4, image: memory4 },
];

export const MemoryGallery = () => {
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const rows = rowRefs.current;
    animationsRef.current.forEach(a => a.kill());
    animationsRef.current = [];

    rows.forEach((row, i) => {
      if (!row) return;

      const cards = Array.from(row.querySelectorAll('.memory-card'));
      const cardWidth = (cards[0] as HTMLElement)?.offsetWidth + 24;
      const totalCards = cards.length;
      const totalWidth = totalCards * cardWidth;
      const screenWidth = window.innerWidth;

      // Clone enough cards to ensure a smooth loop
      const clonesNeeded = Math.ceil((screenWidth * 2) / totalWidth) + 1;
      for (let j = 0; j < clonesNeeded; j++) {
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          row.appendChild(clone);
        });
      }

      const fullWidth = row.scrollWidth;
      const direction = i % 2 === 0 ? 1 : -1;

      // Start positions
      gsap.set(row, { x: direction === 1 ? 0 : -totalWidth });

      // Smooth infinite loop
      const anim = gsap.to(row, {
        x: direction === 1 ? -totalWidth : 0,
        duration: 90,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => {
            const mod = parseFloat(x) % totalWidth;
            return `${mod}`;
          }),
        },
      });

      animationsRef.current.push(anim);
    });

    return () => animationsRef.current.forEach(a => a.kill());
  }, []);

  const handleRowEnter = (index: number) =>
    animationsRef.current[index]?.pause();
  const handleRowLeave = (index: number) =>
    animationsRef.current[index]?.play();

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Memories Together 📸
        </h2>
        <p className="text-lg text-muted-foreground">
          Moments we'll treasure forever
        </p>
      </div>

      <div className="space-y-10 overflow-hidden">
        {[0, 1].map(rowIndex => (
          <div
            key={rowIndex}
            ref={el => (rowRefs.current[rowIndex] = el!)}
            className="flex gap-6 px-6 cursor-grab active:cursor-grabbing"
            onMouseEnter={() => handleRowEnter(rowIndex)}
            onMouseLeave={() => handleRowLeave(rowIndex)}
          >
            {memories.map((memory, index) => (
              <Card
                key={`${memory.id}-${rowIndex}-${index}`}
                className="memory-card flex-shrink-0 basis-[80%] sm:basis-1/2 md:basis-1/3 xl:basis-1/5 h-96 overflow-hidden hover:scale-105 transition-transform shadow-lg relative"
              >
                <img
                  src={memory.image}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable="false"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-xl font-semibold text-white">
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ))}
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