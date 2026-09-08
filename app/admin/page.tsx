'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const STAGES = ['Pending', 'Shopping', 'Out for Delivery', 'Delivered'];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Store Admin - Order Dashboard</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-md bg-white flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold">{order.customer_name}</p>
              <p className="text-sm text-gray-500">ID: {order.id}</p>
              <p className="text-sm font-semibold text-green-700">${order.total_amount.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 p-2 rounded font-bold">{order.status}</span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border p-1 rounded text-sm bg-white"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}