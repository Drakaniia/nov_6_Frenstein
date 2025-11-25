import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import gsap from 'gsap';

// Images for the trail effect from your assets folder
const trailImagePath = [
  '/src/assets/Hover (1).jpg',
  '/src/assets/Hover (2).jpg',
  '/src/assets/Hover (3).jpg',
  '/src/assets/Hover (4).jpg',
  '/src/assets/Hover (5).jpg',
  '/src/assets/Hover (6).jpg',
  '/src/assets/memory1.jpg',
  '/src/assets/memory2.jpg',
  '/src/assets/memory3.jpg',
  '/src/assets/memory4.jpg',
  '/src/assets/memory1.jpg',
];

interface TrailImage {
  id: number;
  x: number;
  y: number;
  image: string;
  ref: HTMLDivElement | null;
}

export const HoverMouse = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trailImages, setTrailImages] = useState<TrailImage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const imageIdCounter = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const throttleTimer = useRef<number | null>(null);

  // Music player state
  const [currentTrack] = useState({
    title: 'seven',
    artist: 'Taylor Swift',
    coverImage: '/src/assets/Cover of seven by Taylor Swift.jpg',
    audioFile: '/src/assets/seven - Taylor Swift.mp3',
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate distance from last position
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only create new image if moved enough distance (throttle effect)
      if (distance > 30) {
        lastMousePos.current = { x, y };

        // Create new trail image
        const randomImage =
          trailImagePath[Math.floor(Math.random() * trailImagePath.length)];
        const newImage: TrailImage = {
          id: imageIdCounter.current++,
          x,
          y,
          image: randomImage,
          ref: null,
        };

        setTrailImages(prev => [...prev, newImage]);

        // Clear any existing throttle timer
        if (throttleTimer.current) {
          clearTimeout(throttleTimer.current);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, []);

  // GSAP animation for each trail image
  useEffect(() => {
    trailImages.forEach(img => {
      if (img.ref && !img.ref.dataset.animated) {
        // Mark as animated to prevent re-animation
        img.ref.dataset.animated = 'true';

        // Initial state
        gsap.set(img.ref, {
          scale: 0,
          opacity: 0,
          rotation: Math.random() * 20 - 10, // Random rotation between -10 and 10
        });

        // Animation timeline
        const tl = gsap.timeline({
          onComplete: () => {
            // Remove image from state after animation completes
            setTrailImages(prev => prev.filter(i => i.id !== img.id));
          },
        });

        tl.to(img.ref, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
        }).to(
          img.ref,
          {
            opacity: 0,
            scale: 1, // Keep scale at 1 to prevent shrinking effect
            duration: 1, // Extended fade out duration
            ease: 'power2.inOut',
          },
          '+=0.8'
        ); // Longer delay before fade out
      }
    });
  }, [trailImages]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Audio Element */}
      <audio ref={audioRef} src={currentTrack.audioFile} preload="metadata" />

      <div className="flex h-screen">
        {/* Left Side - Music Player and Message */}
        <div className="w-96 p-6 bg-white/80 backdrop-blur-sm shadow-xl overflow-y-auto">
          {/* Music Player */}
          <Card className="p-4 mb-6">
            <div className="text-center mb-4">
              {/* Album Cover */}
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-lg">
                <img
                  src={currentTrack.coverImage}
                  alt={`${currentTrack.title} cover`}
                  className="w-full h-full object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<div class="w-full h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15":/svg></div>';
                    }
                  }}
                />
              </div>
              <h3 className="font-semibold text-gray-800">
                {currentTrack.title}
              </h3>
              <p className="text-sm text-gray-600">{currentTrack.artist}</p>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full bg-gray-200 rounded-full h-2 mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-100"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                }}
              ></div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button variant="ghost" size="sm">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                onClick={togglePlay}
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </Card>

          {/* Birthday Message */}
          <Card className="p-6">
            <h2
              className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              Happy 20th Birthday, Mi Amor!
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                It’s hard to believe how many stories have already been written
                on every page of your chapter. Even though not every moment is a
                good one, each experience—both joyful and painful—has shaped who
                you are today. Life doesn’t always follow the path we expect,
                but every obstacle you’ve faced has added depth to your story
                and strength to your heart.
              </p>
              <p>
                As the poem says, “Don’t overthink yet—you’ll succeed in your
                goals.” Those words remind me that even when life feels
                uncertain, education will always be a light that guides us
                toward a better future. It teaches us that a degree is not just
                a piece of paper, but a symbol of our hard work, sleepless
                nights, and faith in ourselves. We may face doubt, fear, and
                even moments of exhaustion, but the journey of learning shapes
                who we are and who we will become.
              </p>
              <p>
                My sincere apology for the days I wasn’t by your side, or when I
                was too stubborn to understand. Especially last year on your
                birthday—I didn’t even give you anything, not even a simple
                gesture to show how much I cared. I know there were times when
                my attitude hurt you, when my actions made you upset, and for
                that, I’m truly sorry.
              </p>
              <p>
                I never meant to make you feel unappreciated or unloved.
                Sometimes I get lost in my own thoughts and forget how my
                silence or mistakes can affect others. But please know that deep
                down, I’ve always valued you and the moments we’ve shared.
              </p>
              <p>
                I can’t change the past, but I can promise to be better—to
                listen more, to care more, and to show more of the gratitude you
                deserve. I’m hoping that you’ll still forgive me, still see the
                good in me, and still believe that I’m trying my best to grow
                and make things right.
              </p>
              <p>
                But here we are today. I wish I could be by your side right
                now—to look at you and show you just how lucky I am to have you
                in my life. Every moment with you feels like a reminder that
                even in the most ordinary days, love can make everything
                brighter.
              </p>
              <p>
                Remember that you are deeply loved, cherished, and supported in
                every step you take. You’ve touched my life in ways words can
                hardly express, and I’ll always be grateful for that.
              </p>
              <p>
                May this year bring you endless happiness, success, and
                everything your heart desires. You deserve nothing less than the
                best that life can offer. And no matter where we are or how far
                apart we may be, my thoughts and care will always find their way
                to you.
              </p>
              <p className="text-center font-semibold text-purple-600 mt-6">
                With all my love and best wishes! 💕
              </p>
            </div>
          </Card>
        </div>

        {/* Center - Interactive Trail Area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center cursor-none relative overflow-hidden"
        >
          {/* Trail Images */}
          {trailImages.map(img => (
            <div
              key={img.id}
              ref={el => {
                if (el && !img.ref) {
                  img.ref = el;
                }
              }}
              className="absolute pointer-events-none"
              style={{
                left: img.x - 40,
                top: img.y - 50,
                zIndex: 10,
              }}
            >
              {/* Polaroid-style frame */}
              <div
                className="bg-white p-2 shadow-2xl"
                style={{ width: '80px' }}
              >
                <div className="bg-gray-200 w-full h-20 overflow-hidden">
                  <img
                    src={img.image}
                    alt="trail"
                    className="w-full h-full object-cover"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23fbbf24" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dy=".3em"%3E🎉%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="h-4 bg-white"></div>
              </div>
            </div>
          ))}

          <div className="text-center z-0">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">
              HOVER YOUR MOUSE
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              USE LAPTOP OR DESKTOP FOR BETTER EXPERIENCE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
