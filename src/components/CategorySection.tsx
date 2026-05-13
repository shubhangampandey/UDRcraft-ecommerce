import { Link } from 'react-router-dom';
import catBedroom from '@/assets/cat-bedroom.jpg';
import catSeating from '@/assets/cat-seating.jpg';
import catDining from '@/assets/cat-dining.jpg';
import catLighting from '@/assets/cat-lighting.jpg';

const categoriesData = [
  { name: 'Seating', image: catSeating, slug: 'seating' },
  { name: 'Bedroom', image: catBedroom, slug: 'bedroom' },
  { name: 'Dining', image: catDining, slug: 'dining' },
  { name: 'Lighting', image: catLighting, slug: 'lighting' },
];

const CategorySection = () => {
  return (
    <section className="luxury-section bg-background">
      <div className="luxury-container">
        <div className="text-center mb-16">
          <p className="luxury-subheading mb-4">Browse by</p>
          <h2 className="luxury-heading">Collections</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group luxury-image-hover relative aspect-[3/4] bg-secondary"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl md:text-3xl text-primary-foreground font-light">{cat.name}</h3>
                <p className="font-body text-xs uppercase tracking-[0.15em] text-primary-foreground/60 mt-1 group-hover:text-primary-foreground/90 luxury-hover">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
