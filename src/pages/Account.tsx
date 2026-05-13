import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, Store, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ordersApi } from '@/services/api';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
 useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('tab') === 'orders') {
    setActiveTab('orders');
  }
}, [location.search]);
  useEffect(() => {
  if (!user) return;

  ordersApi.getByCustomer(user.id)
    .then(res => setOrders(res.data))
    .catch(() => setOrders([]));
}, [user]);
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Profile', desc: 'Manage your personal information', href: '#' },
   { icon: Package, label: 'Orders', desc: 'Track and manage your orders', href: '/account?tab=orders' },
    { icon: Heart, label: 'Wishlist', desc: 'View your saved items', href: '/wishlist' },
    { icon: MapPin, label: 'Addresses', desc: 'Manage shipping addresses', href: '#' },
  ];

  if (user?.role === 'vendor') {
    menuItems.push({ icon: Store, label: 'Vendor Dashboard', desc: 'Manage your store and products', href: '/vendor' });
  }
  if (user?.role === 'admin') {
    menuItems.push({ icon: Shield, label: 'Admin Panel', desc: 'Platform management', href: '/admin' });
  }
return (
  <main className="pt-20 md:pt-24 min-h-screen">
    <div className="luxury-container max-w-3xl mx-auto">
      <div className="text-center py-12 md:py-16">
        <h1 className="luxury-heading">My Account</h1>
        {user && (
          <div className="mt-4">
            <p className="font-body text-sm text-muted-foreground">{user.email}</p>
            <span className="font-body text-xs uppercase tracking-[0.15em] px-3 py-1 bg-secondary inline-block mt-2">
              {user.role}
            </span>
          </div>
        )}
      </div>

      {activeTab === 'menu' && (
        
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map(item => (
              <Link
                key={item.label}
                to={item.href}
                className="border border-border p-8 hover:bg-secondary luxury-hover group"
              >
                <item.icon
                  size={20}
                  className="text-muted-foreground group-hover:text-foreground luxury-hover mb-4"
                />
                <h3 className="font-display text-xl font-light mb-1">{item.label}</h3>
                <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground luxury-hover mx-auto"
          >
            <LogOut size={14} /> Sign Out
          </button>

          <div className="py-20" />
        </>
      )}
      {activeTab === 'orders' && (
  <div className="space-y-4">
    <h2 className="text-xl font-display">My Orders</h2>

    {!orders || orders.length === 0 ? (
      <p className="text-sm text-muted-foreground">No orders yet</p>
    ) : (
      orders.map((o: any) => (
        <div
          key={o.id}
          className="border border-border p-4 flex justify-between items-center"
        >
          <div>
            <p className="text-sm">Order ID: {o.id}</p>
            <p className="text-sm">Total: ${o.total}</p>
            <p className="text-sm">Status: {o.status}</p>
          </div>

          <button
            onClick={() => navigate(`/order-tracking?id=${o.id}`)}
            className="bg-foreground text-background px-4 py-2 text-xs"
          >
            Track
          </button>
        </div>
      ))
    )}
  </div>
)}

    </div>

  </main>
);
};
export default Account;