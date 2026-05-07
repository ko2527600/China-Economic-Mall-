
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
  Star,
  Settings,
  Tag,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { STORES, PRODUCTS } from '../data/mockData';

const ImageUploadField = ({ 
  label, 
  name, 
  defaultValue = '', 
  multiple = false,
  onImagesChange
}: { 
  label: string, 
  name: string, 
  defaultValue?: string | string[], 
  multiple?: boolean,
  onImagesChange?: (urls: string[]) => void
}) => {
  const [previews, setPreviews] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : [])
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.urls) {
        const newUrls = multiple ? [...previews, ...data.urls] : data.urls;
        setPreviews(newUrls);
        if (onImagesChange) onImagesChange(newUrls);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = previews.filter((_, i) => i !== index);
    setPreviews(newUrls);
    if (onImagesChange) onImagesChange(newUrls);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl min-h-[120px]">
        {previews.map((url, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group shadow-md">
            <img src={url} className="w-full h-full object-cover" alt="Preview" />
            <button 
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {(multiple || previews.length === 0) && (
          <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-white transition-all group">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-[8px] font-black uppercase text-slate-400 mt-1">Upload</span>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              multiple={multiple} 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      <input type="hidden" name={name} value={multiple ? previews.join(',') : (previews[0] || '')} />
    </div>
  );
};

const AdminDashboard = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);

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

  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'products' | 'settings' | 'promotions' | 'events'>('overview');
  const [promotions, setPromotions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
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
  const [modalType, setModalType] = useState<'store' | 'product' | 'promotion' | 'event'>('store');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [storesRes, productsRes, configRes, promosRes, eventsRes] = await Promise.all([
        fetch('/api/stores'),
        fetch('/api/products'),
        fetch('/api/config'),
        fetch('/api/promotions'),
        fetch('/api/events')
      ]);
      const storesData = await storesRes.json();
      const productsData = await productsRes.json();
      const configData = await configRes.json();
      const promosData = await promosRes.json();
      const eventsData = await eventsRes.json();
      setStores(storesData);
      setProducts(productsData);
      setConfig(configData);
      setPromotions(promosData);
      setEvents(eventsData);
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
        (data as any).rating = parseFloat(data.rating as string) || 0;
        (data as any).isFeatured = (data as any).isFeatured === 'on';
    } else if (modalType === 'product') {
        (data as any).isNewArrival = (data as any).isNewArrival === 'on';
        
        // Ensure price has the Cedi sign if it's just a number
        if (typeof data.price === 'string' && !data.price.includes('₵')) {
          data.price = `₵${data.price}`;
        }

        // Fix for "Vanishing Images": Ensure only ONE image is saved for updates
        const images = (data.image as string).split(',').filter(s => s);
        if (currentEdit) {
          // If updating, just use the first image in the list to avoid broken mangled URLs
          (data as any).image = images[0] || '';
        } else if (images.length > 1) {
          // BULK UPLOAD LOGIC: Check for multiple images (Only for NEW products)
          try {
            setIsLoading(true);
            for (const imgUrl of images) {
              await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, image: imgUrl })
              });
            }
            setFeedback({ message: `Successfully created ${images.length} products`, type: 'success' });
            setIsModalOpen(false);
            fetchData();
            return;
          } catch (error) {
            console.error("Bulk upload failed:", error);
            setFeedback({ message: 'Bulk upload failed', type: 'error' });
            return;
          } finally {
            setIsLoading(false);
          }
        }
    } else if (modalType === 'promotion') {
        (data as any).expirationDate = new Date(data.expirationDate as string).toISOString();
    } else if (modalType === 'event') {
        (data as any).date = new Date(data.date as string).toISOString();
    }

    const endpointMap: Record<string, string> = {
      store: '/api/stores',
      product: '/api/products',
      promotion: '/api/promotions',
      event: '/api/events'
    };
    const endpoint = endpointMap[modalType];
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

  const handleDelete = async (type: 'store' | 'product' | 'promotion' | 'event', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    const endpointMap: Record<string, string> = {
      store: '/api/stores',
      product: '/api/products',
      promotion: '/api/promotions',
      event: '/api/events'
    };
    const endpoint = endpointMap[type];
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

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Handle array conversion for heroImages if needed
    if ((data as any).heroImages) {
      (data as any).heroImages = (data as any).heroImages.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setFeedback({ message: 'Site configuration updated', type: 'success' });
        fetchData();
      } else {
        setFeedback({ message: 'Failed to update configuration', type: 'error' });
      }
    } catch (error) {
      console.error("Error updating config:", error);
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
      <aside className="w-full md:w-64 bg-primary text-white p-6 flex flex-col gap-8 overflow-y-auto">
        <div className="flex items-center gap-3 group cursor-pointer mb-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-white/10">
            <span className="font-display font-black text-2xl text-primary leading-none translate-y-[-1px]">C</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-white leading-tight">Admin Console</span>
            <span className="text-[9px] font-body font-black uppercase tracking-[0.3em] text-secondary">Economic Mall</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'stores', icon: StoreIcon, label: 'Manage Stores' },
            { id: 'products', icon: ShoppingBag, label: 'Manage Products' },
            { id: 'promotions', icon: Tag, label: 'Manage Deals' },
            { id: 'events', icon: Sparkles, label: 'Manage Events' },
            { id: 'settings', icon: Settings, label: 'Site Settings' },
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
               {activeTab === 'promotions' && "Store Promotions"}
               {activeTab === 'events' && "Mall Events"}
               {activeTab === 'settings' && "Site Configuration"}
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
              className="bg-white border-2 border-slate-200 text-primary px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
               <LayoutDashboard size={16} /> Seed Data
             </button>
             <button 
              onClick={() => {
                setModalType('store');
                setCurrentEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
            >
               <Plus size={16} /> New Store
             </button>
             <button 
              onClick={() => {
                setModalType('product');
                setCurrentEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-secondary text-primary px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 transition-all flex items-center gap-2"
            >
               <Plus size={16} /> New Product
             </button>
             <button 
              onClick={() => {
                setModalType('promotion');
                setCurrentEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-accent text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2"
            >
               <Plus size={16} /> New Deal
             </button>
             <button 
              onClick={() => {
                setModalType('event');
                setCurrentEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-white border-2 border-slate-900 text-slate-900 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2"
            >
               <Plus size={16} /> New Event
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
                <p className="text-[10px] font-black uppercase text-accent tracking-widest mt-2 italic">Database: Prisma/PostgreSQL</p>
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mt-1 italic">Storage: Cloudinary Persistent</p>
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

        {activeTab === 'promotions' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deal Info</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Store</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expiration</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {promotions.map(promo => (
                    <tr key={promo.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={promo.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">{promo.title}</p>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">{promo.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-black uppercase tracking-tight text-slate-700">{promo.store?.name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-black uppercase tracking-tight text-slate-400">{new Date(promo.expirationDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                          onClick={() => handleDelete('promotion', promo.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                         >
                          <Trash2 size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event Info</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {events.map(event => (
                    <tr key={event.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={event.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">{event.title}</p>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">{event.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-black uppercase tracking-tight text-slate-400">{new Date(event.date).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-black uppercase tracking-tight text-slate-700">{event.location}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                          onClick={() => handleDelete('event', event.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                         >
                          <Trash2 size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'settings' && config && (
          <form onSubmit={handleUpdateConfig} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 max-w-4xl">
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight italic border-b border-slate-100 pb-4">Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Hero Title</label>
                    <input name="heroTitle" defaultValue={config.heroTitle} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Hero Subtitle</label>
                    <input name="heroSubtitle" defaultValue={config.heroSubtitle} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Hero Description</label>
                    <textarea name="heroDescription" defaultValue={config.heroDescription} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold min-h-[100px]" />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField 
                      label="Hero Background Video" 
                      name="heroVideo" 
                      defaultValue={config.heroVideo} 
                    />
                  </div>
                </div>
              </div>

              {/* Promotions Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight italic border-b border-slate-100 pb-4">Promotion Banner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Promo Title</label>
                    <input name="promoTitle" defaultValue={config.promoTitle} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Promo Subtitle</label>
                    <input name="promoSubtitle" defaultValue={config.promoSubtitle} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Promo Discount (e.g. 40%)</label>
                    <input name="promoDiscount" defaultValue={config.promoDiscount} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField 
                      label="Promotion Banner Image" 
                      name="promoImage" 
                      defaultValue={config.promoImage} 
                    />
                  </div>
                </div>
              </div>

              {/* Loyalty Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight italic border-b border-slate-100 pb-4">Loyalty Program</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Loyalty Title</label>
                    <input name="loyaltyTitle" defaultValue={config.loyaltyTitle} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Loyalty Description</label>
                    <textarea name="loyaltyDescription" defaultValue={config.loyaltyDescription} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold min-h-[100px]" />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight italic border-b border-slate-100 pb-4">Contact & Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                    <input name="contactPhone" defaultValue={config.contactPhone} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Opening Hours</label>
                    <input name="openingHours" defaultValue={config.openingHours} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Address</label>
                    <input name="contactAddress" defaultValue={config.contactAddress} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
               <button type="submit" className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95">
                  <Save size={20} className="text-secondary" /> Save Site Settings
               </button>
            </div>
          </form>
        )}
      </main>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-50 p-8 border-b border-slate-100 sticky top-0 z-20 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                    {currentEdit ? 'Edit' : 'Create New'} {
                      modalType === 'store' ? 'Store' : 
                      modalType === 'product' ? 'Product' : 
                      modalType === 'promotion' ? 'Promotion' : 'Event'
                    }
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
                      <ImageUploadField 
                        label="Store Logo" 
                        name="logo" 
                        defaultValue={currentEdit?.logo} 
                      />
                      <ImageUploadField 
                        label="Main Store Image" 
                        name="image" 
                        defaultValue={currentEdit?.image} 
                      />
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Location</label>
                        <input name="location" defaultValue={currentEdit?.location} placeholder="e.g. Ground Floor, Shop 12" className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone</label>
                        <input name="phone" defaultValue={currentEdit?.phone} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="md:col-span-2">
                        <ImageUploadField 
                          label="Store Gallery (Multiple)" 
                          name="gallery" 
                          multiple={true}
                          defaultValue={currentEdit?.gallery} 
                        />
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
                  ) : modalType === 'product' ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Product Name</label>
                        <input name="name" required defaultValue={currentEdit?.name} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Price (e.g. 4,500)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-accent text-lg">₵</span>
                          <input name="price" required defaultValue={currentEdit?.price?.replace('₵', '')} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                        </div>
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
                      <div className="md:col-span-2">
                        <ImageUploadField 
                          label="Product Images (Select multiple for bulk upload)" 
                          name="image" 
                          multiple={true}
                          defaultValue={currentEdit?.image} 
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                        <textarea name="description" defaultValue={currentEdit?.description} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold min-h-[80px]" />
                      </div>
                    </>
                  ) : modalType === 'promotion' ? (
                    <>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Promotion Title</label>
                        <input name="title" required defaultValue={currentEdit?.title} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Target Store</label>
                        <select name="storeId" required defaultValue={currentEdit?.storeId} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold appearance-none">
                           {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Expiration Date</label>
                        <input type="date" name="expirationDate" required defaultValue={currentEdit?.expirationDate ? new Date(currentEdit.expirationDate).toISOString().split('T')[0] : ''} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="md:col-span-2">
                        <ImageUploadField 
                          label="Deal Image" 
                          name="image" 
                          defaultValue={currentEdit?.image} 
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                        <textarea name="description" defaultValue={currentEdit?.description} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold min-h-[80px]" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Event Title</label>
                        <input name="title" required defaultValue={currentEdit?.title} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Event Date</label>
                        <input type="date" name="date" required defaultValue={currentEdit?.date ? new Date(currentEdit.date).toISOString().split('T')[0] : ''} className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Location</label>
                        <input name="location" required defaultValue={currentEdit?.location} placeholder="e.g. Main Atrium" className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" />
                      </div>
                      <div className="md:col-span-2">
                        <ImageUploadField 
                          label="Event Banner" 
                          name="image" 
                          defaultValue={currentEdit?.image} 
                        />
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
