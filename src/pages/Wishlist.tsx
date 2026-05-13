import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState } from 'react';
import { productsApi } from '@/services/api';

import ProductCard from '@/components/ProductCard';


const Wishlist = () => {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<any[]>([]);
   useEffect(() => {
    productsApi.getApproved()
.then(res => {
      setProducts(res.data);
    });
  }, []);
 
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishedProducts.length === 0) {
    return (
      <main className="pt-32 luxury-container text-center min-h-screen">
        <h1 className="luxury-heading mb-6">Your Wishlist</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">You haven't saved any items yet.</p>
        <Link to="/shop" className="luxury-underline font-body text-xs uppercase tracking-[0.15em] pb-0.5">Explore Collection</Link>
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <div className="luxury-container">
        <div className="text-center py-12 md:py-16">
          <h1 className="luxury-heading">Wishlist</h1>
          <p className="font-body text-xs text-muted-foreground mt-4">{wishedProducts.length} saved items</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {wishedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="py-20" />
      </div>
    </main>
  );
};

export default Wishlist;
