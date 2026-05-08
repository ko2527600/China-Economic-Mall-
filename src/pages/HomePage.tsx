import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiDeviceMobile,
  PiTShirt,
  PiBasket,
  PiHouse,
  PiCookingPot,
  PiArmchair,
  PiArrowRightBold,
  PiTrendUpBold,
  PiGiftBold,
  PiMapPinFill,
  PiShoppingCartBold,
  PiPlayFill,
  PiCameraBold,
  PiXBold,
  PiStarFill,
  PiMedalBold,
  PiMagnifyingGlassBold
} from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { PROMOTIONS } from '../data/mockData';

const Typewriter = ({ text, delay = 100 }: { text: string, delay?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const loopTimeout = setTimeout(() => {
        setCurrentText('');
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(loopTimeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span style={{ whiteSpace: 'pre-line' }} className={currentIndex < text.length ? 'typewriter-text' : ''}>
      {currentText}
    </span>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const [dbStores, setDbStores] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { name: t('home.categories.electronics'), icon: PiDeviceMobile },
    { name: t('home.categories.fashion'), icon: PiTShirt },
    { name: t('home.categories.groceries'), icon: PiBasket },
    { name: t('home.categories.home'), icon: PiHouse },
    { name: t('home.categories.kitchen'), icon: PiCookingPot },
    { name: t('home.categories.furniture'), icon: PiArmchair },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, productsRes, configRes] = await Promise.all([
          fetch('/api/stores'),
          fetch('/api/products'),
          fetch('/api/config')
        ]);
        const storesData = await storesRes.json();
        const productsData = await productsRes.json();
        const configData = await configRes.json();
        setDbStores(storesData);
        setDbProducts(productsData);
        setConfig(configData);
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
    '/photo_6041962101854637592_y.jpg',
    '/photo_6041962101854637594_y.jpg',
    '/photo_6041962101854637595_y.jpg',
    '/photo_6041962101854637596_y.jpg'
  ];

  const mallVideos = [
    { id: 'v1', src: '/Mall 1.mp4', title: t('home.videos.grandTour') },
    { id: 'v2', src: '/Mall 2.mp4', title: t('home.videos.luxuryAisles') },
    { id: 'v3', src: '/Mall 3.mp4', title: t('home.videos.modernFacade') },
    { id: 'v4', src: '/Mall 4.mp4', title: t('home.videos.eliteStores') },
    { id: 'v5', src: '/Mall 5.mp4', title: t('home.videos.shoppingVibes') }
  ];

  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden pt-12 md:pt-0">
        {/* Background Atmosphere */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-transparent via-primary/40 to-transparent z-20 hidden md:block" />

        {/* Video Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <video
            src={config?.heroVideo || "/Mall 1.mp4"}
            autoPlay
            muted
            loop
            playsInline
            poster="/photo_6041962101854637592_y.jpg"
            className="w-full h-full object-cover scale-110 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
        </div>

        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
            style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full opacity-5 blur-[100px]"
            style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }}
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
            <span className="cem-section-label mb-4">{config?.heroSubtitle || t('home.sectionLabel')}</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[1.1] tracking-tighter mb-6 uppercase italic min-h-[3em]">
              <Typewriter
                text={config?.heroTitle ? config.heroTitle.replace(/ /g, '\n') : t('home.heroTitle')}
                delay={150}
              />
            </h1>
            <div className="cem-divider mb-8" />

            <p className="text-muted-text text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10">
              {config?.heroDescription || t('home.earnPoints')}
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link to="/stores" className="cem-btn-primary flex items-center gap-3 italic">
                {t('home.exploreStores')} <PiArrowRightBold size={18} />
              </Link>
              <Link to="/promotions" className="cem-btn-outline flex items-center gap-3 italic">
                {t('home.viewDeals')} <PiTrendUpBold size={18} />
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 md:gap-12">
              {[
                { val: '500+', lab: t('home.stats.stores') },
                { val: '10K+', lab: t('home.stats.products') },
                { val: t('home.stats.daily'), lab: t('home.stats.hotDeals') }
              ].map((stat, i) => (
                <motion.div
                  key={stat.lab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-8 md:gap-12"
                >
                  <div className="flex flex-col">
                    <span className="font-display text-3xl md:text-4xl text-primary font-bold">{stat.val}</span>
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
            <div className="cem-card overflow-hidden relative group shadow-gold">
              <div className="aspect-[4/5] md:aspect-[4/4] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentHeroImage}
                    src={heroImages[currentHeroImage]}
                    alt={t('home.heroAlt')}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>

              {/* Slider Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <span className="cem-badge-gold">{t('home.nowOpen')}</span>
                <span className="text-[10px] text-body-text/60 font-black uppercase tracking-widest bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {t('home.locationBadge')}
                </span>
              </div>

              {/* Progress dots inside card */}
              <div className="absolute bottom-6 right-6 flex gap-1.5">
                {heroImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentHeroImage ? 'w-6 bg-primary' : 'w-1.5 bg-black/10'}`}
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
            <h2 className="text-[10px] font-black uppercase text-gold-accent tracking-[0.4em] mb-1">{t('home.exploreDepartments')}</h2>
            <h3 className="text-3xl font-display font-black uppercase tracking-tight">{t('home.mallDirectory')}</h3>
          </div>
          <Link to="/stores" className="text-gold-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:underline bg-elevated-surface px-6 py-3 rounded-xl transition-all hover:bg-gold-accent/5">
            {t('home.viewAllStores')} <PiArrowRightBold size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-2xl bg-card-surface border border-border-color flex items-center justify-center shadow-sm group-hover:border-gold-accent group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-gold">
                <cat.icon className="text-muted-text group-hover:text-gold-accent group-hover:scale-110 transition-all duration-300 transform-gpu" size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-text group-hover:text-gold-accent group-hover:tracking-widest transition-all">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black uppercase text-muted-text tracking-widest flex items-center gap-3">
            <PiShoppingCartBold size={20} className="text-gold-accent" />
            {t('home.trendingProducts')}
          </h2>
          <Link to="/products" className="text-gold-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
            {t('home.shopCatalog')} <PiArrowRightBold size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-card-surface animate-pulse rounded-2xl" />
            ))
          ) : dbProducts.slice(0, 4).map((product) => (
            <Link key={product.id} to="/products" className="cem-card flex flex-col group p-2 interactive-hover overflow-hidden">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" loading="lazy" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white font-black text-[8px] rounded uppercase">{t('home.hot')}</div>
              </div>
              <div className="px-3 pb-3">
                <h3 className="font-display font-semibold text-sm text-body-text uppercase tracking-tight mb-2 truncate group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-primary font-bold text-base">{product.price}</p>
                  <div className="p-2 bg-elevated-surface rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                    <PiShoppingCartBold size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Parallax Video Break */}
      <section className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden flex items-center justify-center my-12">
        <div className="absolute inset-0 z-0">
          <video
            src="/Mall 3.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/photo_6041962101854637595_y.jpg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/20 backdrop-brightness-75" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary font-black text-xs uppercase tracking-[0.5em] mb-4 block min-h-[1.5em]">
              <Typewriter text={t('home.unmatchedScale')} delay={150} />
            </span>
            <h2 className="text-white text-4xl md:text-7xl lg:text-8xl font-display font-black uppercase italic tracking-tighter leading-[0.85] min-h-[2.5em]">
              <Typewriter text={t('home.heartOfTrade')} delay={120} />
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Promotions Slider */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black uppercase text-muted-text tracking-widest flex items-center gap-3">
            <PiTrendUpBold size={20} className="text-action-red" />
            {config?.promoTitle || t('home.midYearSale')}
          </h2>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar">
          {activePromos.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 w-[320px] md:w-[540px] cem-card overflow-hidden group">
              <div className="relative aspect-[21/9]">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="bg-action-red text-white text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">{config?.promoSubtitle || t('nav.promos')}</span>
                </div>
              </div>
              <div className="p-8 bg-elevated-surface relative border-t border-border-color">
                <div className="absolute -top-12 right-8 w-24 h-24 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center border-2 border-secondary rotate-6 group-hover:rotate-0 transition-transform">
                  <span className="text-[10px] font-black text-primary uppercase">{t('home.promoSave')}</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">{config?.promoDiscount || "40%"}</span>
                </div>
                <h3 className="text-body-text font-display font-bold text-2xl mb-2 uppercase tracking-tight">{promo.title}</h3>
                <p className="text-muted-text text-sm font-medium pr-20 line-clamp-2 leading-relaxed">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mall Spotlight (Videos) */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase text-gold-accent tracking-[0.4em] mb-2">{t('home.liveFromDarkuman')}</h2>
            <h3 className="text-3xl font-display font-black uppercase tracking-tight flex items-center gap-3">
              {t('home.mallSpotlight')}
              <PiCameraBold size={24} className="text-gold-accent" />
            </h3>
          </div>
        </div>
        <div className="relative overflow-hidden -mx-6">
          <motion.div
            className="flex gap-6 px-6 w-max"
            animate={{
              x: [0, -((480 + 24) * mallVideos.length)]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...mallVideos, ...mallVideos].map((video, idx) => (
              <motion.div
                key={`${video.id}-${idx}`}
                className="relative flex-shrink-0 w-[300px] md:w-[480px] aspect-video rounded-[2.5rem] overflow-hidden group cursor-pointer border border-border-color shadow-2xl"
                onClick={() => setActiveVideo(video.src)}
              >
                <video
                  src={video.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/photo_6041962101854637594_y.jpg"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex flex-col justify-end p-8">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <PiPlayFill size={28} className="text-white translate-x-1" />
                  </div>
                  <div className="relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-secondary font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" /> {t('home.liveNow')}
                    </p>
                    <h4 className="text-white font-display font-bold text-2xl uppercase tracking-tighter leading-none">{video.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary-bg/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative aspect-[9/16] max-h-full rounded-3xl overflow-hidden border border-white/10 shadow-gold"
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
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-gold-accent text-white rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 z-10 transition-all"
              >
                <PiXBold size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Stores */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xs font-black uppercase text-muted-text tracking-[0.3em]">{t('home.explorePopularStores')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="aspect-video bg-card-surface animate-pulse rounded-[2.5rem]" />
            ))
          ) : featuredStores.length > 0 ? (
            featuredStores.map((store) => (
              <Link key={store.id} to={`/stores/${store.id}`} className="cem-card flex flex-col group overflow-hidden border-none shadow-xl">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-primary-bg/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5 shadow-lg">
                    <PiStarFill size={14} className="text-gold-accent" />
                    <span className="text-xs font-black text-body-text">{store.rating}</span>
                  </div>
                </div>
                <div className="p-6 pb-8 flex-1 flex flex-col bg-card-surface">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display font-bold text-xl text-body-text leading-tight uppercase tracking-tight group-hover:text-gold-accent transition-colors">{store.name}</h3>
                    <div className="w-10 h-10 rounded-xl bg-elevated-surface p-1 border border-border-color flex-shrink-0">
                      <img src={store.logo} alt="" className="w-full h-full object-contain" loading="lazy" />
                    </div>
                  </div>
                  <div className="cem-badge-gold w-fit mb-6">{store.category}</div>
                  <div className="flex items-center gap-2 text-muted-text/60 text-[10px] font-black uppercase tracking-[0.2em] mt-auto pt-6 border-t border-border-color">
                    <PiMapPinFill size={16} className="text-gold-accent" />
                    <span>{store.location}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-text font-black uppercase tracking-widest bg-card-surface rounded-[2.5rem] border border-dashed border-border-color">
              {t('home.noFeaturedStores')}
            </div>
          )}
        </div>
      </section>

      {/* Loyalty CTA */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="bg-primary border border-primary/20 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
          {/* Background Video for CTA */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <video
              src="/Mall 5.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/photo_6041962101854637596_y.jpg"
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
          </div>

          {/* Subtle Glows inside CTA */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[100px] z-10" />

          <div className="relative z-10 max-w-lg">
            <span className="text-secondary font-black text-xs uppercase tracking-[0.4em] mb-6 block">{t('home.membershipStatus')}</span>
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6 leading-[0.9] uppercase italic text-white">
              {config?.loyaltyTitle ? (
                <>
                  {config.loyaltyTitle.split(' ').slice(0, -2).join(' ')} <br />
                  <span className="text-secondary uppercase">{config.loyaltyTitle.split(' ').slice(-2).join(' ')}</span>
                </>
              ) : (
                <>{t('home.joinGold')}</>
              )}
            </h2>
            <p className="text-white/70 text-lg mb-10 font-medium leading-relaxed">{config?.loyaltyDescription || t('home.earnPoints')}</p>
            <Link to="/loyalty" className="bg-secondary text-primary px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-secondary/90 transition-all italic flex items-center gap-4 text-sm">
              {t('home.startEarningPoints')} <PiGiftBold size={22} />
            </Link>
          </div>
          <div className="relative z-10 w-full md:w-auto flex flex-col items-center">
            <PiMedalBold className="text-white/5 -rotate-12 absolute -z-10" size={400} />
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2.5rem] text-center w-full max-w-[320px] shadow-2xl">
              <p className="text-5xl font-display font-black text-secondary tracking-tighter mb-2">1,240</p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{t('home.currentMemberPts')}</p>
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-secondary shadow-lg shadow-secondary/20" />
                </div>
                <p className="text-[9px] font-black uppercase text-secondary mt-3">65% {t('home.toGoldStatus')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
