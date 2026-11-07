export interface FabricOption {
    code: string;
    name: string;
    hex: string;
    roughness: number;
    price: number;
    spec: string;
}

export interface WoodOption {
    code: string;
    name: string;
    hex: string;
    roughness: number;
    price: number;
}

export interface CameraPreset {
    theta: number;
    phi: number;
    radius: number;
    lookY: number;
    title: string;
}

export interface CartItem {
    id: string;
    name: string;
    fabricName: string;
    fabricHex: string;
    woodName: string;
    woodHex: string;
    hasCushion: boolean;
    hasFelt: boolean;
    price: number;
    quantity: number;
}

export interface ToastData {
    title: string;
    message: string;
}
