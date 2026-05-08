import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PiMagnifyingGlassDuotone, 
  PiFunnelDuotone, 
  PiStarFill, 
  PiMapPinFill, 
  PiArrowRightBold, 
  PiClockDuotone,
  PiMagnifyingGlassBold
} from 'react-icons/pi';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StoresPage = () => {
  const { t } = useTranslation();
  const categories: string[] = [
    t('stores.categories.electronics'), t('stores.categories.fashion'), t('stores.categories.groceries'), t('stores.categories.household'), t('stores.categories.kitchenware'), t('stores.categories.furniture'), t('stores.categories.appliances'), t('stores.categories.bagsLuggage')
  ];
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(t('stores.categories.all'));

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);

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
      const matchesCategory = selectedCategory === t('stores.categories.all') || store.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, stores]);

  return (
    <div className="flex flex-col gap-10 py-12 px-6 max-w-7xl mx-auto w-full pb-32">
      {/* Header */}
      <div className="flex flex-col">
        <span className="cem-section-label mb-2">{t('stores.sectionLabel')}</span>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4">
          {t('stores.title')}
        </h1>
        <div className="cem-divider" />
        <p className="text-muted-text max-w-2xl mt-6 text-lg font-medium leading-relaxed">
          {t('stores.subtitle')}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <input 
            type="text" 
            placeholder={t('stores.searchPlaceholder')} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-2xl w-full h-16 pl-14 pr-6 outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-lg shadow-inner"
          />
          <PiMagnifyingGlassBold className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-all duration-300" size={24} />
        </div>
        <button className="h-16 px-10 rounded-2xl border-2 border-slate-100 text-primary font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 hover:border-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95">
          <PiFunnelDuotone size={20} />
          {t('stores.filters')}
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap md:flex-nowrap gap-3 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedCategory(t('stores.categories.all'))}
          className={`cem-pill whitespace-nowrap ${selectedCategory === t('stores.categories.all') ? 'active' : ''}`}
        >
          {t('stores.allStores')}
        </button>
        {categories.map(cat => (
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
                  <div className="relative aspect-video overflow-hidden bg-slate-50">
                    <img 
                      src={store.image} 
                      alt={store.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-black/5 shadow-lg">
                      <PiStarFill size={12} className="text-secondary" />
                      <span className="text-[10px] font-black text-primary">{store.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-primary mb-1 group-hover:text-primary transition-colors tracking-tight">
                          {store.name}
                        </h3>
                        <span className="cem-badge-gold">{store.category}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-color bg-slate-50 p-1 flex-shrink-0">
                        <img src={store.logo} alt="" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <p className="text-sm text-muted-text line-clamp-2 mb-6 font-medium leading-relaxed">
                      {store.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-text/60 pt-4 border-t border-border-color">
                        <div className="flex items-center gap-2">
                          <PiMapPinFill size={16} className="text-primary" />
                          <span>{store.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PiClockDuotone size={16} className="text-muted-text" />
                          <span>{store.hours}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/stores/${store.id}`} 
                        className="cem-btn-outline w-full flex items-center justify-center gap-2 text-xs italic"
                      >
                        {t('stores.viewStore')} <PiArrowRightBold size={16} />
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
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-primary border border-primary/10 mb-4">
            <PiMagnifyingGlassDuotone size={40} />
          </div>
          <div>
            <h3 className="font-display text-2xl text-body-text mb-2 tracking-tight">{t('stores.noStoresFound')}</h3>
            <p className="text-muted-text max-w-sm mx-auto font-medium">{t('stores.noStoresSubtitle')}</p>
          </div>
          <button 
            onClick={() => {setSearch(''); setSelectedCategory(t('stores.categories.all'));}}
            className="cem-btn-outline px-10 italic"
          >
            {t('stores.clearAllFilters')}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StoresPage;
