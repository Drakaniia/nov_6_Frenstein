import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const messages = [
  "Life is not worthwhile.",
  "I don't believe that,",
  "I'll succeed my goals",
  "Overthinking much—yet,",
  "Spending my time in studying and",
  "Achieving dreams,",
  "It's notorious!",
  "Stop telling me,",
  "I will have a better future.",
  "In my perspective,",
  "A degree is just a paper.",
  "I just don't think that,",
  "Life will be better with education."
];

export const ScrollMessage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = containerRef.current?.querySelectorAll('.message-line');
    if (!lines || lines.length === 0) return;

    // Clear existing triggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 3}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animate lines in sequence, no fade-out
    lines.forEach((line, index) => {
      gsap.set(line, { opacity: 0, y: 30 });

      tl.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, index * 0.3);

      tl.to({}, { duration: 0.2 }); // pacing only
    });

    // Progress bar animation
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 3}`,
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          ref={progressRef}
          className="h-full bg-gradient-celebration origin-left scale-x-0"
        />
      </div>

      <section
        ref={containerRef}
        className="min-h-screen bg-background flex items-center justify-center py-12 px-4"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <p
              key={index}
              className="message-line text-xl md:text-3xl font-medium text-center leading-snug"
            >
              {message}
            </p>
          ))}
        </div>
      </section>
    </>
  );
};
