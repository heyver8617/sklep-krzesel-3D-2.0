import React from 'react';
import { CartItem } from '../types';

interface CartDropdownProps {
    isOpen: boolean;
    items: CartItem[];
    onClose: () => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    onClearCart: () => void;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({
    isOpen,
    items,
    onClose,
    onUpdateQuantity,
    onClearCart
}) => {
    if (!isOpen) return null;

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div
            className="absolute top-12 right-0 w-80 sm:w-96 bg-[#FAF8F5] border border-[#DCD6CA] rounded-2xl shadow-2xl p-5 z-[130]"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between pb-3 border-b border-[#DCD6CA]">
                <h3 className="font-editorial text-xl font-semibold text-stone-900">Twój koszyk</h3>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    aria-label="Zamknij koszyk"
                    className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 flex items-center justify-center text-stone-800 font-bold transition cursor-pointer"
                >
                    ✕
                </button>
            </div>

            <div className="py-4 space-y-3 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-xs text-stone-500 text-center py-6">
                        Twój koszyk jest pusty. Skonfiguruj krzesło i kliknij „Dodaj do koszyka”.
                    </p>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex -space-x-1.5 flex-shrink-0">
                                    <span
                                        className="w-6 h-6 rounded-full border border-white shadow-sm"
                                        style={{ backgroundColor: item.fabricHex }}
                                        title={item.fabricName}
                                    />
                                    <span
                                        className="w-6 h-6 rounded-full border border-white shadow-sm"
                                        style={{ backgroundColor: item.woodHex }}
                                        title={item.woodName}
                                    />
                                </div>
                                <div>
                                    <strong className="text-stone-900 block">{item.name}</strong>
                                    <span className="text-[10px] text-stone-500 block">
                                        {item.hasCushion ? `Tkanina: ${item.fabricName}` : 'Bez poduszki'} | Drewno: {item.woodName}
                                    </span>
                                    {item.hasFelt && (
                                        <span className="text-[9px] text-amber-700 font-semibold block">
                                            + Stopki filcowe (+29 zł)
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                                <span className="text-stone-900 font-bold">{item.price * item.quantity} zł</span>
                                <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg px-1.5 py-0.5">
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                        className="w-4 h-4 rounded hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold cursor-pointer"
                                    >
                                        −
                                    </button>
                                    <span className="text-[10px] font-semibold text-stone-800 min-w-[14px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                        className="w-4 h-4 rounded hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pt-3 border-t border-[#DCD6CA] space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600 font-medium">Razem do zapłaty:</span>
                    <strong className="text-stone-900 text-lg font-bold">{totalPrice} zł</strong>
                </div>
                <div className="flex gap-2">
                    {items.length > 0 && (
                        <button
                            type="button"
                            onClick={onClearCart}
                            className="px-3 py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition cursor-pointer"
                        >
                            Wyczyść
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            if (items.length === 0) {
                                alert('Twój koszyk jest pusty!');
                            } else {
                                alert(`Dziękujemy! Przekierowanie do płatności (Kwota: ${totalPrice} zł).`);
                            }
                        }}
                        className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-md"
                    >
                        Przejdź do kasy
                    </button>
                </div>
            </div>
        </div>
    );
};
