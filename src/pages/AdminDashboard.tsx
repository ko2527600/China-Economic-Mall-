
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Store as StoreIcon, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight,
  Save,
  X,
  Upload,
  LayoutDashboard,
  Search,
  Filter,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { STORES, PRODUCTS } from '../data/mockData';

const AdminDashboard = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const seedData = async () => {
    if (!confirm("This will clear existing data and seed from mock data. Continue?")) return;
    setIsLoading(true);
    try {
        // In a real app we'd have a seed endpoint, here we'll just loop and create
        for (const store of STORES) {
            const { reviews, products, ...storeData } = store as any;
            const res = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(storeData)
            });
            const createdStore = await res.json();
            
            // Add reviews
            if (reviews) {
                for (const review of reviews) {
                    const { id, storeId, ...reviewData } = review as any;
                    // We need an endpoint for reviews or just bypass for now
                    // Actually, let's just make sure the field exists in schema
                }
            }

            const storeProducts = PRODUCTS.filter(p => p.storeId === store.id);
            for (const product of storeProducts) {
                const { id, storeId, ...productData } = product as any;
                await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...productData, storeId: createdStore.id })
                });
            }
        }
        await fetchData();
        alert("Seeding complete!");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'products'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  const [currentEdit, setCurrentEdit] = useState<any>(null);
  const [modalType, setModalType] = useState<'store' | 'product'>('store');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [storesRes, productsRes] = await Promise.all([
        fetch('/api/stores'),
        fetch('/api/products')
      ]);
      const storesData = await storesRes.json();
      const productsData = await productsRes.json();
      setStores(storesData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Add gallery strings if store
    if (modalType === 'store') {
        const galleryInput = (data.gallery as string).split(',').map(s => s.trim()).filter(s => s);
        (data as any).gallery = galleryInput;
        // Basic numbers conversion
        (data as any).rating = parseFloat(data.rating as string) || 0;
        (data as any).isFeatured = (data as any).isFeatured === 'on';
    } else {
        (data as any).isNewArrival = (data as any).isNewArrival === 'on';
    }

    const endpoint = modalType === 'store' ? '/api/stores' : '/api/products';
    const url = currentEdit ? `${endpoint}/${currentEdit.id}` : endpoint;
    const method = currentEdit ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setFeedback({ message: `Successfully ${currentEdit ? 'updated' : 'created'} ${modalType}`, type: 'success' });
        setIsModalOpen(false);
        fetchData();
        setCurrentEdit(null);
      } else {
        setFeedback({ message: 'Failed to save changes', type: 'error' });
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDelete = async (type: 'store' | 'product', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    const endpoint = type === 'store' ? '/api/stores' : '/api/products';
    try {
      const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
        setFeedback({ message: `Deleted ${type}`, type: 'success' });
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
             <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl uppercase tracking-tighter leading-none italic">CEML</h1>
            <p className="text-[10px] font-black uppercase text-secondary tracking-widest">Admin Control</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'stores', icon: StoreIcon, label: 'Manage Stores' },
            { id: 'products', icon: ShoppingBag, label: 'Manage Products' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase text-xs tracking-widest ${
                activeTab === item.id 
                  ? 'bg-accent text-white shadow-xl shadow-accent/20' 
                  : 'text-white/50 hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Quick Summary</p>
          <div className="mt-4 flex flex-col gap-4">
            <div className="bg-white/5 p-4 rounded-2xl">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Total Stores</p>
              <p className="text-2xl font-black">{stores.length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Total Products</p>
              <p className="text-2xl font-black">{products.length}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
               {activeTab === 'overview' && "Dashboard Overview"}
               {activeTab === 'stores' && "Store Inventory"}
               {activeTab === 'products' && "Product Catalog"}
            </h2>
            <p className="text-slate-400 text-sm font-medium">Manage and monitor mall operations in real-time.</p>
          </div>
          
          <div className="flex gap-4">
             <AnimatePresence>
               {feedback && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                 >
                   {feedback.message}
                 </motion.div>
               )}
             </AnimatePresence>
             <button 
              onClick={seedData}
              className="bg-primary text-secondary px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2"
            >
               <LayoutDashboard size={16} /> Seed Mock Data
             </button>
             <button 
              onClick={() => {
                setModalType('store');
                setCurrentEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-white border-2 border-slate-200 text-primary px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-accent transition-all flex items-center gap-2"
            >
               <Plus size={16} /> New Store
             </button>
             <button 
              onClick={() => {
                setModalType('product');
                setCurrentEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-accent text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-all flex items-center gap-2"
            >
               <Plus size={16} /> New Product
             </button>
          </div>
        </header>

        {activeTab === 'overview' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <StoreIcon className="text-accent mb-4" size={32} />
                <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-1">Active Stores</h3>
                <p className="text-4xl font-black italic">{stores.length}</p>
                <div className="h-1 w-12 bg-accent mt-4 rounded-full"></div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <ShoppingBag className="text-secondary mb-4" size={32} />
                <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-1">Active Products</h3>
                <p className="text-4xl font-black italic">{products.length}</p>
                <div className="h-1 w-12 bg-secondary mt-4 rounded-full"></div>
              </div>
              <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl">
                <LayoutDashboard className="text-accent mb-4" size={32} />
                <h3 className="font-black uppercase tracking-widest text-xs text-white/50 mb-1">System Status</h3>
                <p className="text-2xl font-black uppercase tracking-tighter">Connected</p>
                <p className="text-[10px] font-black uppercase text-accent tracking-widest mt-2">Database: Prisma/PostgreSQL</p>
              </div>
           </div>
        )}

        {activeTab === 'stores' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Store</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={store.logo || store.image} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                          <div>
                            <p className="font-black uppercase tracking-tight">{store.name}</p>
                            <p className="text-xs text-slate-400">{store.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                           {store.category}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         {store.isFeatured ? (
                            <span className="text-accent flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                              <Star size={12} fill="currentColor" /> Featured
                            </span>
                         ) : (
                            <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Standard</span>
                         )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                           <button 
                            onClick={() => {
                              setModalType('store');
                              setCurrentEdit(store);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-accent transition-colors"
                           >
                            <Edit3 size={18} />
                           </button>
                           <button 
                            onClick={() => handleDelete('store', store.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                           >
                            <Trash2 size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Store</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                          <div>
                            <p className="font-black uppercase tracking-tight">{product.name}</p>
                            <p className="text-xs text-slate-400">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="font-black text-accent">{product.price}</span>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-xs font-black uppercase tracking-widest text-primary">{product.store?.name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                           <button 
                            onClick={() => {
                              setModalType('product');
                              setCurrentEdit(product);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-accent transition-colors"
                           >
                            <Edit3 size={18} />
                           </button>
                           <button 
                            onClick={() => handleDelete('product', product.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                           >
                            <Trash2 size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}
      </main>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-50 p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                    {currentEdit ? 'Edit' : 'Create New'} {modalType === 'store' ? 'Store' : 'Product'}
                  </h3>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mt-1">Fill in the details below</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modalType === 'store' ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Store Name</label>
                        <input name="name" required defaultValue={currentEdit?.name} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                        <select name="category" defaultValue={currentEdit?.category || 'Electronics'} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold appearance-none">
                           <option>Electronics</option>
                           <option>Fashion</option>
                           <option>Household</option>
                           <option>Groceries</option>
                           <option>Furniture</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                        <textarea name="description" defaultValue={currentEdit?.description} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold min-h-[100px]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Logo URL</label>
                        <input name="logo" defaultValue={currentEdit?.logo} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Main Image URL</label>
                        <input name="image" defaultValue={currentEdit?.image} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Location</label>
                        <input name="location" defaultValue={currentEdit?.location} placeholder="e.g. Ground Floor, Shop 12" className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone</label>
                        <input name="phone" defaultValue={currentEdit?.phone} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Gallery (Comma separated URLs)</label>
                        <input name="gallery" defaultValue={currentEdit?.gallery?.join(', ')} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Operating Hours</label>
                        <input name="hours" defaultValue={currentEdit?.hours} placeholder="8:00 AM - 10:00 PM" className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex items-center gap-4 px-2">
                         <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={currentEdit?.isFeatured} className="w-6 h-6 rounded-lg text-accent focus:ring-accent accent-accent" />
                         <label htmlFor="isFeatured" className="text-xs font-black uppercase tracking-widest text-primary">Feature this store on home page</label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Product Name</label>
                        <input name="name" required defaultValue={currentEdit?.name} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Price (e.g. GHS 120)</label>
                        <input name="price" required defaultValue={currentEdit?.price} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Store</label>
                        <select name="storeId" required defaultValue={currentEdit?.storeId} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold appearance-none">
                           {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                        <select name="category" defaultValue={currentEdit?.category || 'Electronics'} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold appearance-none">
                           <option>Electronics</option>
                           <option>Fashion</option>
                           <option>Household</option>
                           <option>Groceries</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Image URL</label>
                        <input name="image" required defaultValue={currentEdit?.image} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                        <textarea name="description" defaultValue={currentEdit?.description} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold min-h-[80px]" />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-12">
                   <button type="submit" className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95">
                      <Save size={20} className="text-secondary" /> Save Changes
                   </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
