import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { productsApi, ordersApi, analyticsApi, ManagedProduct, Order } from '@/services/api';
import { Package, ShoppingBag, DollarSign, AlertCircle, Plus, Edit, Trash2, Store, Settings, TrendingUp } from 'lucide-react';


const VendorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
  name: '',
  price: '',
  category: 'Seating',
  description: '',
  discount: 0
});
  const [productImage, setProductImage] = useState<File | null>(null);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkFileKey, setBulkFileKey] = useState(0);
  const [bulkResult, setBulkResult] = useState<{ totalRows: number; successCount: number; failedRows: { row: number; message: string; }[] } | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ManagedProduct | null>(null);


  useEffect(() => {
    if (!user) return;
    Promise.all([
      productsApi.getByVendor(user.id),
ordersApi.getByVendor(user.id),
analyticsApi.getVendorStats(user.id),

    ]).then(([p, o, s]) => { 
  setProducts(p?.data || []); 
  setOrders(o?.data || []); 
  setStats(s?.data || null); 
}).catch(() => {
  setProducts([]);
  setOrders([]);
  setStats(null);
});

  }, [user]);

 const handleAddProduct = async () => {
  if (!user || !newProduct.name || !newProduct.price) return;

  try {
   const formData = new FormData();

formData.append("name", newProduct.name);
formData.append("price", newProduct.price);
formData.append("category", newProduct.category);
formData.append("description", newProduct.description);
formData.append("discount", String(newProduct.discount));

if (productImage) {
  formData.append("image", productImage);
}

await productsApi.create(formData);


    const updated = await productsApi.getByVendor(user.id);
    setProducts(updated.data);

    setShowAddProduct(false);
    setNewProduct({
  name: '',
  price: '',
  category: 'Seating',
  description: '',
  discount: 0
});

  } catch (err) {
    console.error(err);
  }
};

const handleBulkUpload = async () => {
  if (!user || !bulkFile) return;
  setBulkUploading(true);
  setBulkError(null);

  try {
    const formData = new FormData();
    formData.append('file', bulkFile);

    const res = await productsApi.bulkUpload(formData);
    setBulkResult(res.data);

    const updated = await productsApi.getByVendor(user.id);
    setProducts(updated.data);
    setBulkFile(null);
    setBulkFileKey(k => k + 1);
  } catch (err: any) {
    console.error(err);
    setBulkError(err?.response?.data?.message || err.message || 'Bulk upload failed');
  } finally {
    setBulkUploading(false);
  }
};
const handleUpdateProduct = async () => {
  if (!editingProduct) return;

  try {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("description", newProduct.description);

    if (productImage) {
      formData.append("image", productImage);
    }

    await productsApi.update(editingProduct.id, formData);

    const updated = await productsApi.getByVendor(user.id);
    setProducts(updated.data);

    setEditingProduct(null);
    setShowAddProduct(false);
    setProductImage(null);
    setNewProduct({
  name: '',
  price: '',
  category: 'Seating',
  description: '',
  discount: 0
});

  } catch (err) {
    console.error(err);
  }
};




  const handleDeleteProduct = async (id: string) => {
    await productsApi.delete(id);
    setProducts(p => p.filter(x => x.id !== id));
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    await ordersApi.updateStatus(id, status);
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingBag },
    { id: 'settings' as const, label: 'Store Settings', icon: Settings },
  ];

  return (
    <main className="pt-20 md:pt-24 min-h-screen bg-secondary/30">
      <div className="luxury-container">
        <div className="py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2">
            <Store size={20} className="text-muted-foreground" />
            <h1 className="luxury-heading text-3xl md:text-4xl">Vendor Dashboard</h1>
          </div>
          <p className="luxury-subheading">{user?.storeName || 'Your Store'}</p>
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
                { label: 'Total Products', value: stats.totalProducts, icon: Package },
                { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
                { label: 'Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign },
                { label: 'Pending Orders', value: stats.pendingOrders, icon: AlertCircle },
              ].map(stat => (
                <div key={stat.label} className="bg-background border border-border p-6">
                  <stat.icon size={16} className="text-muted-foreground mb-3" />
                  <p className="font-display text-2xl md:text-3xl font-light">{stat.value}</p>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-background border border-border p-6">
              <h3 className="font-display text-xl font-light mb-4">Recent Orders</h3>
              {(stats?.recentOrders?.length ?? 0) === 0 ? (
                <p className="font-body text-sm text-muted-foreground">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {['Order', 'Customer', 'Total', 'Status'].map(h => (
                          <th key={h} className="text-left py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentOrders?.map((o: Order) => (
                        <tr key={o.id} className="border-b border-border/50">
                          <td className="py-3 font-body text-sm">{o.id}</td>
                          <td className="py-3 font-body text-sm">{o.customerName}</td>
                          <td className="py-3 font-body text-sm">${(o.total ?? 0).toLocaleString()}
</td>
                          <td className="py-3">
                            <span className={`font-body text-xs uppercase tracking-wider px-2 py-1 ${
                              o.status === 'delivered' ? 'bg-green-50 text-green-700' :
                              o.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                              o.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-secondary text-foreground'
                            }`}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Bulk Upload Products</label>
                  <input key={bulkFileKey} type="file" accept=".csv,.xlsx" onChange={e => setBulkFile(e.target.files?.[0] || null)}
                    className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleBulkUpload} disabled={!bulkFile || bulkUploading}
                    className="bg-foreground text-background px-6 py-3 font-body text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50">
                    {bulkUploading ? 'Uploading...' : 'Upload File'}
                  </button>
                  <button onClick={() => setShowAddProduct(true)}
                    className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 font-body text-xs uppercase tracking-wider hover:opacity-90 transition-opacity">
                    <Plus size={14} /> Add Product
                  </button>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground">
  Required Shopify CSV columns: Handle, Title, Body (HTML), Type, Product Category, Variant Price, Variant Compare At Price, Image Src
</p>
              <div className="bg-background border border-border p-4 text-sm">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Sample CSV format</p>
                <code className="block whitespace-pre-wrap text-[13px]">Handle,Title,Body (HTML),Type,Product Category,Variant Price,Variant Compare At Price,Image Src</code>
              </div>
              {bulkError && <p className="text-destructive text-sm">{bulkError}</p>}
              {bulkResult && (
                <div className="bg-background border border-border p-4 space-y-3">
                  <p className="font-body text-sm"><strong>{bulkResult.successCount}</strong> products added out of <strong>{bulkResult.totalRows}</strong> rows.</p>
                  {bulkResult.failedRows.length > 0 && (
                    <div>
                      <p className="font-body text-sm font-medium">Failed Rows:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {bulkResult.failedRows.map(row => (
                          <li key={row.row}>Row {row.row}: {row.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {(showAddProduct || editingProduct) && (
              <div className="bg-background border border-border p-6 space-y-4">
                <h4 className="font-display text-lg font-light">New Product</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                    className="border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors" />
                  <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                    className="border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors" />
                    <input
  type="number"
  placeholder="Discount % (optional)"
  value={newProduct.discount || ''}
  onChange={e => setNewProduct(p => ({ ...p, discount: Number(e.target.value) }))}
  className="border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors"
/>
                  <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                    className="border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors">
                    {['Seating', 'Tables', 'Lighting', 'Storage', 'Decor', 'Bedroom'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                    className="border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors" />
                  <div>
                    <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Product Image</label>
                    <input type="file" accept="image/*" onChange={e => setProductImage(e.target.files?.[0] || null)}
                      className="border border-border bg-transparent px-4 py-2.5 font-body text-sm w-full" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
  Save
</button>

                  <button onClick={() => setShowAddProduct(false)} className="border border-border px-5 py-2.5 font-body text-xs uppercase tracking-wider hover:bg-secondary">Cancel</button>
                </div>
              </div>
            )}

            <div className="bg-background border border-border overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Product', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products?.map(p => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-6 py-4 font-body text-sm">{p.name}</td>
                      <td className="px-6 py-4 font-body text-xs uppercase tracking-wider text-muted-foreground">{p.category}</td>
                      <td className="px-6 py-4 font-body text-sm">${p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`font-body text-xs uppercase tracking-wider px-2 py-1 ${p.approved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {p.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
  onClick={() => {
    setNewProduct({
  name: p.name,
  price: String(p.price),
  category: p.category,
  description: p.description || '',
  discount: p.discount || 0
});
  }}
  className="text-muted-foreground hover:text-foreground"
>
  <Edit size={14} />
</button>

                        <button onClick={() => handleDeleteProduct(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
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
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-6 py-4 font-body text-sm font-medium">{o.id}</td>
                    <td className="px-6 py-4 font-body text-sm">{o.customerName}</td>
                    <td className="px-6 py-4 font-body text-xs text-muted-foreground">{o.items.filter(i => i.vendorId === user?.id).map(i => i.productName).join(', ')}</td>
                    <td className="px-6 py-4 font-body text-sm">${o.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`font-body text-xs uppercase tracking-wider px-2 py-1 ${
                        o.status === 'delivered' ? 'bg-green-50 text-green-700' :
                        o.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        o.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-secondary text-foreground'
                      }`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select value={o.status} onChange={e => handleUpdateOrderStatus(o.id, e.target.value as Order['status'])}
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

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-xl bg-background border border-border p-8 space-y-6">
            <h3 className="font-display text-xl font-light">Store Settings</h3>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Store Name</label>
              <input defaultValue={user?.storeName || ''} className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors" />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Store Description</label>
              <textarea defaultValue={user?.storeDescription || ''} rows={4}
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors resize-none" />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Contact Email</label>
              <input defaultValue={user?.email || ''} className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors" />
            </div>
            <button className="bg-foreground text-background px-6 py-3 font-body text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        )}

        <div className="py-20" />
      </div>
    </main>
  );
};

export default VendorDashboard;
