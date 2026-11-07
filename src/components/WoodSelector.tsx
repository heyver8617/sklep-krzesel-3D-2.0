import React from 'react';
import { WOOD_OPTIONS, FABRIC_OPTIONS } from '../config';

interface WoodSelectorProps {
    selectedWoodIndex: number;
    selectedFabricIndex: number;
    onSelectWood: (index: number) => void;
}

export const WoodSelector: React.FC<WoodSelectorProps> = ({
    selectedWoodIndex,
    selectedFabricIndex,
    onSelectWood
}) => {
    const selectedWood = WOOD_OPTIONS[selectedWoodIndex];
    const selectedFabric = FABRIC_OPTIONS[selectedFabricIndex];

    return (
        <div className="bg-white border border-[#DCD6CA] rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    2. Wybierz wybarwienie drewna
                </h3>
                <span className="text-xs font-semibold text-stone-900">{selectedWood.name}</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
                {WOOD_OPTIONS.map((wood, idx) => {
                    const isSelected = selectedWoodIndex === idx;
                    return (
                        <button
                            key={wood.code}
                            type="button"
                            onClick={() => onSelectWood(idx)}
                            className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                                isSelected
                                    ? 'border-stone-900 bg-stone-100/80 shadow-sm'
                                    : 'border-stone-200 bg-white hover:border-stone-400'
                            }`}
                        >
                            <span
                                className="w-full h-6 rounded-lg block mb-1"
                                style={{ backgroundColor: wood.hex }}
                            />
                            <span className="text-[10px] font-bold text-stone-900 block truncate">
                                {wood.name}
                            </span>
                            <span className="text-[9px] text-stone-500 block">
                                {wood.price === 0 ? 'w cenie' : `+${wood.price} zł`}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Zestawienie materiałów na żywo */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-[#DCD6CA] flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                        Zestawienie materiałów
                    </span>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
                        <span>{selectedFabric.name}</span> + <span>{selectedWood.name}</span>
                    </div>
                </div>
                <div className="flex items-center -space-x-2">
                    <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-colors"
                        style={{ backgroundColor: selectedFabric.hex }}
                        title={`Tkanina: ${selectedFabric.name}`}
                    />
                    <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-colors"
                        style={{ backgroundColor: selectedWood.hex }}
                        title={`Drewno: ${selectedWood.name}`}
                    />
                </div>
            </div>
        </div>
    );
};
