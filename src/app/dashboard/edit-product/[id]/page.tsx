"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, use } from "react"; // 👈 'use' add kiya
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // 👈 ID nikalne ka naya tareeqa
  const id = resolvedParams.id;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log("Fetching data for ID:", id);
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setPrice(data.price.toString());
          setCategory(data.category);
          setDescription(data.description);
          setPreview(data.image);
        } else {
          console.error("Failed to load product");
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Image resize logic (Wohi purani)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setPreview(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price: parseInt(price), category, description, image: preview }),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      alert("Error!");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="p-20 text-center text-black font-bold">LOADING...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10 text-black">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black mb-6 text-center uppercase tracking-tight">Edit Product</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50">
            {preview && (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-inner bg-white border">
                <img src={preview} alt="Current" className="w-full h-full object-contain" />
                <label className="absolute bottom-3 right-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700">
                  CHANGE PHOTO
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            )}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" required />
          <div className="grid grid-cols-2 gap-4">
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" required />
            <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" required />
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-4 bg-gray-100 rounded-2xl outline-none" required></textarea>
          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl font-black">
            {loading ? "SAVING..." : "UPDATE PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
}