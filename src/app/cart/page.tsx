"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const sendToWhatsApp = () => {
    const phoneNumber = "923XXXXXXXXX"; // 👈 Apna WhatsApp number yahan likhein
    let message = "Salam! I want to place an order:%0A%0A";
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.title}* - Rs. ${item.price}%0A`;
    });

    message += `%0A*Total: Rs. ${totalPrice}*`;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-32 px-8 pb-20">
        <h1 className="text-5xl font-black italic mb-10 tracking-tighter">YOUR CART</h1>
        
        {cart.length === 0 ? (
          <p className="text-gray-400 font-bold">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-blue-600 font-black">Rs. {item.price}</p>
                  </div>
                </div>
                <button onClick={() => {
                  const newCart = cart.filter((_, i) => i !== idx);
                  setCart(newCart);
                  localStorage.setItem("cart", JSON.stringify(newCart));
                }} className="text-red-500 font-bold">Remove</button>
              </div>
            ))}

            <div className="mt-10 p-8 bg-black rounded-[2.5rem] text-white flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase">Total Amount</p>
                <h2 className="text-3xl font-black">Rs. {totalPrice}</h2>
              </div>
              <button 
                onClick={sendToWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase transition-all active:scale-95"
              >
                Order on WhatsApp 📱
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}