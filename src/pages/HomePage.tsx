
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Star, TrendingUp, Gift, MapPin, Award, ShoppingCart, Play, Camera, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROMOTIONS } from '../data/mockData';

const HomePage = () => {
  const [dbStores, setDbStores] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👔' },
    { name: 'Groceries', icon: '🍎' },
    { name: 'Home', icon: '🏠' },
    { name: 'Kitchen', icon: '🍳' },
    { name: 'Furniture', icon: '🛋️' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, productsRes] = await Promise.all([
          fetch('/api/stores'),
          fetch('/api/products')
        ]);
        const storesData = await storesRes.json();
        const productsData = await productsRes.json();
        setDbStores(storesData);
        setDbProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredStores = dbStores.filter(s => s.isFeatured).slice(0, 3);
  const activePromos = PROMOTIONS.slice(0, 2);

  const [currentHeroImage, setCurrentHeroImage] = React.useState(0);
  const heroImages = [
    '/photo_6041962101854637539_y.jpg',
    '/photo_6041962101854637529_y.jpg'
  ];

  const mallVideos = [
    { id: 'v1', src: '/document_6041962101394643501.mp4', title: 'Mall Walkthrough' },
    { id: 'v2', src: '/document_6041962101394643503.mp4', title: 'Store Highlights' },
    { id: 'v3', src: '/document_6041962101394643503-1.mp4', title: 'Customer Experience' }
  ];

  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden pt-12 md:pt-0">
        {/* Background Atmosphere */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-transparent via-gold-accent/40 to-transparent z-20 hidden md:block" />
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(circle, var(--color-gold-accent) 0%, transparent 70%)' }}
          />
          <div 
            className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px]"
            style={{ background: 'radial-gradient(circle, var(--color-action-red) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col"
          >
            <span className="cem-section-label mb-4">Accra's Premier Trade Destination</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-6 uppercase italic">
              China <br/>
              <span className="cem-gradient-text uppercase">Economic</span> <br/>
              Mall
            </h1>
            <div className="cem-divider mb-8" />
            
            <p className="text-muted-text text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10">
              Hundreds of stores. Unbeatable prices. From cutting-edge electronics to high-street fashion — discover everything you need all under one roof.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link to="/stores" className="cem-btn-primary flex items-center gap-3 italic">
                Explore Stores <ChevronRight size={18} />
              </Link>
              <Link to="/promotions" className="cem-btn-outline flex items-center gap-3 italic">
                View Deals <TrendingUp size={18} />
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 md:gap-12">
              {[
                { val: '500+', lab: 'Stores' },
                { val: '10K+', lab: 'Products' },
                { val: 'Daily', lab: 'Hot Deals' }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.lab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-8 md:gap-12"
                >
                  <div className="flex flex-col">
                    <span className="font-display text-3xl md:text-4xl text-light-gold font-bold">{stat.val}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-text font-black mt-1">{stat.lab}</span>
                  </div>
                  {i < 2 && <div className="h-10 w-[1px] bg-border-color" />}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Image Slider */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="cem-card overflow-hidden relative group" style={{ boxShadow: '0 0 60px rgba(201,168,76,0.08)' }}>
              <div className="aspect-[4/5] md:aspect-[4/4] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentHeroImage}
                    src={heroImages[currentHeroImage]} 
                    alt="China Economics Mall" 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Slider Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <span className="cem-badge-gold">Now Open</span>
                <span className="text-[10px] text-body-text/60 font-black uppercase tracking-widest bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  Darkuman circle
                </span>
              </div>

              {/* Progress dots inside card */}
              <div className="absolute bottom-6 right-6 flex gap-1.5">
                {heroImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentHeroImage ? 'w-6 bg-gold-accent' : 'w-1.5 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating decoration */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border border-muted-gold/20 rounded-xl hidden md:block" />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase text-accent tracking-[0.4em] mb-1">Explore Departments</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight">Mall <span className="text-secondary">Directory</span></h3>
          </div>
          <Link to="/stores" className="text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:underline bg-slate-50 px-4 py-2 rounded-xl transition-all hover:bg-slate-100">
            View All Stores <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-sm group-hover:border-accent group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/5">
                <span className="group-hover:scale-110 transition-transform duration-300 transform-gpu">{cat.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-accent group-hover:tracking-widest transition-all">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <ShoppingCart size={20} className="text-accent" />
            Trending Products
          </h2>
          <Link to="/products" className="text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
            Shop Catalog <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-2xl" />
            ))
          ) : dbProducts.slice(0, 4).map((product) => (
             <Link key={product.id} to="/products" className="geometric-card flex flex-col group p-2 hover:border-accent interactive-hover">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-secondary text-primary font-black text-[8px] rounded uppercase">Hot</div>
                </div>
                <div className="px-2 pb-2">
                   <h3 className="font-black text-xs uppercase tracking-tight mb-1 truncate group-hover:text-accent transition-colors">{product.name}</h3>
                   <div className="flex items-center justify-between">
                      <p className="text-primary font-black text-sm">{product.price}</p>
                      <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-accent group-hover:text-white transition-all">
                        <ShoppingCart size={14} strokeWidth={2.5} />
                      </div>
                   </div>
                </div>
             </Link>
          ))}
        </div>
      </section>

      {/* Promotions Slider */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <TrendingUp size={20} className="text-accent" />
            Mid-Year Mega Sale
          </h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
          {activePromos.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 w-[320px] md:w-[500px] geometric-card overflow-hidden group border-4 border-slate-100">
              <div className="relative aspect-[16/9]">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-lg">Promotion</span>
                </div>
              </div>
              <div className="p-6 bg-secondary relative">
                <div className="absolute -top-12 right-6 w-24 h-24 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center border-4 border-accent rotate-6 group-hover:rotate-0 transition-transform">
                  <span className="text-[10px] font-black text-accent uppercase">SAVE</span>
                  <span className="text-3xl font-black text-accent tracking-tighter">40%</span>
                </div>
                <h3 className="text-primary font-black text-xl mb-1 uppercase tracking-tight">{promo.title}</h3>
                <p className="text-primary/70 text-sm font-medium pr-16">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mall Spotlight (Videos) */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase text-accent tracking-[0.4em] mb-1">Live from Darkuman</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              Mall <span className="text-secondary">Spotlight</span>
              <Camera size={20} className="text-accent" />
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mallVideos.map((video) => (
            <motion.div 
              key={video.id}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[9/16] md:aspect-video rounded-[2.5rem] overflow-hidden group cursor-pointer border-4 border-slate-100 shadow-xl"
              onClick={() => setActiveVideo(video.src)}
            >
              <video 
                src={video.src} 
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-accent group-hover:border-accent transition-all ring-8 ring-white/10 group-hover:ring-accent/20">
                  <Play size={24} className="text-white fill-white translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-black uppercase tracking-widest text-[10px] bg-slate-900/60 backdrop-blur-sm w-fit px-3 py-1 rounded-full mb-1">Live Scene</p>
                <h4 className="text-white font-black text-xl uppercase tracking-tighter leading-none">{video.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative aspect-[9/16] max-h-full rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                src={activeVideo} 
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 z-10"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Stores */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest">Explore Popular Stores</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
             Array(3).fill(0).map((_, i) => (
               <div key={i} className="aspect-video bg-slate-100 animate-pulse rounded-[2.5rem]" />
             ))
          ) : featuredStores.length > 0 ? (
            featuredStores.map((store) => (
              <Link key={store.id} to={`/stores/${store.id}`} className="geometric-card flex flex-col group p-2 hover:border-accent">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] font-black">{store.rating}</span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-black text-lg leading-tight uppercase tracking-tight group-hover:text-accent transition-colors">{store.name}</h3>
                  <img src={store.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-100 p-0.5" />
                </div>
                <p className="badge-promo w-fit mb-4">{store.category}</p>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-auto border-t border-slate-50 pt-3">
                   <MapPin size={14} />
                   <span>{store.location}</span>
                </div>
              </div>
            </Link>
          ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 font-black uppercase tracking-widest bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
               No featured stores yet
            </div>
          )}
        </div>
      </section>

      {/* Loyalty CTA */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="bg-primary border-b-8 border-secondary text-white rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-md">
            <span className="text-secondary font-black text-xs uppercase tracking-[0.3em] mb-4 block">Membership Status</span>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-none uppercase italic">Join Our Gold <br/><span className="text-secondary font-black">Rewards Tier</span></h2>
            <p className="text-white/60 text-sm mb-8 font-medium">Earn point on every purchase and get early access to our major mall event and seasonal sales.</p>
            <Link to="/loyalty" className="bg-accent text-white font-black px-10 py-4 rounded-xl inline-flex items-center gap-3 text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/20 italic">
              Start Earning Points <Gift size={18} />
            </Link>
          </div>
          <div className="relative z-10 w-full md:w-auto flex flex-col items-center">
            <Award className="text-secondary/20 -rotate-12 absolute -z-10" size={300} />
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-center w-full max-w-[280px]">
               <p className="text-4xl font-black text-secondary tracking-tighter mb-1">1,240</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Current Member Pts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
