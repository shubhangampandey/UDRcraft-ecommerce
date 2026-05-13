import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';


const DealsSection = ({ products = [] }: { products: any[] }) => {
 
  const deals = products.slice(0, 3);

  // Countdown timer - set to 24 hours from now
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="luxury-section bg-secondary">
      <div className="luxury-container">
        <div className="text-center mb-16">
          <p className="luxury-subheading mb-4">Limited Time</p>
          <h2 className="luxury-heading mb-8">Today's Offers</h2>

          {/* Countdown */}
          <div className="flex justify-center gap-4 md:gap-8">
            {[
              { label: 'Hours', value: pad(timeLeft.hours) },
              { label: 'Minutes', value: pad(timeLeft.minutes) },
              { label: 'Seconds', value: pad(timeLeft.seconds) },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-light text-foreground mb-1">{item.value}</div>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {deals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
