import React from 'react';
import { FABRIC_OPTIONS } from '../config';

interface FabricSelectorProps {
    selectedIndex: number;
    onSelect: (index: number) => void;
}

export const FabricSelector: React.FC<FabricSelectorProps> = ({ selectedIndex, onSelect }) => {
    const selected = FABRIC_OPTIONS[selectedIndex];

    return (
        <div className="bg-white border border-[#DCD6CA] rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    1. Wybierz tkaninę poduszki
                </h3>
                <span className="text-xs font-semibold text-[#9E3321]">
                    {selected.name} {selected.price > 0 ? `(+${selected.price} zł)` : ''}
                </span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
                {FABRIC_OPTIONS.map((fabric, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                        <button
                            key={fabric.code}
                            type="button"
                            onClick={() => onSelect(idx)}
                            className={`w-10 h-10 rounded-xl shadow-sm hover:scale-105 transition cursor-pointer ${
                                isSelected ? 'swatch-active' : ''
                            }`}
                            style={{ backgroundColor: fabric.hex }}
                            title={fabric.name}
                        />
                    );
                })}
            </div>

            <p className="text-[11px] text-stone-500">
                Tkanina: {selected.name} • {selected.spec}
            </p>
        </div>
    );
};
