import catBedroom from '@/assets/cat-bedroom.jpg';
import catSeating from '@/assets/cat-seating.jpg';
import catDining from '@/assets/cat-dining.jpg';
import catLighting from '@/assets/cat-lighting.jpg';
import productSofa from '@/assets/product-sofa.jpg';
import productVase from '@/assets/product-vase.jpg';

const images = [catBedroom, catSeating, catDining, catLighting, productSofa, productVase];

const InstagramSection = () => {
  return (
    <section className="luxury-section bg-background">
      <div className="luxury-container text-center mb-12">
        <p className="luxury-subheading mb-4">@UDRcraft</p>
        <h2 className="luxury-heading">Get Inspired</h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {images.map((img, i) => (
          <div key={i} className="luxury-image-hover aspect-square bg-secondary cursor-pointer">
            <img src={img} alt={`UDRcraft inspiration ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;
