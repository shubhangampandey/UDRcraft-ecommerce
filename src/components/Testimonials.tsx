const testimonials = [
  {
    name: 'Alexandra M.',
    role: 'Interior Designer',
    quote: 'The quality of every piece I\'ve ordered has exceeded my expectations. UDRcraft has become my go-to for client projects.',
    rating: 5,
  },
  {
    name: 'James W.',
    role: 'Architect',
    quote: 'Impeccable craftsmanship and attention to detail. The Mond sofa is the centerpiece of my living room.',
    rating: 5,
  },
  {
    name: 'Sophie L.',
    role: 'Homeowner',
    quote: 'From ordering to delivery, the experience was flawless. Every item feels like a work of art.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="luxury-section bg-foreground text-background">
      <div className="luxury-container">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-background/50 mb-4">What They Say</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">Client Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-sm text-background/60">★</span>
                ))}
              </div>
              <blockquote className="font-display text-xl md:text-2xl font-light italic leading-relaxed mb-6 text-background/90">
                "{t.quote}"
              </blockquote>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-background/70">{t.name}</p>
              <p className="font-body text-[10px] uppercase tracking-[0.15em] text-background/40 mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
