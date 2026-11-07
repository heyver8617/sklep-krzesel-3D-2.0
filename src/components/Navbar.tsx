import React from 'react';
import { CartItem } from '../types';
import { CartDropdown } from './CartDropdown';

interface NavbarProps {
    cartItems: CartItem[];
    isCartOpen: boolean;
    isFavorite: boolean;
    onToggleCart: () => void;
    onCloseCart: () => void;
    onUpdateCartQuantity: (id: string, delta: number) => void;
    onClearCart: () => void;
    onToggleFavorite: () => void;
    onShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    cartItems,
    isCartOpen,
    isFavorite,
    onToggleCart,
    onCloseCart,
    onUpdateCartQuantity,
    onClearCart,
    onToggleFavorite,
    onShare
}) => {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#DCD6CA] px-6 lg:px-12 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <nav className="hidden md:flex items-center gap-3 text-xs text-stone-500 font-medium">
                    <a href="#top" className="hover:text-stone-900 transition">Strona główna</a>
                    <span>/</span>
                    <a href="#meble" className="hover:text-stone-900 transition">Meble</a>
                    <span>/</span>
                    <a href="#krzesla" className="hover:text-stone-900 transition">Krzesła jadalniane</a>
                    <span>/</span>
                    <span className="text-stone-900 font-semibold">KRAKOSKI STOŁEK</span>
                </nav>

                <div className="text-center">
                    <span className="font-editorial text-xl md:text-2xl font-bold tracking-widest text-stone-900 block">
                        KRAKOSKIE MEBLE
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
                        Made in Kraków
                    </span>
                </div>

                <div className="flex items-center gap-5 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={onToggleFavorite}
                        className="hidden sm:flex items-center gap-1.5 text-stone-800 hover:text-stone-950 transition cursor-pointer"
                    >
                        <svg
                            className={`w-4 h-4 ${isFavorite ? 'fill-[#9E3321] text-[#9E3321]' : 'fill-none'}`}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Ulubione</span>
                    </button>

                    <button
                        type="button"
                        onClick={onShare}
                        className="hidden sm:flex items-center gap-1.5 text-stone-800 hover:text-stone-950 transition cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Udostępnij</span>
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleCart();
                            }}
                            className="flex items-center gap-2 pl-3 border-l border-[#DCD6CA] text-stone-900 font-semibold cursor-pointer py-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span>Koszyk</span>
                            <span className="w-5 h-5 rounded-full bg-stone-900 text-stone-100 text-[10px] flex items-center justify-center">
                                {totalCount}
                            </span>
                        </button>

                        <CartDropdown
                            isOpen={isCartOpen}
                            items={cartItems}
                            onClose={onCloseCart}
                            onUpdateQuantity={onUpdateCartQuantity}
                            onClearCart={onClearCart}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};
