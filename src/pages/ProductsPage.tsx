import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, ShoppingCart, Tag, ChevronRight, Package, Grid, List, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Category } from '../types';

const CATEGORIES: Category[] = [
  'Household', 'Electronics', 'Bags & Luggage', 'Furniture', 
  'Groceries', 'Kitchenware', 'Fashion'
];

const ProductsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, storesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/stores')
        ]);
        const pData = await productsRes.json();
        const sData = await storesRes.json();
        setProducts(pData);
        setStores(sData);
      } catch (error) {
        console.error("Failed to fetch products page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, products]);

  return (
    <div className="flex flex-col gap-8 py-10 px-6 max-w-7xl mx-auto w-full pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-sm font-black uppercase text-slate-400 tracking-widest">{t('home.shopCatalog')}</h1>
           <h2 className="text-4xl font-black uppercase tracking-tight">{t('products.title')}</h2>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
           <button 
             onClick={() => setViewMode('grid')}
             className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <Grid size={18} />
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-accent' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <List size={18} />
           </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder={t('products.searchPlaceholder')} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-16 pl-14 pr-6 bg-white rounded-2xl border-2 border-slate-100 focus:border-accent focus:ring-0 outline-none transition-all shadow-sm font-medium"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        </div>
        <button className="h-16 px-8 bg-slate-900 border-none rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95">
          <Filter size={20} />
          <span>{t('products.sortBy')}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-6 py-3 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
            selectedCategory === 'All' 
              ? 'bg-accent text-white shadow-xl shadow-accent/20' 
              : 'bg-white text-slate-500 border border-slate-200 hover:border-accent'
          }`}
        >
          {t('products.allProducts')}
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedCategory === cat 
                ? 'bg-accent text-white shadow-xl shadow-accent/20' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-accent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, i) => {
              const store = stores.find(s => s.id === product.storeId);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="geometric-card flex flex-col group p-2 hover:border-accent interactive-hover"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {product.isNewArrival && (
                       <div className="absolute top-3 left-3 bg-secondary text-primary font-black text-[10px] px-2 py-0.5 rounded-lg shadow-sm uppercase italic">
                          {t('products.newArrivals')}
                       </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                       <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-accent shadow-lg hover:bg-accent hover:text-white transition-all">
                          <ShoppingCart size={18} />
                       </button>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="font-black text-sm uppercase tracking-tight mb-2 line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-lg font-black text-primary">{product.price}</p>
                    </div>
                    {store && (
                      <Link to={`/stores/${store.id}`} className="flex items-center gap-2 pt-3 border-t border-slate-50">
                         <img src={store.logo} alt="" className="w-5 h-5 rounded-md object-cover border border-slate-100" />
                         <span className="text-[10px] font-black uppercase text-slate-500 hover:text-accent truncate">{store.name}</span>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
           {filteredProducts.map((product, i) => {
              const store = stores.find(s => s.id === product.storeId);
              return (
                <Link 
                  key={product.id}
                  to={`/stores/${product.storeId}`}
                  className="bg-white p-4 geometric-card flex items-center gap-6 group hover:border-accent"
                >
                   <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="badge-promo">{product.category}</span>
                         {product.isNewArrival && <span className="bg-secondary text-primary font-black text-[9px] px-2 py-0.5 rounded-md uppercase">{t('products.newArrivals')}</span>}
                      </div>
                      <h3 className="font-black text-lg uppercase tracking-tight">{product.name}</h3>
                      <p className="text-secondary font-black text-xl">{product.price}</p>
                   </div>
                   <div className="hidden sm:flex flex-col items-end gap-2 text-right">
                      {store && (
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase">{t('products.allProducts')}</span>
                           <span className="text-xs font-black text-primary uppercase">{store.name}</span>
                           <img src={store.logo} alt="" className="w-6 h-6 rounded-lg object-cover" />
                        </div>
                      )}
                      <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                         {t('stores.viewStore')}
                      </button>
                   </div>
                   <ChevronRight className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </Link>
              );
           })}
        </div>
      )}

      {filteredProducts.length === 0 && (
         <div className="py-20 text-center">
            <Package className="mx-auto text-slate-200 mb-4" size={64} />
            <h3 className="text-xl font-black uppercase text-slate-800">{t('products.noProducts')}</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">{t('products.noProductsSub')}</p>
         </div>
      )}
    </div>
  );
};

export default ProductsPage;
