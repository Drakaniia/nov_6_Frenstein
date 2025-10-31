import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface LandingCardProps {
  onOpen: () => void;
}

export const LandingCard = ({ onOpen }: LandingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Floating animation
    gsap.to(cardRef.current, {
      y: -20,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Heart pulse
    gsap.to(heartRef.current, {
      scale: 1.2,
      duration: 0.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, []);

  const handleClick = () => {
    gsap.to(cardRef.current, {
      scale: 0,
      rotation: 360,
      opacity: 0,
      duration: 0.8,
      ease: 'back.in',
      onComplete: onOpen,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-glow" />
      
      {/* Confetti background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-accent rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card
        ref={cardRef}
        className="relative z-10 p-12 shadow-celebration bg-card/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
      >
        <div className="text-center space-y-6">
          <Heart
            ref={heartRef}
            className="w-16 h-16 mx-auto text-secondary"
            fill="currentColor"
          />
          <h2 className="text-3xl font-bold bg-gradient-celebration bg-clip-text text-transparent">
            You've Got a Special Message
          </h2>
          <p className="text-muted-foreground">Someone made this just for you...</p>
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-gradient-celebration hover:opacity-90 text-white shadow-float"
          >
            Open Me 💌
          </Button>
        </div>
      </Card>
    </div>
  );
};
