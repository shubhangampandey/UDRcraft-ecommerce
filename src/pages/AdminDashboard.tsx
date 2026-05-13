import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi, productsApi, ordersApi, analyticsApi, ManagedProduct, Order } from '@/services/api';
import { User } from '@/types/auth';
import { Users, Package, ShoppingBag, DollarSign, Shield, TrendingUp, Settings, BarChart3, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders' | 'analytics'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      usersApi.getAll(),
      productsApi.getAllAdmin(),
      ordersApi.getAll(),
      analyticsApi.getAdminStats(),
    ]).then(([u, p, o, s]) => { setUsers(u.data); setProducts(p.data); setOrders(o.data); setStats(s.data); });
  }, []);

  const handleUserStatus = async (userId: string, status: User['status']) => {
    await usersApi.updateStatus(userId, status);
    setUsers(u => u.map(x => x.id === userId ? { ...x, status } : x));
  };

  const handleDeleteUser = async (userId: string) => {
    await usersApi.deleteUser(userId);
    setUsers(u => u.filter(x => x.id !== userId));
  };

  const handleToggleApproval = async (productId: string) => {
  const res = await productsApi.toggleApproval(productId);

  setProducts(p =>
    p.map(x => x.id === productId ? res.data : x)
  );
};


const handleToggleBestSeller = async (productId: string) => {
  const res = await productsApi.toggleBestSeller(productId);

  setProducts(p =>
    p.map(x => x.id === productId ? res.data : x)
  );
};
const handleApproveAllProducts = async () => {
  try {
    const token = localStorage.getItem('maison_token');

    const response = await fetch('http://loclhost:5000/api/products/approve-all', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
     
    });

    if (!response.ok) {
      throw new Error('Failed to approve products');
    }

    const updated = await productsApi.getAllAdmin();
    setProducts(updated.data);

  } catch (error) {
    console.error(error);
  }
};

const handleRejectAllProducts = async () => {
  try {
    const token = localStorage.getItem('maison_token');

    const response = await fetch('http://localhost:5000/api/products/reject-all', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
     
    });

    if (!response.ok) {
      throw new Error('Failed to reject products');
    }

    const updated = await productsApi.getAllAdmin();
    setProducts(updated.data);

  } catch (error) {
    console.error(error);
  }
};

const handleDeleteAllProducts = async () => {
  try {
    const confirmed = window.confirm(
      'Are you sure you want to delete all products?'
    );

    if (!confirmed) return;

    const token = localStorage.getItem('maison_token');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/delete-all`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete products');
    }

    const updated = await productsApi.getAllAdmin();
    setProducts(updated.data);

  } catch (error) {
    console.error(error);
  }
};

const handleFetchImportedProducts = async () => {
  try {
    const token = localStorage.getItem('maison_token');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch supplier products');
    }

    const updated = await productsApi.getAllAdmin();
    setProducts(updated.data);

  } catch (error) {
    console.error(error);
  }
};

const handleDeleteImportedProducts = async () => {
  try {
    const token = localStorage.getItem('maison_token');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/delete-imported`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete imported products');
    }

    const updated = await productsApi.getAllAdmin();
    setProducts(updated.data);

  } catch (error) {
    console.error(error);
  }
};
  const handleOrderStatus = async (orderId: string, status: Order['status']) => {
    await ordersApi.updateStatus(orderId, status);
    setOrders(o => o.map(x => x.id === orderId ? { ...x, status } : x));
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingBag },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];
if (!stats) return null;

  return (
    <main className="pt-20 md:pt-24 min-h-screen bg-secondary/30">
      <div className="luxury-container">
        <div className="py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-muted-foreground" />
            <h1 className="luxury-heading text-3xl md:text-4xl">Admin Dashboard</h1>
          </div>
          <p className="luxury-subheading">Platform Management</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-body text-xs uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: Users },
                { label: 'Total Products', value: stats.totalProducts, icon: Package },
                { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
                { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`,icon: DollarSign },
              ].map(stat => (
                <div key={stat.label} className="bg-background border border-border p-6">
                  <stat.icon size={16} className="text-muted-foreground mb-3" />
                  <p className="font-display text-2xl md:text-3xl font-light">{stat.value}</p>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background border border-border p-6">
                <h3 className="font-display text-xl font-light mb-4">Order Status Breakdown</h3>
                <div className="space-y-3">
                 {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="font-body text-sm capitalize">{status}</span>
                      <span className="font-body text-sm font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-background border border-border p-6">
                <h3 className="font-display text-xl font-light mb-4">User Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm">Customers</span>
                    <span className="font-body text-sm font-medium">{stats.customerCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm">Vendors</span>
                    <span className="font-body text-sm font-medium">{stats.vendorCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border p-6">
              <h3 className="font-display text-xl font-light mb-4">Monthly Revenue</h3>
              <div className="flex items-end gap-4 h-40">
                {stats?.monthlyRevenue?.map((m: any) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-foreground/10 relative" style={{ height: `${Math.max((m.revenue / 7000) * 100, 5)}%` }}>
                      <div className="absolute inset-0 bg-foreground" />
                    </div>
                    <span className="font-body text-xs text-muted-foreground">{m.month}</span>
                    <span className="font-body text-xs">${m.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-background border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-6 py-4 font-body text-sm font-medium">{u.name}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="font-body text-xs uppercase tracking-wider px-2 py-1 bg-secondary">{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-body text-xs uppercase tracking-wider px-2 py-1 ${
                        u.status === 'active' ? 'bg-green-50 text-green-700' :
                        u.status === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-6 py-4 font-body text-xs text-muted-foreground">{u.createdAt}</td>
                    <td className="px-6 py-4 flex gap-2">
                      {u.id !== currentUser?.id && (
                        <>
                          <button onClick={() => handleUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                            className="text-muted-foreground hover:text-foreground" title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                            {u.status === 'active' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="space-y-4">
 <div className="flex gap-3">
  <button
    onClick={handleApproveAllProducts}
    className="border border-black px-4 py-2 text-xs uppercase tracking-[0.15em] bg-white text-black hover:bg-black hover:text-white transition-colors"
  >
    Approve All
  </button>

  <button
    onClick={handleRejectAllProducts}
    className="border border-black px-4 py-2 text-xs uppercase tracking-[0.15em] bg-white text-black hover:bg-black hover:text-white transition-colors"
  >
    Reject All
  </button>

  <button
    onClick={handleDeleteAllProducts}
    className="border border-black px-4 py-2 text-xs uppercase tracking-[0.15em] bg-black text-white hover:bg-white hover:text-black transition-colors"
  >
    Delete All
  </button>
  <button
  onClick={handleFetchImportedProducts}
  className="border border-black px-4 py-2 text-xs uppercase tracking-[0.15em] bg-white text-black hover:bg-black hover:text-white transition-colors"
>
  Fetch Supplier
</button>

<button
  onClick={handleDeleteImportedProducts}
  className="border border-black px-4 py-2 text-xs uppercase tracking-[0.15em] bg-white text-black hover:bg-black hover:text-white transition-colors"
>
  Delete Imported
</button>
</div>

  <div className="bg-background border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Product', 'Vendor', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products?.map(p => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-6 py-4 font-body text-sm font-medium">{p.name}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground">{p.vendor}</td>
                    <td className="px-6 py-4 font-body text-xs uppercase tracking-wider text-muted-foreground">{p.category}</td>
                    <td className="px-6 py-4 font-body text-sm">${p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`font-body text-xs uppercase tracking-wider px-2 py-1 ${p.approved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {p.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
  <button
    onClick={() => handleToggleApproval(p.id)}
    className={`font-body text-xs uppercase tracking-wider underline ${p.approved ? 'text-destructive' : 'text-green-700'}`}
  >
    {p.approved ? 'Reject' : 'Approve'}
  </button>

  <button
    onClick={() => handleToggleBestSeller(p.id)}
    className="font-body text-xs uppercase tracking-wider underline text-blue-600"
  >
    {p.isBestSeller ? 'Remove Best' : 'Make Best'}
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-background border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Update'].map(h => (
                    <th key={h} className="text-left px-6 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders?.map(o => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-6 py-4 font-body text-sm font-medium">{o.id}</td>
                    <td className="px-6 py-4 font-body text-sm">{o.customerName}</td>
                    <td className="px-6 py-4 font-body text-xs text-muted-foreground">{o.items.length} item(s)</td>
                    <td className="px-6 py-4 font-body text-sm">${o.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`font-body text-xs uppercase tracking-wider px-2 py-1 ${
                        o.status === 'delivered' ? 'bg-green-50 text-green-700' :
                        o.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        o.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-secondary text-foreground'
                      }`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select value={o.status} onChange={e => handleOrderStatus(o.id, e.target.value as Order['status'])}
                        className="border border-border bg-transparent px-2 py-1 font-body text-xs outline-none">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background border border-border p-6">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Avg Order Value</p>
                <p className="font-display text-3xl font-light">
                  ${stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}
                </p>
              </div>
              <div className="bg-background border border-border p-6">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Conversion Rate</p>
                <p className="font-display text-3xl font-light">3.2%</p>
              </div>
              <div className="bg-background border border-border p-6">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Products / Vendor</p>
                <p className="font-display text-3xl font-light">
                  {stats.vendorCount > 0 ? Math.round(stats.totalProducts / stats.vendorCount) : 0}
                </p>
              </div>
            </div>
            <div className="bg-background border border-border p-6">
              <h3 className="font-display text-xl font-light mb-4">Revenue Trend</h3>
              <div className="flex items-end gap-6 h-48">
                {stats.monthlyRevenue?.map((m: any, i: number) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full rounded-t" style={{ height: `${Math.max((m.revenue / 7000) * 100, 8)}%`, background: 'hsl(var(--foreground))' }} />
                    <span className="font-body text-xs text-muted-foreground">{m.month}</span>
                    <span className="font-body text-xs font-medium">${m.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="py-20" />
      </div>
    </main>
  );
};

export default AdminDashboard;
