'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching orders:', error);
      else setOrders(data || []);
      setLoading(false);
    }

    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-center font-bold">Loading past orders...</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Past Orders</h1>
        <button
          onClick={() => router.push('/')}
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          ← Back to Store
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No past orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => router.push(`/orders/${order.id}`)}
              className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer transition flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-900">{order.customer_name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold text-green-700 mt-1">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full font-medium">
                  {order.status}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}