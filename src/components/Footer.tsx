import { Link } from 'react-router-dom';

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Best Sellers', href: '/shop?filter=bestseller' },
    { label: 'All Products', href: '/shop' },
    { label: 'Sale', href: '/shop?filter=sale' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Order Tracking', href: '/order-tracking' },
    { label: 'Shipping & Returns', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Size Guide', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="luxury-container py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-2xl tracking-[0.15em] font-light">UDRcraft</Link>
            <p className="font-body text-xs text-background/50 mt-4 leading-relaxed max-w-xs">
              Curated luxury furniture and décor for the modern home. Crafted with purpose, designed to last.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-body text-xs uppercase tracking-[0.15em] text-background/70 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="font-body text-xs text-background/50 hover:text-background luxury-hover">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[10px] text-background/30 uppercase tracking-[0.1em]">
            © 2026 UDRcraft. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Instagram', 'Pinterest', 'LinkedIn'].map(social => (
              <a key={social} href="#" className="font-body text-[10px] text-background/40 hover:text-background/70 uppercase tracking-[0.1em] luxury-hover">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
