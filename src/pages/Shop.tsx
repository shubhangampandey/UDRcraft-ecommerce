import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useEffect } from 'react';
import { productsApi } from '@/services/api';


const priceRanges = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 – $1,000', min: 500, max: 1000 },
  { label: '$1,000 – $3,000', min: 1000, max: 3000 },
  { label: 'Over $3,000', min: 3000, max: Infinity },
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
];

const categories = [
  { name: 'Seating', slug: 'seating' },
  { name: 'Tables', slug: 'tables' },
  { name: 'Lighting', slug: 'lighting' },
  { name: 'Storage', slug: 'storage' },
  { name: 'Decor', slug: 'decor' },
  { name: 'Bedroom', slug: 'bedroom' },
];

const Shop = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);


  const [products, setProducts] = useState<any[]>([]);
const vendors = useMemo(
  () => Array.from(new Set(products.map(p => p.vendor).filter(Boolean))),
  [products]
);
 useEffect(() => {
  setLoading(true);

  const timer = setTimeout(() => {
    console.log("Backend is slow...");
  }, 5000);

  productsApi.getApproved()
    .then(res => {
      setProducts(res.data);
    })
    .catch(() => {
      setProducts([]);
    })
    .finally(() => {
      clearTimeout(timer);
      setLoading(false);
    });
}, []);



  const filtered = useMemo(() => {
    let result = products ? [...products] : [];
    if (selectedCategory) result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    if (selectedVendor)
  result = result.filter(
    p => p.vendor?.toLowerCase() === selectedVendor.toLowerCase()
  );

    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0)); break;
    }
    return result;
  }, [products, selectedCategory, selectedVendor, selectedPrice, sortBy]);


  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedVendor(null);
    setSelectedPrice(null);
  };

  const hasFilters = selectedCategory || selectedVendor || selectedPrice !== null;
  if (loading) {
  return <div className="text-center pt-40">Loading products...</div>;
}


  return (
    <main className="pt-20 md:pt-24">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center py-12 md:py-20">
          <p className="luxury-subheading mb-4">Curated Collection</p>
          <h1 className="luxury-heading">Shop All</h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground luxury-hover"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <p className="font-body text-xs text-muted-foreground">{filtered.length} products</p>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="font-body text-xs uppercase tracking-[0.1em] bg-transparent outline-none text-muted-foreground cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="text-muted-foreground" />
          </div>
        </div>

        <div className="flex gap-12">
          {/* Filters sidebar */}
          {filtersOpen && (
            <aside className="w-56 shrink-0 hidden md:block animate-fade-in">
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground mb-6 luxury-hover">
                  <X size={12} /> Clear all
                </button>
              )}

              <div className="mb-8">
                <h4 className="font-body text-xs uppercase tracking-[0.15em] mb-4">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                      className={`block font-body text-sm luxury-hover ${selectedCategory === cat.slug ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-body text-xs uppercase tracking-[0.15em] mb-4">Price</h4>
                <div className="space-y-2">
                  {priceRanges.map((range, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                      className={`block font-body text-sm luxury-hover ${selectedPrice === i ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-body text-xs uppercase tracking-[0.15em] mb-4">Brand</h4>
                <div className="space-y-2">
                  {vendors.map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVendor(selectedVendor === v ? null : v)}
                      className={`block font-body text-sm luxury-hover ${selectedVendor === v ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Product grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="font-body text-sm text-muted-foreground">No products match your filters.</p>
                <button onClick={clearFilters} className="luxury-underline font-body text-xs uppercase tracking-[0.15em] mt-4 pb-0.5">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="py-20" />
      </div>
    </main>
  );
};

export default Shop;
