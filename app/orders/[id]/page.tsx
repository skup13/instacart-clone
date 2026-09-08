'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: 'Pending' | 'Shopping' | 'Out for Delivery' | 'Delivered';
  created_at: string;
}

const STAGES = ['Pending', 'Shopping', 'Out for Delivery', 'Delivered'];

export default function OrderTrackerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Validate UUID format before querying Supabase
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      setLoading(false);
      return;
    }

    // 2. Fetch initial order details
    async function fetchOrder() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
      } else {
        setOrder(data);
      }
      setLoading(false);
    }

    fetchOrder();

    // 3. Subscribe to real-time status updates using Supabase Realtime
    const channel = supabase
      .channel(`order-updates-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Optional: Auto-advance status every 5 seconds for simulation testing
  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const timer = setTimeout(async () => {
      const currentIndex = STAGES.indexOf(order.status);
      if (currentIndex < STAGES.length - 1) {
        const nextStage = STAGES[currentIndex + 1];

        await supabase
          .from('orders')
          .update({ status: nextStage })
          .eq('id', order.id);

        setOrder({ ...order, status: nextStage as Order['status'] });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [order]);

  if (loading) return <div className="p-8 text-center font-bold">Loading order details...</div>;
  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-600 font-bold">Order not found.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-green-600 text-white px-4 py-2 rounded-md font-bold text-sm"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(order.status);

  return (
    <main className="max-w-xl mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white">
      {/* Header Navigation */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
            Order Tracker
          </span>
          <h1 className="text-2xl font-bold mt-2">Thanks, {order.customer_name}!</h1>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          ← Store Home
        </button>
      </div>

      <div className="text-sm space-y-1 mb-6">
        <p className="text-gray-500">Order ID: {order.id}</p>
        <p className="font-semibold text-base">Total: ${order.total_amount.toFixed(2)}</p>
      </div>

      {/* Progress Bar UI */}
      <div className="space-y-4 my-8">
        <h2 className="font-semibold text-lg text-gray-700">Live Status</h2>
        <div className="space-y-3">
          {STAGES.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <div key={stage} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm ${
                    isCurrent ? 'font-bold text-green-700' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {stage} {isCurrent && '⏳ (In Progress)'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => router.push('/')}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md text-center block mt-6"
      >
        Place Another Order
      </button>
    </main>
  );
}