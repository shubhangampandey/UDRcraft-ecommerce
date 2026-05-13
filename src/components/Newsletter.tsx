import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="luxury-section bg-secondary">
      <div className="luxury-container text-center max-w-2xl mx-auto">
        <p className="luxury-subheading mb-4">Stay Connected</p>
        <h2 className="luxury-heading mb-6">Join the UDRcraft Circle</h2>
        <p className="font-body text-sm text-muted-foreground mb-10">
          Be the first to discover new collections, exclusive offers, and design inspiration.
        </p>

        {submitted ? (
          <p className="font-body text-sm text-foreground">Thank you for subscribing. Welcome to UDRcraft.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-background border border-border px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="bg-foreground text-background px-6 py-3 font-body text-xs uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2 luxury-hover hover:bg-foreground/90"
            >
              Subscribe
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
