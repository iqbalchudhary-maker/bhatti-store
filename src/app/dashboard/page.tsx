"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

// Product ka interface
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. SECURITY CHECK: Kya user login hai?
  useEffect(() => {
    const authStatus = localStorage.getItem("isLoggedIn");
    if (authStatus !== "true") {
      router.push("/login"); // Agar login nahi toh bahar nikal do
    } else {
      setIsAuthorized(true); // Agar login hai toh dashboard dikhao
      loadProducts(); // Products load karo
    }
  }, [router]);

  // 2. Database se products mangwana
  async function loadProducts() {
    try {
      const res = await fetch("/api/products", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }

  // 3. Delete Function
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      alert("Delete failed!");
    }
  }

  // 4. Logout Function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  // Search Filter
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Security Guard: Agar authorized nahi toh screen blank rakho
  if (!isAuthorized) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase tracking-widest animate-pulse">Checking Access... 🔒</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-black">
      <Navbar />

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full mt-20">
        {/* Header & Logout */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight uppercase italic">Inventory Management 📦</h2>
            <div className="flex gap-4 items-center mt-2">
               <p className="text-gray-500 font-bold">Total Items: {filteredProducts.length}</p>
               <button onClick={handleLogout} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-black hover:bg-red-600 hover:text-white transition-all">LOGOUT 🚪</button>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm outline-none focus:border-blue-500 font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
          
          <Link href="/dashboard/add-product">
            <button className="bg-black text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 shadow-xl transition-all active:scale-95 uppercase">
              + Add Product
            </button>
          </Link>
        </div>

        {/* Display Logic */}
        {loading ? (
          <div className="text-center py-24 font-black text-gray-300 animate-pulse text-xl">SYNCING NEON DATABASE...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                {/* ID pass ki hai aur isAdmin true taake details/cart button hide rahein */}
                <ProductCard 
                  id={item.id} 
                  title={item.title} 
                  price={item.price} 
                  category={item.category} 
                  image={item.image} 
                  isAdmin={true} 
                />
                
                {/* Admin Actions */}
                <div className="mt-4 flex gap-2 px-2 pb-2">
                  <Link href={`/dashboard/edit-product/${item.id}`} className="flex-1">
                    <button className="w-full bg-yellow-400 text-black py-3 rounded-xl text-[10px] font-black hover:bg-yellow-500 uppercase">
                      Edit ✏️
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="px-5 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}