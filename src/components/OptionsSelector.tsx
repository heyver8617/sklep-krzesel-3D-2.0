import React from 'react';

interface OptionsSelectorProps {
    isCushionMounted: boolean;
    hasFeltPads: boolean;
    onToggleCushion: () => void;
    onToggleFeltPads: () => void;
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = ({
    isCushionMounted,
    hasFeltPads,
    onToggleCushion,
    onToggleFeltPads
}) => {
    return (
        <div className="bg-white border border-[#DCD6CA] rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                3. Opcje poduszki i wykończenia
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={onToggleCushion}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isCushionMounted
                            ? 'border-stone-900 bg-stone-900/5'
                            : 'border-[#DCD6CA] bg-white'
                    }`}
                >
                    <div>
                        <span className="text-xs font-bold text-stone-900 block">Pikowana poduszka</span>
                        <span className="text-[10px] text-stone-500 block">
                            {isCushionMounted ? 'Założona (z troczkami)' : 'Zdjęta (widoczne lite drewno)'}
                        </span>
                    </div>
                    <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            isCushionMounted ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-700'
                        }`}
                    >
                        {isCushionMounted ? 'TAK' : 'BRAK'}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={onToggleFeltPads}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                        hasFeltPads
                            ? 'border-stone-900 bg-stone-900/5'
                            : 'border-[#DCD6CA] bg-white'
                    }`}
                >
                    <div>
                        <span className="text-xs font-bold text-stone-900 block">Stopki filcowe</span>
                        <span className="text-[10px] text-stone-500 block">Ochrona parkietu (+29 zł)</span>
                    </div>
                    <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            hasFeltPads ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-700'
                        }`}
                    >
                        {hasFeltPads ? 'WYBRANO' : 'DODAJ'}
                    </span>
                </button>
            </div>
        </div>
    );
};
