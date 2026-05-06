
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
      <footer className="hidden md:block bg-primary text-white py-20 px-6 mt-12 border-t-8 border-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">
              CHINA <span className="text-secondary">ECONOMIC</span> MALL
            </h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-md font-medium">
              Ghana's leading destination for affordable wholesale and retail commerce. We bridge the gap between quality international goods and the Ghanaian household.
            </p>
            <div className="flex gap-4 mt-8">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-accent transition-colors cursor-pointer border border-white/5">
                  <Globe size={20} />
               </div>
               {/* Add other socials if needed */}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-secondary">Quick Access</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-white/60">
              <li><a href="/stores" className="hover:text-white transition-colors">Directory</a></li>
              <li><a href="/promotions" className="hover:text-white transition-colors">Hot Deals</a></li>
              <li><a href="/loyalty" className="hover:text-white transition-colors">Rewards</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors text-accent">Admin Console</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-secondary">Darkuman Hub</h4>
            <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Darkuman, Accra, Ghana</p>
            <p className="text-xs font-black uppercase tracking-widest text-white/60">07:30 - 21:30 DAILY</p>
            <p className="text-sm font-black text-secondary mt-6 uppercase tracking-tighter">020 275 1082</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
          <p>© 2026 CHINA ECONOMIC MALL DARKUMAN</p>
          <p>BUILT FOR EXCELLENCE IN GHANA</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
