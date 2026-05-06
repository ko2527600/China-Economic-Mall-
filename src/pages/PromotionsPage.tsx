
import React from 'react';
import { Tag, Calendar, ChevronRight, Bell, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PromotionsPage = () => {
  const [config, setConfig] = React.useState<any>(null);
  const [promotions, setPromotions] = React.useState<any[]>([]);
  const [events, setEvents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, promosRes, eventsRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/promotions'),
          fetch('/api/events')
        ]);
        setConfig(await configRes.json());
        setPromotions(await promosRes.json());
        setEvents(await eventsRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-8 py-10 px-6 max-w-7xl mx-auto w-full pb-24">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-sm font-black uppercase text-slate-400 tracking-widest">Live Updates</h1>
           <h2 className="text-4xl font-black uppercase tracking-tight">Active <span className="text-accent underline decoration-yellow-400 decoration-4 underline-offset-4">{config?.promoTitle?.split(' ').slice(-1) || "Promotions"}</span></h2>
        </div>
        <button className="relative p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
           <Bell size={24} />
           <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-accent border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* Featured Promo Banner */}
      <div className="relative h-64 rounded-[2.5rem] overflow-hidden group shadow-2xl border-4 border-white">
         <img 
          src={config?.promoImage || "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1000&fit=crop"} 
          alt="Mega Sale" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-75" 
        />
         <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-transparent p-10 flex flex-col justify-center">
            <span className="bg-secondary text-primary text-[10px] font-black px-3 py-1 rounded-lg w-fit mb-4 uppercase tracking-[0.2em] shadow-lg">{config?.promoSubtitle || "Mall Wide Event"}</span>
            <h2 className="text-white text-5xl font-black mb-2 uppercase tracking-tighter shadow-text">{config?.promoTitle || "MEGA SALE"}</h2>
            <p className="text-secondary text-lg font-black italic uppercase tracking-widest">Up to {config?.promoDiscount || "60%"} OFF ALL ITEMS</p>
            <p className="text-white/60 text-sm mt-4 font-medium max-w-xs">Participating stores across all levels. Check labels for discount eligibility.</p>
         </div>
      </div>

      {/* Promotions Filtered */}
      <section>
        <div className="flex items-center gap-3 mb-8">
           <Tag className="text-accent" size={24} />
           <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest">Store Specific Deals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {promotions.map((promo, i) => {
             const store = promo.store;
             return (
               <motion.div 
                key={promo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="geometric-card overflow-hidden flex flex-col group p-2 hover:border-accent"
               >
                  <div className="h-48 overflow-hidden relative rounded-2xl">
                     <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                       ENDS: {new Date(promo.expirationDate).toLocaleDateString()}
                     </div>
                  </div>
                  <div className="p-6">
                     <div className="flex items-center gap-2 mb-3">
                        <span className="bg-accent/10 text-accent text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest inline-block">Flash Deal</span>
                     </div>
                     <h3 className="font-black text-xl mb-2 uppercase tracking-tight group-hover:text-accent transition-colors">{promo.title}</h3>
                     <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">{promo.description}</p>
                     
                     <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        {store && (
                          <div className="flex items-center gap-3">
                             <img src={store.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                             <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Offered By</p>
                                <span className="text-xs font-black uppercase tracking-tight text-slate-700">{store.name}</span>
                             </div>
                          </div>
                        )}
                        <Link to={store ? `/stores/${store.id}` : '#'} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-accent transition-all group-hover:shadow-lg shadow-accent/20">
                           <ChevronRight size={18} />
                        </Link>
                     </div>
                  </div>
               </motion.div>
             );
           })}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center gap-3 mb-8">
           <Sparkles className="text-accent" size={24} />
           <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest">Upcoming Mall Events</h2>
        </div>

        <div className="flex flex-col gap-6">
           {events.map(event => (
             <div key={event.id} className="bg-white rounded-[2.5rem] p-6 flex flex-col sm:flex-row gap-8 border-2 border-slate-50 shadow-sm hover:border-yellow-400 transition-colors">
                <div className="w-full sm:w-64 h-40 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-slate-50 shadow-inner">
                   <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                   <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                       <Calendar size={14} />
                       <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                       <span className="text-slate-300">•</span>
                       <span className="text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">{event.location}</span>
                   </div>
                   <h3 className="font-black text-2xl mb-2 uppercase tracking-tight">{event.title}</h3>
                   <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">{event.description}</p>
                   <button className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest w-fit hover:bg-accent transition-all shadow-lg italic">
                      Remind Me
                   </button>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Newsletter / Push notifications signup */}
      <section className="bg-primary text-white rounded-[2.5rem] p-10 mt-6 overflow-hidden relative shadow-2xl border-b-8 border-secondary">
         <div className="relative z-10 sm:flex items-center justify-between gap-12">
            <div className="max-w-md">
               <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">Stay Connected</h2>
               <p className="text-white/60 text-sm font-medium">Be the first to know about flash sales and major events. We promise only the best deals straight to your device.</p>
            </div>
            <button className="w-full sm:w-auto bg-accent text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/40 hover:scale-105 transition-all mt-8 sm:mt-0 italic">
               Enable Real-Time Alerts
            </button>
         </div>
         <Bell className="absolute -left-12 -bottom-12 text-white/5 -rotate-12" size={200} />
      </section>
    </div>
  );
};

export default PromotionsPage;
