import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { productsApi } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
 const [product, setProduct] = useState<any>(null);
 const [related, setRelated] = useState<any[]>([]);
 const [quantity, setQuantity] = useState(1);

useEffect(() => {
  if (!id) return;

  productsApi.getById(id).then(res => {
    setProduct(res.data);
  });

  // fetch all for related
  productsApi.getApproved().then(res => {
  const rel = res.data.filter((p: any) =>
    p.category === product?.category && p.id !== id
  ).slice(0, 4);

  setRelated(rel);
});


}, [id, product?.category]);

  const { addToCart, toggleWishlist, wishlist } = useCart();
  

  if (!product) {
    return (
      <main className="pt-32 luxury-container text-center">
        <h1 className="luxury-heading mb-4">Product Not Found</h1>
        <Link to="/shop" className="luxury-underline font-body text-xs uppercase tracking-[0.15em] pb-0.5">Back to Shop</Link>
      </main>
    );
  }

  const isWished = wishlist.includes(product.id);
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="pt-20 md:pt-24">
      <div className="luxury-container">
        {/* Breadcrumb */}
        <div className="py-6">
          <Link to="/shop" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground luxury-hover">
            <ArrowLeft size={12} />
            Back to Shop
          </Link>
        </div>

        {/* Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="aspect-[3/4] bg-secondary luxury-image-hover">
            <img src={product.image || "https://placehold.co/600x600?text=No+Image"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center max-w-lg">
            <p className="luxury-subheading mb-2">{product.vendor}</p>
            <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-foreground' : 'text-border'}`}>★</span>
                ))}
              </div>
              <span className="font-body text-xs text-muted-foreground">{product.reviews} reviews</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="font-display text-3xl font-light">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="font-body text-lg text-muted-foreground line-through">${product.originalPrice.toLocaleString()}</span>
                  <span className="font-body text-xs bg-destructive text-destructive-foreground px-2 py-0.5 uppercase tracking-wider">-{discount}%</span>
                </>
              )}
            </div>

            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-xs uppercase tracking-[0.15em]">Quantity</span>
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-secondary luxury-hover">
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-body text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-secondary luxury-hover">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                className="flex-1 bg-foreground text-background py-3.5 font-body text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 luxury-hover hover:bg-foreground/90"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`border border-border p-3.5 luxury-hover ${isWished ? 'bg-foreground text-background' : 'hover:bg-secondary'}`}
              >
                <Heart size={16} fill={isWished ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Details list */}
            <div className="border-t border-border pt-6 space-y-3">
              {[
                ['Material', 'Premium Italian materials'],
                ['Dimensions', 'Contact us for details'],
                ['Shipping', 'Free shipping on orders over $500'],
                ['Returns', '30-day hassle-free returns'],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-body text-xs uppercase tracking-[0.1em] text-muted-foreground">{key}</span>
                  <span className="font-body text-xs text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="luxury-section">
            <h2 className="luxury-heading text-center mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
