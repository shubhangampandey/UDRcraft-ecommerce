import { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import { ordersApi } from '@/services/api';
import { useEffect } from 'react';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [tracked, setTracked] = useState(false);
  const [order, setOrder] = useState(null);
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    setOrderId(id);

    ordersApi.getById(id)
      .then(res => {
        setOrder(res.data);
        setTracked(true);
      })
      .catch(() => {});
  }
}, []);
  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <div className="luxury-container max-w-2xl mx-auto">
        <div className="text-center py-12 md:py-16">
          <h1 className="luxury-heading">Order Tracking</h1>
          <p className="font-body text-sm text-muted-foreground mt-4">Enter your order number to track your shipment.</p>
        </div>

        <form onSubmit={async (e) => {
  e.preventDefault();

  try {
    const res = await ordersApi.track(orderId);
    setOrder(res.data);
    setTracked(true);
  } catch (err) {
    console.error(err);
    alert("Order not found");
  }
}} className="flex gap-3 mb-12">
          <input
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="Order number (e.g., MS-2026-001)"
            className="flex-1 border border-border px-4 py-3 font-body text-sm bg-transparent outline-none focus:border-foreground transition-colors"
          />
          <button type="submit" className="bg-foreground text-background px-6 py-3 font-body text-xs uppercase tracking-[0.15em] inline-flex items-center gap-2 luxury-hover hover:bg-foreground/90">
            <Search size={14} /> Track
          </button>
        </form>

        {tracked && (
          <div className="animate-fade-up">
            <div className="border border-border p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Order</p>
                  <p className="font-display text-xl font-light">{orderId}</p>
                </div>
                <span className="font-body text-xs bg-foreground text-background px-3 py-1 uppercase tracking-wider">
  {order?.status || "Pending"}
</span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-0 mb-8">
                {[
  
  { icon: Package, label: 'Order Placed', done: !!order },
  { icon: Package, label: 'Processing', done: ['processing','shipped','delivered'].includes(order?.status) },
  { icon: Truck, label: 'Shipped', done: ['shipped','delivered'].includes(order?.status) },
  { icon: CheckCircle, label: 'Delivered', done: order?.status === 'delivered' },

].map((step, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step.done ? 'bg-foreground text-background' : 'border border-border text-muted-foreground'}`}>
                      <step.icon size={14} />
                    </div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{step.label}</p>
                  </div>
                ))}
              </div>

              <p className="font-body text-sm text-muted-foreground">Estimated delivery: April 18, 2026</p>
            </div>
          </div>
        )}

        <div className="py-20" />
      </div>
    </main>
  );
};

export default OrderTracking;
