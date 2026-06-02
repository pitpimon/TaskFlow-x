/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let BG = "bg-white border-blue-100 text-gray-800 shadow-blue-500/10";
          let Icon = <Info className="h-5 w-5 text-blue-500 shrink-0" />;

          switch (toast.type) {
            case 'success':
              BG = "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-500/10";
              Icon = <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
              break;
            case 'warning':
              BG = "bg-amber-50 border-amber-200 text-amber-900 shadow-amber-500/10";
              Icon = <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />;
              break;
            case 'error':
              BG = "bg-red-50 border-red-200 text-red-900 shadow-red-500/10";
              Icon = <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />;
              break;
            case 'info':
              BG = "bg-blue-50 border-blue-200 text-blue-950 shadow-blue-500/10";
              Icon = <Info className="h-5 w-5 text-blue-600 shrink-0" />;
              break;
          }

          return (
            <motion.div
              id={`toast-item-${toast.id}`}
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl ${BG}`}
            >
              {Icon}
              <div id={`toast-msg-${toast.id}`} className="text-sm font-medium flex-1 pr-2">
                {toast.message}
              </div>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 pt-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
