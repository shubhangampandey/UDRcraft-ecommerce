import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-living.jpg';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury modern living room with designer furniture"
          className="w-full h-full object-cover animate-image-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-primary-foreground luxury-container">
        <p className="luxury-subheading mb-6 text-primary-foreground/70 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Curated Luxury Living
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          Timeless Design
        </h1>
        <p className="font-body text-sm md:text-base font-light max-w-lg mx-auto mb-10 text-primary-foreground/80 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          Discover handcrafted furniture and décor from the world's finest artisans. 
          Where every piece tells a story.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] luxury-hover hover:bg-primary-foreground/90"
          >
            Shop Now
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] luxury-hover hover:bg-primary-foreground/10"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/50 animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <div className="w-px h-12 bg-primary-foreground/30 mx-auto mb-2" />
        <p className="font-body text-[10px] uppercase tracking-[0.3em]">Scroll</p>
      </div>
    </section>
  );
};

export default Hero;
