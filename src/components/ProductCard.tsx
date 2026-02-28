"use client";
import Link from "next/link";

interface ProductProps {
  id: number;
  title: string;
  price: number;
  category: string;
  image?: string | null;
  isAdmin?: boolean; // 👈 Naya Prop: Admin check karne ke liye
}

export default function ProductCard({ id, title, price, category, image, isAdmin = false }: ProductProps) {
  
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItem = { id, title, price, image };
    localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
    alert(`${title} added to cart! 🛒`);
  };

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
      <div className="relative h-60 w-full rounded-[2rem] overflow-hidden bg-gray-50">
        <img src={image || "https://placehold.co/400"} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{category}</div>
      </div>

      <div className="mt-6 px-2">
        <h3 className="text-lg font-bold text-gray-800 truncate">{title}</h3>
        <p className="text-2xl font-black mt-1 text-blue-600">Rs. {price.toLocaleString()}</p>
        
        {/* Sirf tab dikhao jab isAdmin false ho (Frontend par) */}
        {!isAdmin && (
          <div className="mt-4 flex gap-2">
            <Link href={`/product/${id}`} className="flex-1 text-center py-3 bg-gray-100 rounded-xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all">
              Details
            </Link>
            <button 
              onClick={addToCart}
              className="flex-[2] py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 shadow-lg active:scale-95 transition-all"
            >
              Add to Cart 🛒
            </button>
          </div>
        )}
      </div>
    </div>
  );
}