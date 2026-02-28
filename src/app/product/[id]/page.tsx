import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// Next.js 15/16 mein params ek Promise hoti hai
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Params ko await karna lazmi hai
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  // 2. Agar ID number nahi hai toh error se bachne ke liye check
  if (isNaN(id)) {
    return <div className="p-20 text-center font-black uppercase">Invalid Product ID!</div>;
  }

  // 3. Neon DB se data mangwana
  const product = await prisma.product.findUnique({
    where: { id: id }
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-black mb-4 uppercase italic">Product Not Found! 🚫</h1>
        <Link href="/" className="text-blue-600 font-bold border-b-2 border-blue-600">Back to Store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-20 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* Left: Product Image */}
          <div className="bg-gray-50 rounded-[3rem] overflow-hidden border p-4 shadow-inner group">
            <img 
              src={product.image || "https://placehold.co/800"} 
              alt={product.title} 
              className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right: Product Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-blue-600 font-black uppercase tracking-widest text-xs bg-blue-50 px-4 py-1.5 rounded-full">
                {product.category}
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                {product.title}
              </h1>
            </div>

            <p className="text-4xl font-black text-gray-900 italic">
              Rs. {product.price.toLocaleString()}
            </p>

            <div className="py-8 border-y border-gray-100">
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Product Description</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {product.description || "This premium item is sourced directly from our Neon inventory. Quality and style guaranteed."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-[2] bg-black text-white py-6 rounded-2xl font-black text-lg uppercase shadow-2xl hover:bg-blue-600 transition-all active:scale-95">
                Add to Cart 🛒
              </button>
              <Link href="/" className="flex-1 px-8 py-6 border-2 border-black rounded-2xl font-black text-lg uppercase hover:bg-gray-50 transition-all text-center">
                Back
              </Link>
            </div>

            {/* WhatsApp Direct Help */}
            <div className="p-6 bg-green-50 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-700 uppercase">Have questions?</p>
                <p className="font-black text-green-900">Ask us on WhatsApp</p>
              </div>
              <a 
                href={`https://wa.me/923XXXXXXXXX?text=I am interested in ${product.title}`} 
                target="_blank"
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 shadow-lg"
              >
                📱
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}