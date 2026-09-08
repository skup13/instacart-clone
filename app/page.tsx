'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/useCart';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  unit: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { cart, addToCart, removeFromCart, getTotal } = useCart();

  useEffect(() => {
    setMounted(true);
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Error fetching products:', error);
      else setProducts(data || []);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted || loading) {
    return <div className="p-8 text-center font-bold">Loading grocery store...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6 relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
  <h1 className="text-3xl font-bold text-green-700">Instacart MVP Store</h1>
  
  <div className="flex items-center gap-4">
    <button 
      onClick={() => router.push('/orders')}
      className="text-sm font-semibold text-gray-600 hover:text-green-700"
    >
      My Orders
    </button>

    <button 
      onClick={() => setIsCartOpen(!isCartOpen)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2"
    >
      🛒 Cart ({totalItems})
    </button>
  </div>
</header>

      {/* Cart Drawer Overlay */}
{isCartOpen && (
  <div className="fixed right-6 top-20 w-80 bg-white text-gray-900 border shadow-xl rounded-lg p-4 z-50">
    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-900">Your Cart</h2>
    {cart.length === 0 ? (
      <p className="text-gray-500">Your cart is empty.</p>
    ) : (
      <div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:underline text-xs font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 mt-3 font-bold flex justify-between text-gray-900">
          <span>Total:</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>

        <button 
          onClick={() => router.push('/checkout')}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-bold mt-4 text-center block"
        >
          Proceed to Checkout
        </button>
      </div>
    )}
  </div>
)}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-40 object-cover rounded-md mb-3" 
            />
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
              {product.category}
            </span>
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xl font-bold">${product.price} / {product.unit}</span>
              <button 
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url
                })}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}