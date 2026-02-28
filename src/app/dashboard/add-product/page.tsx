"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- 1. IMAGE HANDLING & RESIZING LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400; // Image width 400px tak choti hogi
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Quality ko 0.7 rakha hai taake string bohot lambi na ho
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setPreview(compressedBase64); 
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 2. FORM SUBMISSION ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!preview) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Yahan hum ensure kar rahe hain ke 'image' field mein compressed string jaye
    formData.set("image", preview);
    
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Success: Product added!");
        router.push("/dashboard");
        router.refresh(); 
      } else {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        alert("Server error! Neon might be rejecting the image size.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Check your internet or Neon URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-800 mb-6 text-black text-center uppercase tracking-tighter">Add New Product 📦</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* IMAGE PREVIEW SECTION */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50 transition-all hover:bg-blue-100">
            {preview ? (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-inner border bg-white">
                <img src={preview} alt="Selected" className="w-full h-full object-contain" />
                <button 
                  type="button" 
                  onClick={() => setPreview(null)} 
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full text-xs shadow-lg hover:bg-red-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-5xl block mb-2">📸</span>
                <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all inline-block shadow-md active:scale-95">
                  SELECT FROM LAPTOP
                  <input 
                    name="imageInput" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    required={!preview} 
                  />
                </label>
                <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">JPG or PNG (Auto Resized)</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 ml-1">Product Title</label>
              <input name="title" type="text" placeholder="e.g. Premium Cotton Shirt" className="w-full p-4 bg-gray-100 rounded-2xl text-black border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 ml-1">Price (Rs.)</label>
                <input name="price" type="number" placeholder="1500" className="w-full p-4 bg-gray-100 rounded-2xl text-black border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 ml-1">Category</label>
                <input name="category" type="text" placeholder="Clothing" className="w-full p-4 bg-gray-100 rounded-2xl text-black border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 ml-1">Full Description</label>
              <textarea name="description" rows={3} placeholder="Tell more about the product..." className="w-full p-4 bg-gray-100 rounded-2xl text-black border-none focus:ring-2 focus:ring-blue-500 outline-none" required></textarea>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !preview}
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white p-5 rounded-2xl font-black shadow-lg transition-all active:scale-95 mt-4`}
          >
            {loading ? "SAVING TO NEON..." : "CONFIRM & SAVE PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
}