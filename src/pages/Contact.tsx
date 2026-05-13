import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="pt-32 luxury-container text-center min-h-screen">
        <h1 className="luxury-heading mb-6">Message Sent</h1>
        <p className="font-body text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <div className="luxury-container max-w-4xl mx-auto">
        <div className="text-center py-12 md:py-16">
          <p className="luxury-subheading mb-4">Get in Touch</p>
          <h1 className="luxury-heading">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First name" required className="border border-border px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-foreground transition-colors" />
                <input placeholder="Last name" required className="border border-border px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-foreground transition-colors" />
              </div>
              <input placeholder="Email address" type="email" required className="w-full border border-border px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-foreground transition-colors" />
              <select className="w-full border border-border px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-foreground transition-colors text-muted-foreground">
                <option>General Inquiry</option>
                <option>Order Support</option>
                <option>Returns</option>
                <option>Trade Program</option>
              </select>
              <textarea placeholder="Your message" rows={5} required className="w-full border border-border px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-foreground transition-colors resize-none" />
              <button type="submit" className="w-full bg-foreground text-background py-3.5 font-body text-xs uppercase tracking-[0.2em] luxury-hover hover:bg-foreground/90">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            {[
              { icon: Mail, label: 'Email', value: 'hello@maison.com' },
              { icon: Phone, label: 'Phone', value: '+1 (800) 555-0199' },
              { icon: MapPin, label: 'Showroom', value: '123 Design District\nNew York, NY 10001' },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <item.icon size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-body text-sm whitespace-pre-line">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-8">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Hours</p>
              <p className="font-body text-sm">Mon – Fri: 9am – 6pm EST</p>
              <p className="font-body text-sm text-muted-foreground">Sat – Sun: By Appointment</p>
            </div>
          </div>
        </div>

        <div className="py-20" />
      </div>
    </main>
  );
};

export default Contact;
