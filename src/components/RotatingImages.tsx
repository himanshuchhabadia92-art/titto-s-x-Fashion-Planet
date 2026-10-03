"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images1 = [
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1489987707023-afc232d7ab38?q=80&w=600&auto=format&fit=crop"
];

const images2 = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop"
];

const images3 = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550614000-4b95d466f2fb?q=80&w=600&auto=format&fit=crop"
];

export default function RotatingImages() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3);
    }, 3000); // Rotate every 3 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full md:w-1/2 relative h-[300px] md:h-auto min-h-[300px] md:min-h-[400px] bg-[#e8e7e3] overflow-hidden flex items-center justify-center gap-2 md:gap-4 p-4 md:p-8">
      {/* Box 1 */}
      <div className="relative w-1/3 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl animate-float mt-8">
        {images1.map((src, i) => (
          <Image 
            key={src}
            src={src} 
            alt="Streetwear model" 
            fill 
            className={`object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`} 
          />
        ))}
      </div>

      {/* Box 2 */}
      <div className="relative w-1/3 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl animate-float-delayed -mt-12 z-10 border-4 border-[#f3f2ef]">
        {images2.map((src, i) => (
          <Image 
            key={src}
            src={src} 
            alt="Streetwear model" 
            fill 
            className={`object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`} 
          />
        ))}
      </div>

      {/* Box 3 */}
      <div className="relative w-1/3 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl animate-float mt-8">
        {images3.map((src, i) => (
          <Image 
            key={src}
            src={src} 
            alt="Streetwear model" 
            fill 
            className={`object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`} 
          />
        ))}
      </div>
    </div>
  );
}
