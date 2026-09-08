'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/useCart';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent server-client hydration mismatch from local storage state
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: customerName,
          total_amount: getTotal(),
          status: 'Pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
      setLoading(false);
      return;
    }

    clearCart();
    router.push(`/orders/${data.id}`);
  };

  if (!mounted) {
    return <div className="p-8 text-center font-bold">Loading checkout...</div>;
  }

  return (
    <main className="max-w-md mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white text-gray-900">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Checkout</h1>

      <div className="mb-6 border-b pb-4">
        <h2 className="font-semibold text-lg mb-2 text-gray-900">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1 text-gray-800">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-base mt-3 pt-2 border-t text-gray-900">
          <span>Total:</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Customer Name</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full border rounded-md p-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading || cart.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md disabled:bg-gray-400"
        >
          {loading ? 'Processing Order...' : 'Place Order'}
        </button>
      </form>
    </main>
  );
}