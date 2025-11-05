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
    const containerRef = useRef<HTMLDivElement>(null);                                           

    useEffect(() => {                                                                            
      const tl = gsap.timeline();                                                                

      // Initial animations                                                                      
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

      // Self-contained horizontal scroll effect without pinning                                
      ScrollTrigger.create({                                                                     
        trigger: containerRef.current,                                                           
        start: "top center",                                                                        
        end: "bottom center", // Use the natural height of the section                                         
        scrub: 1,                                                                                
        onUpdate: (self) => {                                                                    
          const progress = self.progress;                                                        

          // Move intro content to the left as user scrolls                                      
          gsap.to(introRef.current, {                                                            
            x: -progress * 50 + "%", // Move left by 50% of container width                      
            duration: 0.1,                                                                       
            ease: "none"                                                                         
          });                                                                                    

          // Fade in and reveal the image container from the right                               
          gsap.to(imageContainerRef.current, {                                                   
            x: (1 - progress) * 100 + "%", // Start from right (100%) and move to 0%             
            opacity: progress,                                                                   
            duration: 0.1,                                                                       
            ease: "none"                                                                         
          });                                                                                    
        }                                                                                        
      });                                                                                        
                                                                                                 
      return () => {
        // Only kill ScrollTriggers that belong to this component
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === containerRef.current) {
            trigger.kill();
          }
        });
      };                                                                                         
    }, []);                                                                                      
                                                                                                 
    return (                                                                                     
      <section ref={containerRef} className="h-screen relative overflow-hidden bg-transparent z-10">                 
        {/* Hero intro content */}                                                               
        <div                                                                                     
          ref={heroRef}                                                                          
          className="absolute inset-0 flex items-center justify-center px-4"                     
        >                                                                                        
          <div ref={introRef} className="relative z-10 text-center max-w-4xl mx-auto">           
            <div className="mb-8 flex justify-center gap-8">                                     
              <Sparkles className="sparkle w-12 h-12 text-primary" />                            
              <div ref={cakeRef}>                                                                
                <Cake className="w-24 h-24 text-secondary" fill="currentColor" />                
              </div>                                                                             
              <Sparkles className="sparkle w-12 h-12 text-accent" />                             
            </div>                                                                               
                                                                                                 
            <h1                                                                                  
              ref={titleRef}                                                                     
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-celebration             
  bg-clip-text text-transparent"                                                                 
            >                                                                                    
            Happy Birthday Frenstein! 🎉                                                              
            </h1>                                                                                
                                                                                                 
            <p                                                                                   
              ref={subtitleRef}                                                                  
              className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto                
  leading-relaxed"                                                                               
            >                                                                                    
              Today is your special day, and we're here to celebrate the amazing person you      
  are!                                                                                           
            </p>                                                                                 
                                                                                                 
            <div className="mt-12 inline-block">                                                 
              <div className="animate-bounce text-4xl">👇</div>                                  
              <p className="text-sm text-muted-foreground mt-2">Scroll to see more</p>           
            </div>                                                                               
          </div>                                                                                 
        </div>                                                                                   
                                                                                                 
        {/* Image container that appears from the right */}                                      
        <div                                                                                     
          ref={imageContainerRef}                                                                
          className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center        
  opacity-0 translate-x-full"                                                                    
          style={{ transform: 'translateX(100%)' }}                                              
        >                                                                                        
          <div className="w-full h-full flex items-center justify-center">                                                               
            <div className="text-center text-white/70">                                          
              <p className="text-lg">Image will be placed here</p>                               
              <p className="text-sm mt-2">Ready for your image content</p>                       
            </div>                                                                               
          </div>                                                                                 
        </div>                                                                                   
      </section>                                                                                 
    );                                                                                           
  };     