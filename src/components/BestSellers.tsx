import ProductCard from './ProductCard';

const BestSellers = ({
  products = [],
  title = "Best Sellers",
  subtitle = "Most Loved"
}: {
  products: any[],
  title?: string,
  subtitle?: string
}) => {
  
 

  return (
    <section className="luxury-section bg-background">
      <div className="luxury-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="luxury-subheading mb-4">{subtitle}</p>
<h2 className="luxury-heading">{title}</h2>
          </div>
          <a href="/shop" className="luxury-underline font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mt-4 md:mt-0 pb-0.5">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
