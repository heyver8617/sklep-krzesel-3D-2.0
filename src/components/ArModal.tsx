import React from 'react';

interface ArModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ArModal: React.FC<ArModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={onClose}
        >
            <div
                className="bg-[#FAF8F5] border border-[#DCD6CA] rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                    Sprawdź krzesło w swoim pokoju
                </h3>
                <p className="text-xs text-stone-600">
                    Zeskanuj kod QR aparatem w telefonie, aby zobaczyć model 3D w skali 1:1 w swojej jadalni.
                </p>
                <div className="w-48 h-48 mx-auto bg-white border-2 border-stone-200 rounded-2xl p-4 flex items-center justify-center shadow-inner">
                    <svg className="w-full h-full text-stone-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="1.5" d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z" />
                    </svg>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                >
                    Zamknij okno
                </button>
            </div>
        </div>
    );
};
