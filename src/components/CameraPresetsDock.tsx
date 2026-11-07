import React from 'react';
import { CAMERA_PRESETS } from '../config';

interface CameraPresetsDockProps {
    activePresetIdx: number;
    onSelectPreset: (idx: number) => void;
}

export const CameraPresetsDock: React.FC<CameraPresetsDockProps> = ({
    activePresetIdx,
    onSelectPreset
}) => {
    const shortLabels = [
        'Perspektywa 3/4',
        'Splot i poduszka',
        'Szczebelki oparcia',
        'Troczki z tyłu',
        'Stelaż H i czopy'
    ];

    return (
        <div className="grid grid-cols-5 gap-3">
            {CAMERA_PRESETS.map((_, idx) => {
                const isActive = activePresetIdx === idx;
                return (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectPreset(idx)}
                        className={`p-3 rounded-2xl modern-glass-dock text-left transition cursor-pointer group ${
                            isActive ? 'border-stone-900 ring-1 ring-stone-900' : 'hover:border-stone-900'
                        }`}
                    >
                        <span
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold mb-1 transition ${
                                isActive
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-900/10 text-stone-900 group-hover:bg-stone-900 group-hover:text-white'
                            }`}
                        >
                            0{idx + 1}
                        </span>
                        <strong className="block text-[11px] font-bold text-stone-900 truncate">
                            {shortLabels[idx]}
                        </strong>
                    </button>
                );
            })}
        </div>
    );
};
