import { FabricOption, WoodOption, CameraPreset } from './types';

export const BASE_PRICE_PLN = 899;
export const FELT_PADS_PRICE_PLN = 29;

export const FABRIC_OPTIONS: FabricOption[] = [
    { code: 'RED', name: 'Czerwony Karmin', hex: '#B8141C', roughness: 0.84, price: 0, spec: 'Bawełna czesana 420 g/m² • 85 000 cykli • Wiązana na 2 troczki' },
    { code: 'BLK', name: 'Czarny Antracyt', hex: '#222326', roughness: 0.74, price: 0, spec: 'Welur matowy 450 g/m² • 90 000 cykli • Powłoka hydrofobowa' },
    { code: 'GRF', name: 'Szary Grafit', hex: '#505358', roughness: 0.78, price: 0, spec: 'Plecionka strukturalna • 80 000 cykli • Odporna na mechacenie' },
    { code: 'ASH', name: 'Jasny Popiel', hex: '#93969B', roughness: 0.82, price: 0, spec: 'Splot płócienny • 75 000 cykli • Certyfikat Oeko-Tex' },
    { code: 'CRM', name: 'Kremowe Bouclé', hex: '#DFD7C8', roughness: 0.88, price: 20, spec: 'Bouclé nordyckie • 70 000 cykli • Miękka faktura' },
    { code: 'SND', name: 'Beż Piaskowy', hex: '#B8A793', roughness: 0.85, price: 20, spec: 'Len naturalny z bawełną • 75 000 cykli • Przewiewny splot' },
    { code: 'FOR', name: 'Szmaragdowy Welur', hex: '#1D4D3E', roughness: 0.72, price: 30, spec: 'Welur szlachetny • 100 000 cykli • Głęboki mat' },
    { code: 'NVY', name: 'Granat Królewski', hex: '#1C3150', roughness: 0.76, price: 30, spec: 'Wełna czesankowa • 95 000 cykli • Termoregulacyjna' },
    { code: 'TER', name: 'Rdzawa Terakota', hex: '#A8422B', roughness: 0.80, price: 25, spec: 'Splot szenilowy • 85 000 cykli • Ciepły odcień ziemi' },
    { code: 'OCH', name: 'Musztardowa Ochra', hex: '#C88622', roughness: 0.82, price: 25, spec: 'Drelich tapicerski • 85 000 cykli • Wyrazisty akcent' }
];

export const WOOD_OPTIONS: WoodOption[] = [
    { code: 'OAK', name: 'Dąb Miodowy', hex: '#B66E28', roughness: 0.42, price: 0 },
    { code: 'WAL', name: 'Orzech Ciemny', hex: '#59351F', roughness: 0.38, price: 50 },
    { code: 'NAT', name: 'Dąb Naturalny', hex: '#D29C60', roughness: 0.48, price: 30 },
    { code: 'BLK', name: 'Czarny Jesion', hex: '#24211E', roughness: 0.45, price: 60 }
];

export const CAMERA_PRESETS: CameraPreset[] = [
    { theta: 0.56, phi: 1.18, radius: 1.78, lookY: 0.47, title: 'Ujęcie 01: Perspektywa 3/4' },
    { theta: 0.25, phi: 0.80, radius: 1.05, lookY: 0.48, title: 'Ujęcie 02: Splot i poduszka' },
    { theta: 0.12, phi: 1.12, radius: 1.25, lookY: 0.74, title: 'Ujęcie 03: Szczebelki oparcia' },
    { theta: 2.68, phi: 1.15, radius: 1.38, lookY: 0.58, title: 'Ujęcie 04: Troczki z tyłu' },
    { theta: 0.82, phi: 1.32, radius: 1.35, lookY: 0.22, title: 'Ujęcie 05: Stelaż H i czopy' }
];
