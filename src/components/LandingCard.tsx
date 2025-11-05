import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import giigGif from '@/assets/giig.gif';

interface LandingCardProps {
  onOpen: () => void;
}

export const LandingCard = ({ onOpen }: LandingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [shake, setShake] = useState(false);
  const correctPin = '2306'; // You can change this to any 4-digit code

  const handlePinInput = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Check if PIN is complete and correct
    if (newPin.every(digit => digit !== '') && newPin.join('') === correctPin) {
      setTimeout(() => {
        gsap.to(cardRef.current, {
          scale: 0,
          rotation: 360,
          opacity: 0,
          duration: 0.8,
          ease: 'back.in',
          onComplete: onOpen,
        });
      }, 300);
    } else if (newPin.every(digit => digit !== '')) {
      // Wrong PIN - shake animation
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin(['', '', '', '']);
        document.getElementById('pin-0')?.focus();
      }, 500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      <Card
        ref={cardRef}
        className={`relative z-10 bg-white/90 backdrop-blur-md shadow-2xl overflow-hidden max-w-4xl w-full mx-4 ${
          shake ? 'animate-shake' : ''
        }`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Picture Area */}
          <div className="md:w-1/2 bg-gradient-to-br from-pink-300 to-rose-300 p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-90 h-90 items-center justify-center mb-4 mx-auto">
                <img src={giigGif} alt="Animated GIF" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Right side - Vault Lock */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-pink-50 to-white">
            <div className="text-center space-y-6">
              {/* Lock Icon */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-pink-400 to-rose-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800">
                Enter PIN to Unlock
              </h2>
              <p className="text-pink-600 text-sm">Your special message awaits...</p>

              {/* PIN Input */}
              <div className="flex gap-3 justify-center mt-8">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all bg-white"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        const emptyIndex = pin.findIndex(d => d === '');
                        if (emptyIndex !== -1) handlePinInput(emptyIndex, num.toString());
                      }}
                      className="w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-lg font-semibold text-pink-700 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  {[4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        const emptyIndex = pin.findIndex(d => d === '');
                        if (emptyIndex !== -1) handlePinInput(emptyIndex, num.toString());
                      }}
                      className="w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-lg font-semibold text-pink-700 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  {[7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        const emptyIndex = pin.findIndex(d => d === '');
                        if (emptyIndex !== -1) handlePinInput(emptyIndex, num.toString());
                      }}
                      className="w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-lg font-semibold text-pink-700 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setPin(['', '', '', ''])}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors text-xs"
                  >
                    CLR
                  </button>
                  <button
                    onClick={() => {
                      const emptyIndex = pin.findIndex(d => d === '');
                      if (emptyIndex !== -1) handlePinInput(emptyIndex, '0');
                    }}
                    className="w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-lg font-semibold text-pink-700 transition-colors"
                  >
                    0
                  </button>
                  <button
                    onClick={() => {
                      const lastFilledIndex = pin.map((d, i) => d ? i : -1).filter(i => i !== -1).pop();
                      if (lastFilledIndex !== undefined) {
                        const newPin = [...pin];
                        newPin[lastFilledIndex] = '';
                        setPin(newPin);
                      }
                    }}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors text-xs"
                  >
                    ←
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
};