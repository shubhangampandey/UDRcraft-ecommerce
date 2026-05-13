import { useEffect, useState } from 'react';
import { productsApi } from '@/services/api';

import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import BestSellers from '@/components/BestSellers';
import DealsSection from '@/components/DealsSection';
import NewArrivals from '@/components/NewArrivals';
import Testimonials from '@/components/Testimonials';
import BrandStory from '@/components/BrandStory';
import Newsletter from '@/components/Newsletter';
import InstagramSection from '@/components/InstagramSection';

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    productsApi.getApproved()
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const deals = products.filter(p => (p.discount || 0) > 0);

  const bestSellers = products.filter(p => p.isBestSeller === true);

  const newArrivals = products.filter(p => {
    const days = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  });

  const featuredProducts = products.slice(0, 8);

  return (
    <main>
      <Hero />
      
      <CategorySection />
      <BestSellers 
  products={featuredProducts} 
  title="Featured Products" 
  subtitle="Trending Now" 
/>
      <BestSellers products={bestSellers} />
      <DealsSection products={deals} />
      <NewArrivals products={newArrivals} />
      
      <BrandStory />
      <Testimonials />
      <Newsletter />
      <InstagramSection />
    </main>
  );
};

export default Index;