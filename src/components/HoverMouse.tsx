import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

// Sample images for the hover effect - you can replace these with actual image paths
const hoverImages = [
  '/placeholder.svg',
  '/placeholder.svg', 
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg'
];

interface FloatingImage {
  id: number;
  x: number;
  y: number;
  image: string;
  opacity: number;
  scale: number;
}

export const HoverMouse = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [floatingImages, setFloatingImages] = useState<FloatingImage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const imageIdCounter = useRef(0);

  // Music player state
  const [currentTrack, setCurrentTrack] = useState({
    title: "seven",
    artist: "Taylor Swift",
    coverImage: "/src/assets/Cover of seven by Taylor Swift.jpg",
    audioFile: "/src/assets/seven - Taylor Swift.mp3"
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create new floating image
      const newImage: FloatingImage = {
        id: imageIdCounter.current++,
        x,
        y,
        image: hoverImages[Math.floor(Math.random() * hoverImages.length)],
        opacity: 1,
        scale: 0
      };

      setFloatingImages(prev => [...prev, newImage]);
    };

    const animateImages = () => {
      setFloatingImages(prev => 
        prev
          .map(img => ({
            ...img,
            opacity: Math.max(0, img.opacity - 0.02),
            scale: Math.min(1, img.scale + 0.05)
          }))
          .filter(img => img.opacity > 0)
      );
      animationFrame = requestAnimationFrame(animateImages);
    };

    container.addEventListener('mousemove', handleMouseMove);
    animationFrame = requestAnimationFrame(animateImages);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

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
    <section className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 relative overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioFile}
        preload="metadata"
      />

      {/* Floating Images */}
      {floatingImages.map(img => (
        <div
          key={img.id}
          className="absolute pointer-events-none z-10"
          style={{
            left: img.x - 25,
            top: img.y - 25,
            opacity: img.opacity,
            transform: `scale(${img.scale})`,
            transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center">
            <span className="text-white text-xl">🎉</span>
          </div>
        </div>
      ))}

      <div className="flex h-screen">
        {/* Left Side - Music Player and Message */}
        <div className="w-80 p-6 bg-white/80 backdrop-blur-sm shadow-xl">
          {/* Music Player */}
          <Card className="p-4 mb-6">
            <div className="text-center mb-4">
              {/* Album Cover */}
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-lg">
                <img 
                  src={currentTrack.coverImage} 
                  alt={`${currentTrack.title} cover`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">{currentTrack.title}</h3>
              <p className="text-sm text-gray-600">{currentTrack.artist}</p>
            </div>

            {/* Progress Bar */}
            <div 
              className="w-full bg-gray-200 rounded-full h-2 mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-100"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
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
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
            <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" 
                style={{ fontFamily: 'Dancing Script, cursive' }}>
              Happy 21st Birthday, My Dear One
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Today marks a special milestone in your life - your 21st birthday! This is not just another year added to your life, but the beginning of an exciting new chapter filled with endless possibilities and adventures.
              </p>
              <p>
                As you step into this new phase of adulthood, may you embrace every moment with joy, courage, and wonder. Your journey has been beautiful so far, and I can't wait to see all the amazing things you'll accomplish in the years ahead.
              </p>
              <p>
                Remember that you are loved, cherished, and supported every step of the way. Here's to celebrating you today and always - may this year bring you happiness, success, and all your heart desires!
              </p>
              <p className="text-center font-semibold text-purple-600 mt-6">
                With all my love and best wishes! 💕
              </p>
            </div>
          </Card>
        </div>

        {/* Center - Main Content */}
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center cursor-none"
        >
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">
              Hover Your Mouse
            </h1>
            <p className="text-xl text-gray-600 mt-4">
              Move your cursor around to create magical effects!
            </p>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-1/2 w-32 h-32 bg-pink-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-25 animate-pulse"></div>
    </section>
  );
};