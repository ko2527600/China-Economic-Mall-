import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Settings, Heart, Bell, LogOut, ChevronRight, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORES } from '../data/mockData';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const favoriteStores = STORES.slice(0, 2);

  const menuItems = [
    { icon: Bell, label: t('profile.menuItems.notifications'), value: t('profile.menuItems.notificationsOn') },
    { icon: Globe, label: t('profile.language'), value: i18n.language === 'zh' ? '简体中文' : 'English' },
    { icon: Settings, label: t('profile.menuItems.accountSettings'), value: null },
  ];

  return (
    <div className="flex flex-col gap-8 py-10 px-6 max-w-7xl mx-auto w-full pb-24">
      <div>
         <h1 className="text-sm font-black uppercase text-slate-400 tracking-widest">{t('profile.userDashboard')}</h1>
         <h2 className="text-4xl font-black uppercase tracking-tight">{t('profile.title')}</h2>
      </div>

      {/* Header Profile Info */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-xl flex flex-col md:flex-row items-center gap-10">
         <div className="relative group">
            <div className="w-32 h-32 bg-primary text-white rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-secondary rotate-3 group-hover:rotate-0 transition-transform">
               K
            </div>
            <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-lg hover:bg-accent transition-all">
               <Settings size={20} />
            </button>
         </div>
         <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <h2 className="text-3xl font-black uppercase tracking-tighter">Kwame Mensah</h2>
               <span className="bg-accent/10 text-accent text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{t('loyalty.gold')} {t('profile.member')}</span>
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest flex items-center justify-center md:justify-start gap-2 mb-6">
               <MapPin size={14} className="text-accent" /> Darkuman, Accra
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <div className="bg-slate-50 px-6 py-4 rounded-2xl text-center border border-slate-100 min-w-[120px] shadow-inner">
                  <p className="text-2xl font-black text-primary tracking-tighter leading-none mb-1">1,240</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('profile.rewardsPts')}</p>
               </div>
               <div className="bg-slate-50 px-6 py-4 rounded-2xl text-center border border-slate-100 min-w-[120px] shadow-inner">
                  <p className="text-2xl font-black text-primary tracking-tighter leading-none mb-1">4</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('profile.favorites')}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         {/* Favorites Preview */}
         <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
               <Heart size={18} className="text-accent fill-accent" />
               {t('profile.savedStores')}
            </h3>
            <div className="grid grid-cols-1 gap-4">
               {favoriteStores.map(store => (
                  <Link key={store.id} to={`/stores/${store.id}`} className="group p-5 bg-white rounded-3xl border border-slate-100 flex items-center gap-4 hover:border-accent shadow-sm transition-all">
                     <img src={store.logo} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50" />
                     <div className="flex-1">
                        <p className="font-black text-sm uppercase tracking-tight group-hover:text-accent transition-colors">{store.name}</p>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{store.category}</p>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                       <ChevronRight size={18} />
                     </div>
                  </Link>
               ))}
               <Link to="/stores" className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors">
                  {t('home.viewAllStores')}
               </Link>
            </div>
         </div>

         {/* Menu Options */}
         <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
               <Settings size={18} className="text-accent" />
               {t('profile.systemPrefs')}
            </h3>
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 divide-y divide-slate-50 overflow-hidden shadow-xl">
               {menuItems.map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-500 group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                           <item.icon size={22} />
                        </div>
                        <span className="font-black text-sm uppercase tracking-tight text-slate-700">{item.label}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        {item.value && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{item.value}</span>}
                        <ChevronRight size={18} className="text-slate-300" />
                     </div>
                  </button>
               ))}
               <button className="w-full flex items-center gap-4 p-6 hover:bg-red-50 group transition-colors">
                  <div className="p-3 bg-red-50 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                     <LogOut size={22} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-tight text-red-600">{t('profile.signOut')}</span>
               </button>
            </div>
         </div>
      </div>

      <div className="text-center mt-12 py-8 border-t border-slate-50">
         <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] mb-2">{t('profile.footerMall')}</p>
         <p className="text-[10px] text-slate-200 font-black">{t('profile.footerVersion')}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
