import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-living.jpg';

const BrandStory = () => {
  return (
    <section className="luxury-section bg-background">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="luxury-image-hover aspect-[4/5] bg-secondary">
            <img src={heroImage} alt=" UDRcraft brand story" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-lg">
            <p className="luxury-subheading mb-4">Our Story</p>
            <h2 className="luxury-heading mb-8">Crafted with Purpose</h2>
            <p className="font-body text-sm leading-relaxed text-muted-foreground mb-6">
              Founded in 2018, UDRcraft was born from a simple belief: your home should reflect your highest aspirations. 
              We partner with master artisans and independent designers from around the world to bring you furniture 
              and décor that stands the test of time.
            </p>
            <p className="font-body text-sm leading-relaxed text-muted-foreground mb-8">
              Every piece in our collection is selected for its craftsmanship, sustainability, and timeless design. 
              We believe in fewer, better things.
            </p>
            <Link
              to="/about"
              className="luxury-underline font-body text-xs uppercase tracking-[0.15em] text-foreground pb-0.5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
