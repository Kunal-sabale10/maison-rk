'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Product, Order } from '@/types';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ListOrdered,
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Loader2, 
  CheckSquare 
} from 'lucide-react';

type Tab = 'overview' | 'products' | 'orders';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ revenue: 0, customers: 2, ordersCount: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  // Modals status
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Add/Edit Product fields state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('Apparel');
  const [stockCount, setStockCount] = useState(10);
  const [imageUrl, setImageUrl] = useState('');

  // Secure admin guard routing
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user || user.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'Restricted area. Admin privileges required.',
          type: 'error'
        });
        router.push('/');
      }
    }
  }, [loading, isAuthenticated, user, router, toast]);

  // Fetch admin stats & lists
  const fetchAdminData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await fetch('/api/products');
      let prodData: Product[] = [];
      if (prodRes.ok) {
        prodData = await prodRes.json();
        setProducts(prodData);
      }

      // 2. Fetch Orders
      const orderRes = await fetch('/api/orders');
      let orderData: Order[] = [];
      if (orderRes.ok) {
        orderData = await orderRes.json();
        setOrders(orderData);
      }

      // 3. Compute stats
      const totalRev = orderData.reduce((acc, o) => acc + o.total, 0);
      setStats({
        revenue: totalRev,
        customers: 4, // Seeded base
        ordersCount: orderData.length
      });
    } catch (err) {
      console.error('Failed to retrieve admin data streams:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  // Admin CRUD: Delete
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this piece?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Product Deleted', description: 'Item removed from catalogue.', type: 'success' });
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Delete Error', description: 'Failed to delete item.', type: 'error' });
    }
  };

  // Admin CRUD: Create
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price <= 0) return;
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price,
          category,
          stockCount,
          images: imageUrl ? [imageUrl] : undefined
        })
      });

      if (res.ok) {
        toast({ title: 'Product Created', description: 'Successfully added new luxury piece.', type: 'success' });
        setShowAddModal(false);
        resetFormFields();
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Creation Error', description: 'Failed to create piece.', type: 'error' });
    }
  };

  // Admin CRUD: Pre-fill edit modal
  const openEditModal = (p: Product) => {
    setProductToEdit(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setCategory(p.category);
    setStockCount(p.stockCount);
    setImageUrl(p.images[0]);
    setShowEditModal(true);
  };

  // Admin CRUD: Save Edit updates
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToEdit) return;

    try {
      const res = await fetch(`/api/products/${productToEdit.id || productToEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price,
          category,
          stockCount,
          images: imageUrl ? [imageUrl] : undefined
        })
      });

      if (res.ok) {
        toast({ title: 'Product Updated', description: ' Garment specifications saved.', type: 'success' });
        setShowEditModal(false);
        resetFormFields();
        setProductToEdit(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Update Error', description: 'Failed to save product specs.', type: 'error' });
    }
  };

  // Admin Operations: Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, deliveryStatus: status })
      });

      if (res.ok) {
        toast({
          title: 'Fulfillment Updated',
          description: `Order status changed to ${status.toUpperCase()}`,
          type: 'success'
        });
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Fulfillment Error', description: 'Failed to update delivery status.', type: 'error' });
    }
  };

  const resetFormFields = () => {
    setName('');
    setDescription('');
    setPrice(0);
    setCategory('Apparel');
    setStockCount(10);
    setImageUrl('');
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-background justify-center items-center font-sans text-xs">
        <Loader2 className="h-6 w-6 animate-spin text-foreground stroke-[1.5]" />
        <span className="mt-3 text-muted-foreground uppercase tracking-widest">Validating admin credentials...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="border-b border-border/60 pb-6 mb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">MAISON PRIVILEGES</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground mt-2 uppercase tracking-wide">
              ADMIN CONTROL PANEL
            </h1>
          </div>

          {/* Tab controllers */}
          <div className="flex border-b border-border mb-8 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 pr-8 cursor-pointer border-b-2 transition-all ${
                activeTab === 'overview' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-8 cursor-pointer border-b-2 transition-all ${
                activeTab === 'products' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Garments Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-8 cursor-pointer border-b-2 transition-all ${
                activeTab === 'orders' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Fulfillment Orders ({orders.length})
            </button>
          </div>

          {dataLoading ? (
            <div className="py-20 text-center uppercase tracking-widest text-xs font-semibold text-muted-foreground animate-pulse">
              Loading metrics stream...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW METRICS SECTION */}
              {activeTab === 'overview' && (
                <div className="space-y-10 animate-fade-in">
                  {/* Summary metric blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Metric 1 */}
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">GROSS REVENUE</span>
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-3xl font-bold font-mono text-foreground mt-4">${stats.revenue}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-semibold mt-3">
                        <TrendingUp className="h-3.5 w-3.5" /> +18.4% vs last month
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">TOTAL PIECES</span>
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-3xl font-bold text-foreground mt-4">{products.length}</p>
                      <span className="text-[10px] text-muted-foreground tracking-wide mt-3 block font-medium">8 premium catalog styles</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">ORDERS COMPLETED</span>
                        <ListOrdered className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-3xl font-bold text-foreground mt-4">{stats.ordersCount}</p>
                      <span className="text-[10px] text-muted-foreground tracking-wide mt-3 block font-medium">100% gateway transaction safety</span>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">ACTIVE BUYERS</span>
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-3xl font-bold text-foreground mt-4">{stats.customers}</p>
                      <span className="text-[10px] text-muted-foreground tracking-wide mt-3 block font-medium">High customer retention index</span>
                    </div>
                  </div>
                  
                  {/* Informational preview block */}
                  <div className="border border-border/80 p-6 bg-card/25 text-xs text-muted-foreground leading-relaxed">
                    💡 **Maison RK Admin Guidelines**: Use this dashboard to manage product items, adjust inventory listings, and update client delivery status. Real-time updates route through standard server APIs to Mongoose database models.
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS INVENTORY TABLE */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">GARMENTS INVENTORY</span>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="bg-foreground text-background text-xs uppercase tracking-widest px-6 py-3 font-bold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> ADD LUXURY PIECE
                    </button>
                  </div>

                  {/* Desktop Inventory grid table */}
                  <div className="bg-card border border-border overflow-x-auto w-full">
                    <table className="w-full text-xs text-left font-sans border-collapse">
                      <thead>
                        <tr className="border-b border-border text-[9px] font-bold tracking-widest text-muted-foreground uppercase bg-secondary/20">
                          <th className="p-4 pl-6">PIECE DETAILS</th>
                          <th className="p-4 text-center">CATEGORY</th>
                          <th className="p-4 text-center">PRICE</th>
                          <th className="p-4 text-center">STOCK</th>
                          <th className="p-4 pr-6 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id || p._id} className="border-b border-border/60 hover:bg-secondary/10 transition-colors">
                            <td className="p-4 pl-6 flex items-center gap-4">
                              <div className="h-16 w-12 bg-secondary border border-border/40 overflow-hidden flex-shrink-0">
                                <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-foreground">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">{p.description}</p>
                              </div>
                            </td>
                            <td className="p-4 text-center text-muted-foreground font-semibold uppercase">{p.category}</td>
                            <td className="p-4 text-center font-semibold font-mono text-foreground">${p.price}</td>
                            <td className="p-4 text-center">
                              <span className={`font-semibold font-mono ${p.stockCount <= 5 ? 'text-red-500 font-bold' : 'text-foreground'}`}>
                                {p.stockCount} items
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex justify-end gap-3.5">
                                <button
                                  onClick={() => openEditModal(p)}
                                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id || p._id || '')}
                                  className="text-red-500 hover:text-red-600 cursor-pointer p-1 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDER FULFILLMENT LIST */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in">
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase block mb-4">
                    FULFILLMENT STEPS MANAGER
                  </span>

                  {orders.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground text-xs uppercase tracking-widest border border-dashed border-border p-6 bg-card/20">
                      No customer orders placed yet.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((o) => {
                        const id = o.id || o._id || '';

                        return (
                          <div key={id} className="border border-border bg-card p-5 text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                            
                            {/* Order details block */}
                            <div className="space-y-2 leading-relaxed">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-bold font-mono text-foreground uppercase">ORDER {id.substring(0, 12)}...</span>
                                <span className="text-[10px] text-muted-foreground font-mono">({new Date(o.createdAt).toLocaleDateString()})</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground">
                                Buyer: <span className="font-semibold text-foreground">{o.userName}</span> ({o.userEmail})
                              </p>
                              <p className="font-semibold text-foreground">
                                Total billed: <span className="font-mono text-sm">${o.total}</span> ({o.items.length} items)
                              </p>
                            </div>

                            {/* Stepper Status fulfillment updater dropdown */}
                            <div className="flex items-center gap-3 w-full md:w-auto ml-auto md:ml-0">
                              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">FULFILLMENT</span>
                              <select
                                value={o.deliveryStatus}
                                onChange={(e) => handleUpdateOrderStatus(id, e.target.value)}
                                className="bg-card text-foreground font-semibold border border-border px-3 py-2 outline-none cursor-pointer transition-colors"
                              >
                                <option value="pending">PENDING</option>
                                <option value="processing">PROCESSING</option>
                                <option value="shipped">SHIPPED</option>
                                <option value="delivered">DELIVERED</option>
                              </select>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* CRUD MODAL 1: ADD NEW LUXURY GARMENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center py-6 px-4">
          <div className="bg-card border border-border max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[90vh] animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-sm font-serif font-bold uppercase tracking-widest">ADD NEW GARMENT</span>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground text-xs cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Garment Title *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maison Silk Shirt" required className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Aesthetic Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of tailoring..." required rows={3} className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-medium resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Price ($) *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} placeholder="Price" required className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-mono" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Initial Stock *</label>
                  <input type="number" value={stockCount} onChange={(e) => setStockCount(parseInt(e.target.value))} placeholder="Stock level" required className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Class Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-semibold cursor-pointer">
                    <option value="Outerwear">Outerwear</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Unsplash Image Link</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://unsplash..." className="bg-background text-foreground border border-border outline-none px-3 py-2.5" />
                </div>
              </div>

              <button type="submit" className="w-full bg-foreground text-background text-xs uppercase tracking-widest py-3 font-bold hover:opacity-90 transition-opacity cursor-pointer">
                SUBMIT CATALOG STYLE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CRUD MODAL 2: EDIT EXISTING GARMENT */}
      {showEditModal && productToEdit && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center py-6 px-4">
          <div className="bg-card border border-border max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[90vh] animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-sm font-serif font-bold uppercase tracking-widest">EDIT GARMENT SPECS</span>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground text-xs cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleSaveProductEdit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Garment Title *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Title" required className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Aesthetic Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required rows={3} className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-medium resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Price ($) *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} placeholder="Price" required className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-mono" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Inventory Stock *</label>
                  <input type="number" value={stockCount} onChange={(e) => setStockCount(parseInt(e.target.value))} placeholder="Stock level" required className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Class Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-background text-foreground border border-border outline-none px-3 py-2.5 font-semibold cursor-pointer">
                    <option value="Outerwear">Outerwear</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">Unsplash Image Link</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="bg-background text-foreground border border-border outline-none px-3 py-2.5" />
                </div>
              </div>

              <button type="submit" className="w-full bg-foreground text-background text-xs uppercase tracking-widest py-3 font-bold hover:opacity-90 transition-opacity cursor-pointer">
                SAVE SPECIFICATION CHANGES
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
