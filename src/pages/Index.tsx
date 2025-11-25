import { useState } from 'react';
import { LandingCard } from '@/components/LandingCard';
import { HeroSection } from '@/components/HeroSection';
import { ScrollMessage } from '@/components/ScrollMessage';
import { MemoryGallery } from '@/components/MemoryGallery';
import { HoverMouse } from '@/components/HoverMouse';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { GlobalBackground } from '@/components/GlobalBackground';

const Index = () => {
  const [opened, setOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpen = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setOpened(true);
      setShowConfetti(false);
    }, 800);
  };

  return (
    <>
      {/* Global background applied to all sections */}
      <GlobalBackground />

      <ConfettiEffect trigger={showConfetti} />

      {!opened ? (
        <LandingCard onOpen={handleOpen} />
      ) : (
        <>
          <HeroSection />
          <ScrollMessage />
          <MemoryGallery />
          <HoverMouse />
        </>
      )}
    </>
  );
};

export default Index;
