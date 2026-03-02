import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';

/**
 * Contextual tooltip that attaches to any wrapped element.
 * Shows a tip bubble after `delay` ms if `active` is true.
 * 
 * Usage:
 *   <OnboardingTooltip tip="Click here to create your first project" active={!hasProject}>
 *     <Button>New Project</Button>
 *   </OnboardingTooltip>
 */
export default function OnboardingTooltip({
  children,
  tip,
  active = true,
  delay = 2000,
  position = 'top', // top | bottom | left | right
  dismissKey,       // localStorage key to persist dismissal
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissKey) {
      const stored = localStorage.getItem(`ott_${dismissKey}`);
      if (stored === '1') { setDismissed(true); return; }
    }
    if (!active || dismissed) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [active, dismissed, delay, dismissKey]);

  const dismiss = (e) => {
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
    if (dismissKey) localStorage.setItem(`ott_${dismissKey}`, '1');
  };

  const positions = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top:    'top-full left-1/2 -translate-x-1/2 border-t-amber-400 border-l-transparent border-r-transparent border-b-transparent border-4',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-amber-400 border-l-transparent border-r-transparent border-t-transparent border-4',
    left:   'left-full top-1/2 -translate-y-1/2 border-l-amber-400 border-t-transparent border-b-transparent border-r-transparent border-4',
    right:  'right-full top-1/2 -translate-y-1/2 border-r-amber-400 border-t-transparent border-b-transparent border-l-transparent border-4',
  };

  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        {visible && !dismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 w-56 ${positions[position]}`}
          >
            <div className="bg-white border border-amber-200 rounded-xl shadow-lg p-3 relative">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 flex-1 leading-relaxed">{tip}</p>
                <button onClick={dismiss} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                  <X className="w-3 h-3" />
                </button>
              </div>
              {/* Arrow */}
              <div className={`absolute ${arrows[position]}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}