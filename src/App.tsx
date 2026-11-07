import React, { useState, useRef } from 'react';
import { BASE_PRICE_PLN, FELT_PADS_PRICE_PLN, FABRIC_OPTIONS, WOOD_OPTIONS } from './config';
import { CartItem, ToastData } from './types';
import { Navbar } from './components/Navbar';
import { Stage3D } from './components/Stage3D';
import { CameraPresetsDock } from './components/CameraPresetsDock';
import { ProductHeader } from './components/ProductHeader';
import { FabricSelector } from './components/FabricSelector';
import { WoodSelector } from './components/WoodSelector';
import { OptionsSelector } from './components/OptionsSelector';
import { ArModal } from './components/ArModal';
import { ToastNotification } from './components/ToastNotification';

export const App: React.FC = () => {
    const [fabricIdx, setFabricIdx] = useState(0);
    const [woodIdx, setWoodIdx] = useState(0);
    const [isCushionMounted, setIsCushionMounted] = useState(true);
    const [hasFeltPads, setHasFeltPads] = useState(false);

    const [stageMode, setStageMode] = useState<'3D' | '2D'>('3D');
    const [activePresetIdx, setActivePresetIdx] = useState(0);
    const [isAutoRotate, setIsAutoRotate] = useState(false);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isArModalOpen, setIsArModalOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [toast, setToast] = useState<ToastData | null>(null);

    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (title: string, message: string) => {
        setToast({ title, message });
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => {
            setToast(null);
        }, 2600);
    };

    const currentFabric = FABRIC_OPTIONS[fabricIdx];
    const currentWood = WOOD_OPTIONS[woodIdx];
    const totalPrice =
        BASE_PRICE_PLN +
        currentFabric.price +
        currentWood.price +
        (hasFeltPads ? FELT_PADS_PRICE_PLN : 0);

    const handleSelectFabric = (idx: number) => {
        setFabricIdx(idx);
        showToast('Tkanina poduszki', `Wybrano: ${FABRIC_OPTIONS[idx].name}`);
    };

    const handleSelectWood = (idx: number) => {
        setWoodIdx(idx);
        showToast('Stelaż drewniany', `Wybrano: ${WOOD_OPTIONS[idx].name}`);
    };

    const handleToggleCushion = () => {
        setIsCushionMounted((prev) => {
            const next = !prev;
            showToast('Poduszka siedziska', next ? 'Założono pikowaną poduszkę.' : 'Zdjęto poduszkę.');
            return next;
        });
    };

    const handleToggleFeltPads = () => {
        setHasFeltPads((prev) => {
            const next = !prev;
            showToast(
                'Stopki filcowe',
                next ? 'Dodano stopki filcowe (+29 zł).' : 'Usunięto stopki filcowe.'
            );
            return next;
        });
    };

    const handleAddToCart = () => {
        setCartItems((prev) => {
            const existing = prev.find(
                (item) =>
                    item.fabricName === currentFabric.name &&
                    item.woodName === currentWood.name &&
                    item.hasCushion === isCushionMounted &&
                    item.hasFelt === hasFeltPads
            );
            if (existing) {
                return prev.map((item) =>
                    item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    id: Math.random().toString(36).substring(2, 9),
                    name: 'KRAKOSKI STOŁEK',
                    fabricName: currentFabric.name,
                    fabricHex: currentFabric.hex,
                    woodName: currentWood.name,
                    woodHex: currentWood.hex,
                    hasCushion: isCushionMounted,
                    hasFelt: hasFeltPads,
                    price: totalPrice,
                    quantity: 1
                }
            ];
        });
        setIsCartOpen(true);
        showToast('Dodano do koszyka', `KRAKOSKI STOŁEK (${currentFabric.name})`);
    };

    const handleUpdateCartQuantity = (id: string, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    return (
        <div
            className="min-h-screen bg-[#F6F3EC] text-[#1C1B18]"
            onClick={() => {
                if (isCartOpen) setIsCartOpen(false);
            }}
        >
            <Navbar
                cartItems={cartItems}
                isCartOpen={isCartOpen}
                isFavorite={isFavorite}
                onToggleCart={() => setIsCartOpen((prev) => !prev)}
                onCloseCart={() => setIsCartOpen(false)}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onClearCart={() => setCartItems([])}
                onToggleFavorite={() => {
                    setIsFavorite((prev) => {
                        const next = !prev;
                        showToast('Ulubione', next ? 'Dodano do ulubionych.' : 'Usunięto z ulubionych.');
                        return next;
                    });
                }}
                onShare={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Skopiowano link', 'Link do konfiguracji jest w schowku.');
                }}
            />

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
                {/* Zakładki trybu 3D / 2D */}
                <div className="flex items-center justify-between border-b border-[#DCD6CA] mb-8">
                    <div className="flex gap-8">
                        <button
                            type="button"
                            onClick={() => setStageMode('3D')}
                            className={`pb-3 text-sm border-b-2 transition cursor-pointer ${
                                stageMode === '3D'
                                    ? 'font-semibold text-stone-900 border-stone-900'
                                    : 'font-medium text-stone-500 hover:text-stone-900 border-transparent'
                            }`}
                        >
                            Konfigurator 3D
                        </button>
                        <button
                            type="button"
                            onClick={() => setStageMode('2D')}
                            className={`pb-3 text-sm border-b-2 transition cursor-pointer ${
                                stageMode === '2D'
                                    ? 'font-semibold text-stone-900 border-stone-900'
                                    : 'font-medium text-stone-500 hover:text-stone-900 border-transparent'
                            }`}
                        >
                            Rzut 2D i wymiary
                        </button>
                    </div>
                    <span className="hidden sm:inline-block text-xs text-stone-500 font-medium pb-3">
                        Przeciągnij myszką lub palcem, aby obrócić o 360°
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Lewa kolumna: Wizualizator 3D oraz ujęcia kamery */}
                    <div className="lg:col-span-7 space-y-4">
                        <Stage3D
                            fabric={currentFabric}
                            wood={currentWood}
                            isCushionMounted={isCushionMounted}
                            hasFeltPads={hasFeltPads}
                            stageMode={stageMode}
                            activePresetIdx={activePresetIdx}
                            isAutoRotate={isAutoRotate}
                            onSwitchMode={setStageMode}
                            onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
                            onOpenArModal={() => setIsArModalOpen(true)}
                            onSelectPreset={(idx) => {
                                setIsAutoRotate(false);
                                setStageMode('3D');
                                setActivePresetIdx(idx);
                            }}
                        />

                        <CameraPresetsDock
                            activePresetIdx={activePresetIdx}
                            onSelectPreset={(idx) => {
                                setIsAutoRotate(false);
                                setStageMode('3D');
                                setActivePresetIdx(idx);
                            }}
                        />
                    </div>

                    {/* Prawa kolumna: Konfigurator opcji */}
                    <div className="lg:col-span-5 space-y-6">
                        <ProductHeader
                            fabric={currentFabric}
                            wood={currentWood}
                            totalPrice={totalPrice}
                        />

                        <FabricSelector
                            selectedIndex={fabricIdx}
                            onSelect={handleSelectFabric}
                        />

                        <WoodSelector
                            selectedWoodIndex={woodIdx}
                            selectedFabricIndex={fabricIdx}
                            onSelectWood={handleSelectWood}
                        />

                        <OptionsSelector
                            isCushionMounted={isCushionMounted}
                            hasFeltPads={hasFeltPads}
                            onToggleCushion={handleToggleCushion}
                            onToggleFeltPads={handleToggleFeltPads}
                        />

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                                className="w-full py-4 rounded-2xl bg-[#9E3321] hover:bg-[#862B1C] text-white text-xs font-bold uppercase tracking-widest transition shadow-lg cursor-pointer flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>
                                    Dodaj do koszyka — <strong>{totalPrice} zł</strong>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <ArModal isOpen={isArModalOpen} onClose={() => setIsArModalOpen(false)} />
            <ToastNotification toast={toast} />
        </div>
    );
};

export default App;
