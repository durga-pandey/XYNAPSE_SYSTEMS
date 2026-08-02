import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiSend, FiZap, FiAward } from 'react-icons/fi';

const pricingData = {
  monthly: [
    { name: "Starter", price: "0", desc: "For curious learners", features: ["Access to Basic Modules", "Community Support", "Public Cloud Labs"], icon: <FiSend />, popular: false },
    { name: "Pro Architect", price: "29", desc: "For career switchers", features: ["Everything in Starter", "Live Mentor Sessions", "Unlimited Cloud Labs", "Placement Support"], icon: <FiZap />, popular: true },
    { name: "Enterprise", price: "99", desc: "For teams & orgs", features: ["Everything in Pro", "Custom Curriculum", "dedicated Manager", "Bulk Licenses"], icon: <FiAward />, popular: false },
  ],
  yearly: [
    { name: "Starter", price: "0", desc: "For curious learners", features: ["Access to Basic Modules", "Community Support", "Public Cloud Labs"], icon: <FiSend />, popular: false },
    { name: "Pro Architect", price: "24", desc: "For career switchers", features: ["Everything in Starter", "Live Mentor Sessions", "Unlimited Cloud Labs", "Placement Support"], icon: <FiZap />, popular: true },
    { name: "Enterprise", price: "79", desc: "For teams & orgs", features: ["Everything in Pro", "Custom Curriculum", "dedicated Manager", "Bulk Licenses"], icon: <FiAward />, popular: false },
  ]
};

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
            Invest in Your <span className="text-blue-600">Future.</span>
          </h2>
          
          {/* --- Liquid Toggle Switch --- */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-slate-400'}`}>Monthly</span>
            
            <div 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-20 h-10 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer p-1"
            >
              <motion.div
                animate={{ x: billingCycle === 'monthly' ? 0 : 40 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-8 h-8 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            </div>

            <span className={`text-sm font-bold flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-slate-400'}`}>
              Yearly 
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* --- Pricing Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
          {pricingData[billingCycle].map((plan, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-[3rem] border transition-all duration-500 ${
                plan.popular 
                ? 'bg-slate-900 dark:bg-slate-900 border-blue-500 shadow-2xl scale-105 z-20 py-12' 
                : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 z-10'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-tighter shadow-xl">
                  Most Popular
                </div>
              )}

              <div className={`text-4xl mb-6 ${plan.popular ? 'text-blue-400' : 'text-blue-600'}`}>
                {plan.icon}
              </div>

              <h3 className={`text-2xl font-black ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {plan.name}
              </h3>
              <p className={`mt-2 text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {plan.desc}
              </p>

              <div className="my-8">
                <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  ${plan.price}
                </span>
                <span className="text-slate-500 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-sm font-medium transition-all group">
                    <span className={`p-1 rounded-full ${plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                      <FiCheck />
                    </span>
                    <span className={plan.popular ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${
                plan.popular 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/40' 
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
              }`}>
                CHOOSE PLAN
              </button>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee Text */}
        <p className="text-center mt-12 text-slate-500 dark:text-slate-500 text-sm font-semibold">
          14-day no-questions-asked refund policy. Secure payment via Stripe & PayPal.
        </p>

      </div>
    </section>
  );
};

export default PricingSection;