import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEvent } from '../context/EventContext';
import { SUPPORTED_CURRENCIES, getCurrencyConfig } from '../utils/currency';
import { CurrencyCode } from '../types';

interface CurrencySwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { currency, setCurrency } = useEvent();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig = getCurrencyConfig(currency);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id="currency-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-50 hover:bg-slate-100/90 active:bg-slate-200/80 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
        title="Ubah format mata uang (Currency Switcher)"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none" role="img" aria-label={activeConfig.name}>
          {activeConfig.flag}
        </span>
        <span className="font-bold text-slate-900">{activeConfig.code}</span>
        <span className="text-[11px] font-medium text-slate-500">({activeConfig.symbol})</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden divide-y divide-slate-100"
            role="listbox"
          >
            {/* Header */}
            <div className="p-3.5 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Pilih Mata Uang</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                Global Currency
              </span>
            </div>

            {/* Currency list */}
            <div className="p-1.5 max-h-72 overflow-y-auto space-y-0.5">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = curr.code === currency;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/70'
                        : 'hover:bg-slate-50 text-slate-700 font-normal border border-transparent'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg leading-none" role="img" aria-label={curr.name}>
                        {curr.flag}
                      </span>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900">{curr.code}</span>
                          <span className="text-[11px] text-slate-500">({curr.symbol})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{curr.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {curr.rateAgainstIdr !== 1 ? (
                        <span className="text-[10px] text-slate-400 font-mono">
                          1 {curr.code} ≈ Rp {curr.rateAgainstIdr.toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100/60 px-1.5 py-0.5 rounded-sm">
                          Mata Uang Acuan
                        </span>
                      )}

                      <div className="w-4 h-4 flex items-center justify-center">
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="p-2.5 bg-slate-50/50 text-[10px] text-slate-500 flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Pilihan mata uang akan otomatis diterapkan ke seluruh layar & grafik tren.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
