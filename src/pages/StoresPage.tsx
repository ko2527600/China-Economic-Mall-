
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, MapPin, ChevronRight, Clock } from 'lucide-react';
import { Category } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: Category[] = [
  'Electronics', 'Fashion', 'Groceries', 'Household', 'Kitchenware', 'Furniture', 'Appliances', 'Bags & Luggage'
];

const StoresPage = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('/api/stores');
        const data = await res.json();
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStores();
  }, []);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) || 
                          store.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, stores]);

  return (
    <div className="flex flex-col gap-10 py-12 px-6 max-w-7xl mx-auto w-full pb-32">
      {/* Header */}
      <div className="flex flex-col">
        <span className="cem-section-label mb-2">Browse & Discover</span>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4">
          Our <span className="cem-gradient-text uppercase">Stores</span>
        </h1>
        <div className="cem-divider" />
        <p className="text-muted-text max-w-2xl mt-6 text-lg font-medium leading-relaxed">
          Navigate through our diverse collection of premium outlets and local favorites. Quality and affordability in every corner of the mall.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <input 
            type="text" 
            placeholder="Search stores, brands, or products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cem-input w-full h-14 pl-12 pr-6 group-focus-within:shadow-[0_0_20px_rgba(201,168,76,0.1)]"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-gold-accent transition-colors" size={20} />
        </div>
        <button className="h-14 px-8 cem-btn-outline flex items-center justify-center gap-3">
          <Filter size={18} />
          <span className="text-xs uppercase tracking-widest font-bold">Filters</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap md:flex-nowrap gap-3 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`cem-pill whitespace-nowrap ${selectedCategory === 'All' ? 'active' : ''}`}
        >
          All Stores
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`cem-pill whitespace-nowrap ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-card-surface/50 animate-pulse rounded-xl border border-border-color" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredStores.map((store, i) => (
              <motion.div
                key={store.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="cem-card h-full flex flex-col group overflow-hidden">
                  <div className="relative aspect-video overflow-hidden bg-primary-bg">
                    <img 
                      src={store.image} 
                      alt={store.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4 bg-primary-bg/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/5 shadow-lg">
                      <Star size={12} className="text-gold-accent fill-gold-accent" />
                      <span className="text-[10px] font-black text-body-text">{store.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-xl text-body-text mb-1 group-hover:text-gold-accent transition-colors tracking-tight">
                          {store.name}
                        </h3>
                        <span className="cem-badge-gold">{store.category}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-color bg-primary-bg p-1 flex-shrink-0">
                        <img src={store.logo} alt="" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <p className="text-sm text-muted-text line-clamp-2 mb-6 font-medium leading-relaxed">
                      {store.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-text/60">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gold-accent" />
                          <span>{store.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-muted-gold" />
                          <span>{store.hours}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/stores/${store.id}`} 
                        className="cem-btn-outline w-full flex items-center justify-center gap-2 text-xs italic"
                      >
                        View Store <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredStores.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-elevated-surface rounded-full flex items-center justify-center text-muted-gold border border-muted-gold/20 mb-4">
            <Search size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display text-2xl text-body-text mb-2 tracking-tight">No stores found</h3>
            <p className="text-muted-text max-w-sm mx-auto font-medium">We couldn't find any results matching your search criteria. Try a different category or store name.</p>
          </div>
          <button 
            onClick={() => {setSearch(''); setSelectedCategory('All');}}
            className="cem-btn-outline px-10 italic"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StoresPage;
