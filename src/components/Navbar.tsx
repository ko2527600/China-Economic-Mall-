
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Store, Tag, Award, User, ShoppingCart, Search, Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Store, label: 'Stores', path: '/stores' },
    { icon: ShoppingCart, label: 'Products', path: '/products' },
    { icon: Tag, label: 'Promos', path: '/promotions' },
    { icon: Award, label: 'Loyalty', path: '/loyalty' },
  ];

  const Logo = () => (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="w-10 h-10 bg-gradient-to-br from-gold-accent to-light-gold rounded-lg flex items-center justify-center shadow-lg shadow-gold-accent/10">
        <span className="font-display font-black text-2xl text-primary-bg leading-none translate-y-[-1px]">C</span>
      </div>
      <div className="flex flex-col">
        <span className="font-display font-bold text-lg text-body-text leading-tight group-hover:text-gold-accent transition-colors">China Economic</span>
        <span className="text-[9px] font-body font-black uppercase tracking-[0.3em] text-gold-accent">MALL</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav 
        className="fixed top-0 left-0 right-0 h-20 z-50 hidden md:flex items-center px-12 border-b border-gold-accent/15"
        style={{ 
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
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
                  "px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300",
                  isActive 
                    ? "text-light-gold bg-gold-accent/10" 
                    : "text-muted-text hover:text-body-text"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-6 ml-8">
          <div className="relative w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="cem-input w-full pl-10 h-10 text-xs"
            />
          </div>
          <NavLink to="/profile" className={({ isActive }) => cn("transition-colors", isActive ? "text-gold-accent" : "text-muted-text hover:text-gold-accent")}>
            <User size={22} strokeWidth={1.5} />
          </NavLink>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 h-16 z-50 flex md:hidden items-center justify-between px-6 border-b border-gold-accent/15"
        style={{ 
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <Logo />
        </NavLink>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gold-accent p-2"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
            className="fixed inset-0 top-16 z-40 md:hidden bg-primary-bg px-6 py-8"
          >
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
                        ? "bg-gold-accent/10 text-gold-accent" 
                        : "text-muted-text active:bg-elevated-surface"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 p-4 rounded-2xl mt-4 transition-all border border-border-color",
                    isActive ? "text-gold-accent border-gold-accent/30 bg-gold-accent/5" : "text-muted-text"
                  )
                }
              >
                <User size={20} strokeWidth={2} />
                <span className="font-semibold text-sm">Account Settings</span>
              </NavLink>
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
