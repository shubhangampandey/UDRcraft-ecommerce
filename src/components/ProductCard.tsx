import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWished = wishlist.includes(product.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = product.discount || 0;

  return (
    <div className="group relative">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block luxury-image-hover relative aspect-[3/4] bg-secondary mb-4">
        <img
          src={product.image || "https://placehold.co/600x600?text=No+Image"}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-foreground text-background font-body text-[10px] uppercase tracking-[0.15em] px-3 py-1.5">
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-body text-[10px] uppercase tracking-[0.1em] px-2 py-1">
            -{discount}%
          </span>
        )}

        {/* Hover actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="bg-foreground text-background p-2.5 luxury-hover hover:bg-foreground/80"
            title="Add to cart"
          >
            <ShoppingBag size={14} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className={`p-2.5 luxury-hover ${isWished ? 'bg-foreground text-background' : 'bg-background text-foreground hover:bg-foreground hover:text-background'}`}
            title="Add to wishlist"
          >
            <Heart size={14} fill={isWished ? 'currentColor' : 'none'} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="bg-background text-foreground p-2.5 luxury-hover hover:bg-foreground hover:text-background"
              title="Quick view"
            >
              <Eye size={14} />
            </button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">{product.vendor}</p>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-display text-lg md:text-xl font-light text-foreground luxury-hover hover:opacity-70">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-2 mt-1.5">
  {/* Final Price */}
  <span className="font-body text-sm text-foreground">
    $
    {discount > 0
      ? (product.price - (product.price * discount) / 100).toLocaleString()
      : product.price.toLocaleString()}
  </span>

  {/* Original Price */}
  {discount > 0 && (
    <span className="font-body text-sm text-muted-foreground line-through">
      ${product.price.toLocaleString()}
    </span>
  )}

  {/* Discount text */}
  {discount > 0 && (
    <span className="text-xs text-red-500">
      {discount}% OFF
    </span>
  )}
</div>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-foreground' : 'text-border'}`}>★</span>
          ))}
          <span className="font-body text-[10px] text-muted-foreground ml-1">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
