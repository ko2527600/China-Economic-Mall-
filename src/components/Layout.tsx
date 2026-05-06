
import React from 'react';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [config, setConfig] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-accent selection:text-white">
      <Navbar />
      
      <main className="flex-1 pt-0 md:pt-16 pb-16 md:pb-0 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer for desktop */}
      <footer className="hidden md:block bg-primary text-white py-10 px-6 border-t-8 border-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">
              {config?.heroTitle || "CHINA ECONOMIC MALL"}
            </h3>
            <p className="text-white/40 text-[10px] leading-relaxed max-w-md font-black uppercase tracking-widest">
              {config?.heroDescription?.substring(0, 140) + "..." || "Ghana's leading destination for affordable wholesale and retail commerce."}
            </p>
            <div className="flex gap-4 mt-6">
               <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-accent transition-colors cursor-pointer border border-white/5">
                  <Globe size={16} />
               </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.3em] text-secondary">Quick Access</h4>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-white/50">
              <li><a href="/stores" className="hover:text-white transition-colors">Directory</a></li>
              <li><a href="/promotions" className="hover:text-white transition-colors">Hot Deals</a></li>
              <li><a href="/loyalty" className="hover:text-white transition-colors">Rewards</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors text-accent">Admin Console</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.3em] text-secondary">Darkuman Hub</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{config?.contactAddress || "Darkuman, Accra, Ghana"}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{config?.openingHours || "07:30 - 21:30 DAILY"}</p>
            <p className="text-xs font-black text-secondary mt-4 uppercase tracking-tighter">{config?.contactPhone || "020 275 1082"}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
          <p>© 2026 {config?.heroTitle || "CHINA ECONOMIC MALL"}</p>
          <p>BUILT FOR EXCELLENCE IN GHANA</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
