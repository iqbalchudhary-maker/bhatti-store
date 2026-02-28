"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Hero slider images array
const sliderImages = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop"
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Image Slider Logic (Har 3 seconds baad image change hogi)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 2. Neon Database se products fetch karna (Real-time)
  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        // Timestamp (?t=...) add karne se cache ka masla nahi hota
        const res = await fetch(`/api/products?t=${new Date().getTime()}`, { 
          cache: 'no-store' 
        });
        
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Database fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100">
      <Navbar />

      {/* --- PREMIUM HERO SECTION --- */}
      <header className="relative pt-20 pb-12 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-6 animate-bounce">
            New Collection 2026 🚀
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            LEVEL UP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 italic">LIFESTYLE.</span>
          </h1>

          {/* Animated Hero Slider */}
          <div className="relative w-full max-w-4xl h-[350px] md:h-[500px] mt-4 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white transition-all duration-500">
            {sliderImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
                }`}
              >
                <img src={img} alt="Premium Featured Item" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
            
            {/* Dots Pagination */}
            <div className="absolute bottom-6 flex gap-2 left-1/2 -translate-x-1/2">
              {sliderImages.map((_, i) => (
                <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
              ))}
            </div>
          </div>

          <p className="max-w-xl text-gray-500 font-medium text-lg mt-10 italic">
            Discover the most premium products directly from our Neon Database. Fast, Secure, and Stylish.
          </p>
        </div>

        {/* Background Decorative Blurs */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
      </header>

      {/* --- FEATURED PRODUCT GRID --- */}
      <section className="py-20 px-8 bg-gray-50 rounded-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">Featured Collection</h2>
              <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
            </div>
            <p className="text-gray-400 font-bold hidden md:block uppercase tracking-widest text-xs">
              Live from Neon Database ({products.length} Items)
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 font-black text-gray-300 animate-pulse tracking-widest">
              SYNCHRONIZING WITH DATABASE...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((item) => (
                <ProductCard 
                  key={item.id}
                  id={item.id}      // 👈 ID pass kar di hai, error ab nahi aayega!
                  title={item.title} 
                  price={item.price} 
                  category={item.category} 
                  image={item.image} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
              <span className="text-6xl mb-4 block">📦</span>
              <p className="text-2xl font-black text-gray-300 italic uppercase">Your store is empty. Add items from Dashboard!</p>
            </div>
          )}
        </div>
      </section>

      
      <Footer />
    </div>
  );
}