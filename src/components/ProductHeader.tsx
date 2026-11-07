import React from 'react';
import { FabricOption, WoodOption } from '../types';

interface ProductHeaderProps {
    fabric: FabricOption;
    wood: WoodOption;
    totalPrice: number;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ fabric, wood, totalPrice }) => {
    const skuCode = `K04-${fabric.code}-${wood.code}`;

    const features = [
        { title: 'Drewno', sub: 'lite dębowe' },
        { title: 'Poduszka', sub: '4 pikowania' },
        { title: 'Tkanina', sub: '85 000 cykli' },
        { title: 'Stelaż H', sub: 'wzmocniony' },
        { title: 'Wymiary', sub: '45×47×95 cm' },
        { title: 'Rzemiosło', sub: 'Made in Kraków' }
    ];

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
                    <span>RZEMIOSŁO Z KRAKOWA • MODEL K-04</span>
                    <span className="font-mono">SKU: {skuCode}</span>
                </div>
                <h1 className="font-editorial text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 mb-3">
                    KRAKOSKI STOŁEK
                </h1>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    Klasyczna forma stolarska z trzema profilowanymi szczebelkami i pikowaną poduszką na troczkach.
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-stone-900 font-mono">{totalPrice} zł</span>
                        <span className="text-xs text-stone-500">z VAT (darmowa dostawa)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 bg-stone-200/60 px-3 py-1 rounded-full">
                        <span className="text-amber-600">★</span> 4.9{' '}
                        <span className="text-stone-500 font-normal">(128 opinii)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-2 pt-1">
                {features.map((feat) => (
                    <div key={feat.title} className="p-2.5 bg-white border border-[#DCD6CA] rounded-xl text-center">
                        <span className="block text-[10px] font-bold text-stone-900 uppercase">{feat.title}</span>
                        <span className="text-[9px] text-stone-500 truncate block">{feat.sub}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
