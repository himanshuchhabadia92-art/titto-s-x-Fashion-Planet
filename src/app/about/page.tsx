import Image from "next/image";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Our Philosophy</h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Titto's X Fashion Planet was born from a desire to strip away the noise and focus on what truly matters: quality, silhouette, and the timeless elegance of monochrome.
          </p>
          <p className="text-gray-600 font-light leading-relaxed">
            We believe that a restricted color palette isn't a limitation; it's a canvas for expression. By focusing exclusively on black and white, we elevate the importance of texture, drape, and tailoring.
          </p>
          <p className="text-gray-600 font-light leading-relaxed">
            Every piece in our collection is thoughtfully designed to be an enduring staple in your wardrobe, effortlessly transitioning from day to night, season to season.
          </p>
          <div className="pt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2">The Founders</h3>
            <p className="text-gray-500 font-serif italic">Titto & Team</p>
          </div>
        </div>
        
        <div className="order-1 md:order-2 relative aspect-[4/5] bg-gray-100">
           {/* Placeholder for brand image */}
           <div className="absolute inset-0 bg-gray-200" />
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1964&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-80" />
        </div>
      </div>
    </div>
  );
}
