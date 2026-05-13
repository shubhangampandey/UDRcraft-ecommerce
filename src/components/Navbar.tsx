import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut, Store, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { searchApi } from '@/services/api';
import { Product } from '@/data/products';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();
  const { cartCount, wishlist } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchApi.search(searchQuery);
        setSearchResults(results.data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navBg = scrolled || !isHome || mobileOpen
    ? 'bg-background/95 backdrop-blur-md border-b border-border'
    : 'bg-transparent';

  const textColor = scrolled || !isHome ? 'text-foreground' : 'text-primary-foreground';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="luxury-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden ${textColor} luxury-hover`}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/" className={`font-display text-2xl md:text-3xl font-light tracking-[0.15em] ${textColor} luxury-hover`}>
              UDRcraft
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className={`luxury-underline font-body text-xs uppercase tracking-[0.15em] ${textColor} luxury-hover pb-0.5`}>
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'vendor' && (
                <Link to="/vendor" className={`luxury-underline font-body text-xs uppercase tracking-[0.15em] ${textColor} luxury-hover pb-0.5 flex items-center gap-1`}>
                  <Store size={12} /> Dashboard
                </Link>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className={`luxury-underline font-body text-xs uppercase tracking-[0.15em] ${textColor} luxury-hover pb-0.5 flex items-center gap-1`}>
                  <Shield size={12} /> Admin
                </Link>
              )}
            </nav>

            <div className={`flex items-center gap-4 md:gap-5 ${textColor}`}>
              <button onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(''); setSearchResults([]); }} className="luxury-hover hover:opacity-60">
                <Search size={18} />
              </button>
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/account" className="luxury-hover hover:opacity-60 flex items-center gap-1.5">
                    <User size={18} />
                    <span className="font-body text-xs uppercase tracking-wider">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="luxury-hover hover:opacity-60">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block luxury-hover hover:opacity-60">
                  <User size={18} />
                </Link>
              )}
              <Link to="/wishlist" className="luxury-hover hover:opacity-60 relative">
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background text-[9px] flex items-center justify-center rounded-full font-body">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="luxury-hover hover:opacity-60 relative">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background text-[9px] flex items-center justify-center rounded-full font-body">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border bg-background animate-slide-down">
            <div className="luxury-container py-4">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for products, collections, brands..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent font-body text-sm outline-none placeholder:text-muted-foreground"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }} className="text-muted-foreground hover:text-foreground luxury-hover">
                  <X size={16} />
                </button>
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="mt-4 border-t border-border pt-4 max-h-80 overflow-y-auto">
                  {searchLoading ? (
                    <p className="font-body text-xs text-muted-foreground animate-pulse">Searching...</p>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3">
                      {searchResults.map(product => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                          className="flex items-center gap-4 p-2 hover:bg-secondary transition-colors"
                        >
                          <img
  src={product.image || "https://placehold.co/100x100?text=No+Image"}
  alt={product.name}
  className="w-12 h-12 object-cover bg-secondary"
/>

                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm truncate">{product.name}</p>
                            <p className="font-body text-xs text-muted-foreground">{product.category} · {product.vendor}</p>
                          </div>
                          <span className="font-body text-sm">${product.price.toLocaleString()}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-xs text-muted-foreground">No products found for "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-20 animate-fade-in">
          <nav className="luxury-container flex flex-col gap-6 py-8">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className="font-display text-3xl font-light tracking-wide text-foreground luxury-hover">
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'vendor' && (
              <Link to="/vendor" className="font-display text-3xl font-light tracking-wide text-foreground luxury-hover">Dashboard</Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="font-display text-3xl font-light tracking-wide text-foreground luxury-hover">Admin</Link>
            )}
            <div className="border-t border-border pt-6 mt-4 flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="font-body text-sm uppercase tracking-[0.15em] text-muted-foreground">Account ({user?.name})</Link>
                  <Link to="/order-tracking" className="font-body text-sm uppercase tracking-[0.15em] text-muted-foreground">Order Tracking</Link>
                  <button onClick={handleLogout} className="font-body text-sm uppercase tracking-[0.15em] text-muted-foreground text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-body text-sm uppercase tracking-[0.15em] text-muted-foreground">Sign In</Link>
                  <Link to="/register" className="font-body text-sm uppercase tracking-[0.15em] text-muted-foreground">Create Account</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
