import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Gift, Zap, ShieldCheck, History, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LoyaltyPage = () => {
  const { t } = useTranslation();
  const [config, setConfig] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error(err));
  }, []);

  const tiers = [
    { name: t('loyalty.bronze'), points: '0-500', color: 'text-amber-700', bg: 'bg-amber-100', active: true },
    { name: t('loyalty.silver'), points: '501-2000', color: 'text-slate-500', bg: 'bg-slate-100', active: false },
    { name: t('loyalty.gold'), points: '2001+', color: 'text-yellow-600', bg: 'bg-yellow-100', active: false },
  ];

  const benefits = [
    { icon: Zap, title: t('loyalty.benefits.earlyAccess'), desc: t('loyalty.benefits.earlyAccessDesc') },
    { icon: Gift, title: t('loyalty.benefits.birthdayReward'), desc: t('loyalty.benefits.birthdayRewardDesc') },
    { icon: ShieldCheck, title: t('loyalty.benefits.warrantyPlus'), desc: t('loyalty.benefits.warrantyPlusDesc') },
  ];

  return (
    <div className="flex flex-col gap-8 py-10 px-6 max-w-7xl mx-auto w-full pb-24">
      <div>
         <h1 className="text-sm font-black uppercase text-slate-400 tracking-widest">{t('loyalty.sectionLabel')}</h1>
         <h2 className="text-4xl font-black uppercase tracking-tight">{t('loyalty.title')}</h2>
      </div>

      {/* Member Card */}
      <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border-b-8 border-secondary">
         <div className="relative z-10 flex flex-col gap-10">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                     <Award size={32} className="text-secondary" />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/50 mb-0.5">{t('loyalty.verifiedMember')}</p>
                     <p className="text-xl font-black tracking-tight uppercase italic">KWAME MENSAH</p>
                  </div>
               </div>
               <div className="bg-accent text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                  {t('loyalty.gold').toUpperCase()} {t('loyalty.tier')}
               </div>
            </div>

            <div>
               <p className="text-xs text-white/50 font-black uppercase tracking-widest mb-2">{t('loyalty.cumulativeBalance')}</p>
               <h2 className="text-6xl font-black text-secondary tracking-tighter">1,240 <span className="text-xl text-white/40 uppercase tracking-widest ml-2 italic">{t('loyalty.points')}</span></h2>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                  <span>{t('loyalty.progressToDiamond')}</span>
                  <span>760 {t('loyalty.pointsToNext')}</span>
               </div>
               <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '62%' }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-secondary shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                  />
               </div>
            </div>
         </div>
         {/* Background pattern */}
         <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
         <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-secondary/10 rounded-full blur-2xl"></div>
      </div>

      {/* Benefits */}
      <section>
         <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">{t('loyalty.benefits')}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map(benefit => (
               <div key={benefit.title} className="bg-white p-8 rounded-[2rem] border-2 border-slate-50 flex flex-col gap-5 group hover:border-accent transition-colors">
                  <div className="bg-slate-50 p-4 rounded-2xl text-accent flex-shrink-0 w-fit group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                     <benefit.icon size={28} />
                  </div>
                  <div>
                     <h3 className="font-black text-lg mb-2 uppercase tracking-tight">{benefit.title}</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Tiers List */}
      <section>
         <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">{t('loyalty.availableTiers')}</h2>
         <div className="flex flex-col gap-4">
            {tiers.map(tier => (
               <div key={tier.name} className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${tier.name === t('loyalty.gold') ? 'bg-white border-accent shadow-xl py-8 scale-[1.02]' : 'bg-slate-50 border-slate-100 grayscale opacity-60'}`}>
                  <div className="flex items-center gap-6">
                     <div className={`w-16 h-16 ${tier.bg} rounded-2xl flex items-center justify-center font-black text-2xl italic ${tier.color} shadow-inner`}>
                        {tier.name.charAt(0)}
                     </div>
                     <div>
                        <p className="font-black text-lg tracking-tight uppercase">{tier.name} {t('loyalty.levelAccess')}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tier.points} {t('loyalty.pointsBracket')}</p>
                     </div>
                  </div>
                  {tier.name === t('loyalty.gold') ? (
                     <div className="bg-accent text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Award size={14} /> {t('loyalty.activeTier')}
                     </div>
                  ) : (
                     <div className="text-slate-300"><ChevronRight size={24} /></div>
                  )}
               </div>
            ))}
         </div>
      </section>

      {/* History CTA */}
      <button className="flex items-center justify-between p-8 bg-primary text-white rounded-[2.5rem] group shadow-2xl hover:bg-primary/90 transition-all active:scale-95 border-b-4 border-accent">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 rounded-2xl shadow-inner border border-white/5">
               <History size={32} className="text-secondary" />
            </div>
            <div className="text-left">
               <h3 className="font-black text-xl uppercase tracking-tight italic">{t('loyalty.transactionLogs')}</h3>
               <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">{t('loyalty.auditPoints')}</p>
            </div>
         </div>
         <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent transition-all">
            <ArrowRight size={24} />
         </div>
      </button>
    </div>
  );
};

export default LoyaltyPage;
