import { Link } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="pt-32 luxury-container text-center min-h-screen">
        <h1 className="luxury-heading mb-6">Your Cart is Empty</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">Discover our curated collection of luxury pieces.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] luxury-hover hover:bg-foreground/90">
          Continue Shopping <ArrowRight size={14} />
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <div className="luxury-container">
        <div className="text-center py-12 md:py-16">
          <h1 className="luxury-heading">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-border pb-4 mb-0">
              {['Product', 'Price', 'Quantity', 'Total', ''].map(h => (
                <span key={h} className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{h}</span>
              ))}
            </div>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="grid grid-cols-[80px_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center border-b border-border py-6">
                <div className="flex items-center gap-4 col-span-1 md:col-span-1">
                  <div className="w-20 h-24 bg-secondary shrink-0 md:mr-0">
                    <img src={product.image || "https://placehold.co/600x600?text=No+Image"} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:block">
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{product.vendor}</p>
                    <Link to={`/product/${product.id}`} className="font-display text-lg font-light">{product.name}</Link>
                  </div>
                </div>
                <div className="md:hidden">
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{product.vendor}</p>
                  <Link to={`/product/${product.id}`} className="font-display text-base font-light">{product.name}</Link>
                  <p className="font-body text-sm mt-1">${product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 border border-border"><Minus size={12} /></button>
                    <span className="font-body text-sm w-8 text-center">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 border border-border"><Plus size={12} /></button>
                  </div>
                </div>
                <span className="hidden md:block font-body text-sm">${product.price.toLocaleString()}</span>
                <div className="hidden md:flex items-center border border-border w-fit">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-2 hover:bg-secondary luxury-hover"><Minus size={12} /></button>
                  <span className="w-10 text-center font-body text-sm">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-2 hover:bg-secondary luxury-hover"><Plus size={12} /></button>
                </div>
                <span className="hidden md:block font-body text-sm">${(product.price * quantity).toLocaleString()}</span>
                <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-foreground luxury-hover justify-self-end md:justify-self-auto">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-secondary p-8">
              <h3 className="font-display text-2xl font-light mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{cartTotal > 500 ? 'Free' : '$50'}</span>
                </div>
              </div>
              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between font-display text-xl">
                  <span>Total</span>
                  <span>${(cartTotal + (cartTotal > 500 ? 0 : 50)).toLocaleString()}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-foreground text-background py-3.5 font-body text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 luxury-hover hover:bg-foreground/90"
              >
                Checkout <ArrowRight size={14} />
              </Link>
              <Link to="/shop" className="block text-center mt-4 font-body text-xs text-muted-foreground hover:text-foreground luxury-hover uppercase tracking-[0.1em]">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="py-20" />
      </div>
    </main>
  );
};

export default Cart;
