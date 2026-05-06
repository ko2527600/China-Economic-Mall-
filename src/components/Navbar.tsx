
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  PiHouseDuotone, 
  PiStorefrontDuotone, 
  PiShoppingCartDuotone, 
  PiTagDuotone, 
  PiMedalDuotone, 
  PiMagnifyingGlassDuotone,
  PiListBold,
  PiXBold 
} from 'react-icons/pi';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      setIsMobileMenuOpen(false);
      navigate(`/products?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const navItems = [
    { icon: PiHouseDuotone, label: 'Home', path: '/' },
    { icon: PiStorefrontDuotone, label: 'Stores', path: '/stores' },
    { icon: PiShoppingCartDuotone, label: 'Products', path: '/products' },
    { icon: PiTagDuotone, label: 'Promos', path: '/promotions' },
    { icon: PiMedalDuotone, label: 'Loyalty', path: '/loyalty' },
  ];

  const Logo = () => (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="font-display font-black text-2xl text-white leading-none translate-y-[-1px]">C</span>
      </div>
      <div className="flex flex-col">
        <span className="font-display font-bold text-lg text-primary leading-tight group-hover:text-primary/80 transition-colors">China Economic</span>
        <span className="text-[9px] font-body font-black uppercase tracking-[0.3em] text-secondary">MALL</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav 
        className="fixed top-0 left-0 right-0 h-20 z-50 hidden md:flex items-center px-12 border-b border-border-color shadow-sm"
        style={{ 
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)'
        }}
      >
        <div className="mr-auto">
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>
        
        {/* Nav Links */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300",
                  isActive 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-text hover:text-primary hover:bg-primary/5"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-6 ml-8">
          <div className="relative group">
            <PiMagnifyingGlassDuotone 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors" 
              size={18} 
            />
            <input 
              type="text" 
              placeholder="Search mall..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 h-11 text-xs w-48 lg:w-64 focus:w-80 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium shadow-inner"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 h-16 z-50 flex md:hidden items-center justify-between px-6 border-b border-border-color shadow-sm"
        style={{ 
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <Logo />
        </NavLink>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-primary p-2"
        >
          {isMobileMenuOpen ? <PiXBold size={28} /> : <PiListBold size={28} />}
        </button>
      </nav>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 top-16 z-40 md:hidden bg-white px-6 py-8"
          >
            <div className="flex flex-col gap-6">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <PiMagnifyingGlassDuotone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={20} />
                <input 
                  type="text" 
                  placeholder="Search stores, products..." 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearch}
                  className="bg-slate-50 border border-slate-100 rounded-2xl w-full pl-12 pr-4 h-14 text-sm outline-none focus:bg-white focus:border-primary/20 transition-all font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 p-4 rounded-2xl transition-all",
                      isActive 
                        ? "bg-primary text-white" 
                        : "text-muted-text active:bg-elevated-surface"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={24} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Spacing for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
