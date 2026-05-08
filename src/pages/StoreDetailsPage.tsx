import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, Heart, Share2, MapPin, Clock, Phone, 
  Star, MessageSquare, ThumbsUp, MoreHorizontal, ShoppingBag,
  ShieldCheck, X, Image as ImageIcon, Camera, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const isStoreOpen = (hoursString: string) => {
  if (!hoursString) return true;
  try {
    const [start, end] = hoursString.split(' - ');
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + (minutes || 0);
    };

    const startTime = parseTime(start);
    const endTime = parseTime(end);

    return currentTime >= startTime && currentTime <= endTime;
  } catch (e) {
    return true;
  }
};

const StoreDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/stores');
        const stores = await res.json();
        const found = stores.find((s: any) => s.id === id);
        
        if (found) {
          setStore(found);
          setRecommendations(stores.filter((s: any) => s.category === found.category && s.id !== found.id).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch store details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{t('storeDetails.storeNotFound')}</h2>
        <p className="text-gray-500 mb-8">{t('storeDetails.storeNotFoundDesc')}</p>
        <button onClick={() => navigate('/stores')} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold">
          {t('storeDetails.backToDirectory')}
        </button>
      </div>
    );
  }

  const isOpen = isStoreOpen(store.hours);
  const storeProducts = store.products || [];

  return (
    <div className="pb-20">
      {/* Header Image */}
      <div className="relative h-[300px] md:h-[450px]">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-accent transition-colors border border-white/20 shadow-xl"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute top-6 right-6 flex gap-3">
          <button 
            onClick={() => setIsFavorited(!isFavorited)}
            className={`w-12 h-12 backdrop-blur-md rounded-xl flex items-center justify-center transition-all border border-white/20 shadow-xl ${isFavorited ? 'bg-accent text-white border-accent scale-110' : 'bg-white/20 text-white hover:bg-white/40'}`}
          >
            <Heart size={22} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
          <button className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center border border-white/20 shadow-xl hover:bg-white/40">
            <Share2 size={22} />
          </button>
        </div>

        <div className="absolute bottom-12 left-6 right-6 max-w-4xl mx-auto">
           <div className="flex items-end gap-6">
              <div className="relative">
                <img src={store.logo} alt={store.name} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-secondary shadow-2xl object-cover bg-white" />
                <div className="absolute -bottom-2 -right-2 bg-accent text-white p-2 rounded-xl shadow-lg">
                   <ShieldCheck size={20} />
                </div>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="badge-promo shadow-sm">
                    {store.category} {t('storeDetails.storeCategory')}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg border ${isOpen ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
                    {isOpen ? t('storeDetails.openNow') : t('storeDetails.closed')}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-none uppercase tracking-tighter shadow-text">{store.name}</h1>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 flex flex-col gap-10">
          <section>
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4">{t('storeDetails.storeOverview')}</h2>
            <p className="text-slate-600 leading-relaxed text-lg font-medium italic border-l-4 border-yellow-400 pl-6">
              "{store.description}"
            </p>
          </section>

          {/* Store Gallery */}
          {store.gallery && store.gallery.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                   <Camera size={14} className="text-accent" /> {t('storeDetails.storeGallery')}
                </h2>
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{store.gallery.length} {t('storeDetails.photos')}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {store.gallery.map((img, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedImage(img)}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-100"
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ImageIcon className="text-white" size={24} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Products Sold */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                 <ShoppingBag size={14} className="text-accent" /> {t('storeDetails.storeInventory')}
              </h2>
              <Link to="/products" className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline">{t('storeDetails.mallCatalog')}</Link>
            </div>
            {storeProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {storeProducts.map(product => (
                  <div key={product.id} className="bg-white p-3 rounded-2xl border-2 border-slate-50 flex items-center gap-4 group hover:border-accent transition-colors">
                     <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[10px] uppercase tracking-tight truncate mb-1">{product.name}</h3>
                        <p className="text-sm font-black text-primary">{product.price}</p>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 p-8 rounded-3xl text-center border-2 border-dashed border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('storeDetails.inventoryProgress')}</p>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-slate-50 p-6 rounded-3xl shadow-sm hover:border-accent hover:bg-accent/5 transition-all group">
               <div className="flex items-center gap-2 text-accent font-black text-xl mb-2 group-hover:scale-110 transition-transform">
                  <Star size={24} strokeWidth={2.5} className="fill-accent" />
                  <span>{store.rating}</span>
               </div>
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{t('storeDetails.averageRating')}</span>
            </div>
            <div className="bg-white border-2 border-slate-50 p-6 rounded-3xl shadow-sm hover:border-blue-600 hover:bg-blue-50 transition-all group">
               <div className="flex items-center gap-2 text-blue-600 font-black text-xl mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} strokeWidth={2.5} />
                  <span>{t('storeDetails.verified')}</span>
               </div>
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">DARKUMAN BRANCH</span>
            </div>
            <div className="bg-white border-2 border-slate-50 p-6 rounded-3xl shadow-sm hover:border-green-600 hover:bg-green-50 transition-all group">
               <div className="flex items-center gap-2 text-green-600 font-black text-xl mb-2 group-hover:scale-110 transition-transform">
                  <ThumbsUp size={24} strokeWidth={2.5} />
                  <span>95%</span>
               </div>
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{t('storeDetails.recommended')}</span>
            </div>
          </section>

          {/* Location Map Placeholder */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest">{t('storeDetails.locationDirections')}</h2>
            </div>
            <div className="bg-slate-100 h-64 rounded-[2.5rem] relative overflow-hidden group border-4 border-white shadow-xl">
               <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&fit=crop" 
                alt="Map" 
                className="w-full h-full object-cover brightness-90 group-hover:scale-110 transition-transform duration-1000" 
              />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary p-6 rounded-3xl shadow-2xl flex items-center gap-4 text-white border border-white/20">
                     <div className="bg-secondary p-3 rounded-2xl text-primary shadow-inner">
                        <MapPin size={28} />
                     </div>
                     <div>
                        <p className="font-black text-lg leading-tight uppercase tracking-tight">{store.location}</p>
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">China Economic Mall</p>
                     </div>
                  </div>
               </div>
            </div>
            <button className="mt-6 w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
               {t('storeDetails.openInMaps')}
            </button>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                {t('storeDetails.customerFeedback')}
                <span className="text-xs font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full">{store.reviews.length}</span>
              </h2>
              <button className="text-accent text-xs font-black uppercase tracking-widest hover:underline">{t('storeDetails.writeReview')}</button>
            </div>
            
            <div className="flex flex-col gap-8">
              {store.reviews.length > 0 ? store.reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 italic">
                           {review.userName.charAt(0)}
                        </div>
                        <div>
                           <p className="font-black text-sm uppercase tracking-tight">{review.userName}</p>
                           <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded-lg">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={14} className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200"} />
                        ))}
                     </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
                </div>
              )) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-[2.5rem] text-center">
                   <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
                   <p className="font-black text-slate-800 uppercase tracking-tight text-xl">{t('storeDetails.noReviews')}</p>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{t('storeDetails.noReviewsSub')}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8 sticky top-24">
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                <Clock size={14} /> {t('storeDetails.openingHours')}
              </h3>
              <div className="flex items-center justify-between mb-1">
                 <p className="font-black text-xl tracking-tight uppercase">{store.hours}</p>
                 <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {isOpen ? t('storeDetails.open') : t('storeDetails.closedLabel')}
                 </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">{t('storeDetails.open7Days')}</p>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                <Phone size={14} /> {t('storeDetails.directLine')}
              </h3>
              <p className="font-black text-xl tracking-tight uppercase">{store.phone}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <button className="w-full bg-accent text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-accent/30 hover:scale-[1.03] transition-all active:scale-[0.97] italic">
                {t('storeDetails.connectWhatsApp')}
              </button>
              <button className="w-full bg-white border-2 border-slate-900 text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all">
                {t('storeDetails.addToFavorites')}
              </button>
            </div>
          </div>

          {/* Recommendations Filtered by Category */}
          {recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">{t('storeDetails.similarStores')}</h3>
              <div className="flex flex-col gap-3">
                {recommendations.map(item => (
                  <Link key={item.id} to={`/stores/${item.id}`} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow group">
                    <img src={item.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{item.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Star size={10} className="fill-yellow-500 text-yellow-500" />
                        <span>{item.rating}</span>
                        <span>•</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.button 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center border border-white/10 transition-colors"
            >
              <X size={24} />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl w-full max-h-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Fullscreen" className="w-full h-full object-contain bg-slate-950" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreDetailsPage;
