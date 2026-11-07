import React from 'react';
import { ToastData } from '../types';

interface ToastNotificationProps {
    toast: ToastData | null;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast }) => {
    return (
        <div
            className={`fixed bottom-6 right-6 z-[140] bg-stone-900 text-stone-100 px-5 py-4 rounded-2xl shadow-2xl transition-all duration-300 pointer-events-none flex items-center gap-3 ${
                toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
        >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
                <strong className="text-xs font-bold block">{toast?.title || ''}</strong>
                <span className="text-[11px] text-stone-400 block">{toast?.message || ''}</span>
            </div>
        </div>
    );
};
