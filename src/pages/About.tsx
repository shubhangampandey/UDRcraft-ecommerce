import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-living.jpg';

const About = () => {
  return (
    <main className="pt-20 md:pt-24">
      <div className="luxury-container">
        <div className="text-center py-12 md:py-20">
          <p className="luxury-subheading mb-4">Our Philosophy</p>
          <h1 className="luxury-heading max-w-3xl mx-auto">Fewer, Better Things</h1>
        </div>

        <div className="aspect-[21/9] mb-20 luxury-image-hover bg-secondary">
          <img src={heroImage} alt="UDRcraft showroom" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-2xl mx-auto space-y-8 mb-20">
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            UDRcraft was founded in 2018 with a singular vision: to make exceptional design accessible. 
            We believe your home should be a sanctuary — a place where every object has been chosen with intention.
          </p>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            We work directly with master artisans and emerging designers across Europe, Japan, and Scandinavia. 
            Every piece in our collection is rigorously vetted for quality, sustainability, and timeless appeal.
          </p>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            Our multi-vendor marketplace brings together the world's finest makers under one roof, 
            giving you direct access to pieces that were once available only through trade channels.
          </p>

          <div className="grid grid-cols-3 gap-8 py-12 border-t border-b border-border">
            {[
              { number: '150+', label: 'Artisan Partners' },
              { number: '12', label: 'Countries' },
              { number: '50K+', label: 'Happy Homes' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-light mb-1">{stat.number}</p>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pb-20">
          <Link to="/shop" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] luxury-hover hover:bg-foreground/90">
            Explore Collection
          </Link>
        </div>
      </div>
    </main>
  );
};

export default About;
