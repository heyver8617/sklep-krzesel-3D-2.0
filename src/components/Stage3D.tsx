import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../config';
import { FabricOption, WoodOption } from '../types';

interface Stage3DProps {
    fabric: FabricOption;
    wood: WoodOption;
    isCushionMounted: boolean;
    hasFeltPads: boolean;
    stageMode: '3D' | '2D';
    activePresetIdx: number;
    isAutoRotate: boolean;
    onSwitchMode: (mode: '3D' | '2D') => void;
    onToggleAutoRotate: () => void;
    onOpenArModal: () => void;
    onSelectPreset: (idx: number) => void;
}

export const Stage3D: React.FC<Stage3DProps> = ({
    fabric,
    wood,
    isCushionMounted,
    hasFeltPads,
    stageMode,
    activePresetIdx,
    isAutoRotate,
    onSwitchMode,
    onToggleAutoRotate,
    onOpenArModal,
    onSelectPreset
}) => {
    const stageBoxRef = useRef<HTMLDivElement>(null);
    const canvasWrapRef = useRef<HTMLDivElement>(null);

    const woodMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const fabricMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const chairGroupRef = useRef<THREE.Group | null>(null);
    const cushionGroupRef = useRef<THREE.Group | null>(null);
    const feltGroupRef = useRef<THREE.Group | null>(null);

    const targetCamRef = useRef({
        theta: CAMERA_PRESETS[0].theta,
        phi: CAMERA_PRESETS[0].phi,
        radius: CAMERA_PRESETS[0].radius,
        lookY: CAMERA_PRESETS[0].lookY
    });

    const autoRotateRef = useRef(isAutoRotate);
    useEffect(() => {
        autoRotateRef.current = isAutoRotate;
    }, [isAutoRotate]);

    useEffect(() => {
        const wrap = canvasWrapRef.current;
        if (!wrap) return;

        const width = wrap.clientWidth || 720;
        const height = wrap.clientHeight || 540;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        wrap.innerHTML = '';
        wrap.appendChild(renderer.domElement);

        // Oświetlenie studyjne
        const ambient = new THREE.AmbientLight(0xFFFDF9, 0.78);
        scene.add(ambient);

        const mainLight = new THREE.DirectionalLight(0xFFF6E9, 1.25);
        mainLight.position.set(2.4, 3.9, 2.7);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xE8EEF5, 0.55);
        fillLight.position.set(-2.4, 1.8, -1.6);
        scene.add(fillLight);

        // Materiały PBR
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(wood.hex),
            roughness: wood.roughness,
            metalness: 0.04
        });
        woodMatRef.current = woodMaterial;

        const fabricMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(fabric.hex),
            roughness: fabric.roughness,
            metalness: 0.02
        });
        fabricMatRef.current = fabricMaterial;

        const screwMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E1D1B,
            roughness: 0.35,
            metalness: 0.85
        });

        const feltMaterial = new THREE.MeshStandardMaterial({
            color: 0x2B2A28,
            roughness: 0.95
        });

        // Budowa geometrii krzesła
        const chairRootGroup = new THREE.Group();
        chairGroupRef.current = chairRootGroup;
        scene.add(chairRootGroup);

        const legSize = 0.038;
        const halfX = 0.19;
        const halfZ = 0.19;
        const seatLevelY = 0.44;
        const topBackY = 0.95;

        const addWoodenBeam = (w: number, h: number, d: number, px: number, py: number, pz: number, rx = 0) => {
            const geom = new THREE.BoxGeometry(w, h, d, 2, 2, 2);
            const mesh = new THREE.Mesh(geom, woodMaterial);
            mesh.position.set(px, py, pz);
            mesh.rotation.x = rx;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            chairRootGroup.add(mesh);
            return mesh;
        };

        // 1. Nogi przednie i tylne
        addWoodenBeam(legSize, seatLevelY, legSize, -halfX, seatLevelY / 2, halfZ);
        addWoodenBeam(legSize, seatLevelY, legSize,  halfX, seatLevelY / 2, halfZ);
        addWoodenBeam(legSize, seatLevelY, legSize, -halfX, seatLevelY / 2, -halfZ);
        addWoodenBeam(legSize, seatLevelY, legSize,  halfX, seatLevelY / 2, -halfZ);

        // 2. Górne słupki oparcia
        const upperPostLen = topBackY - seatLevelY;
        const backrestTilt = -0.085;
        addWoodenBeam(legSize, upperPostLen, legSize, -halfX, seatLevelY + upperPostLen / 2 - 0.01, -halfZ - 0.022, backrestTilt);
        addWoodenBeam(legSize, upperPostLen, legSize,  halfX, seatLevelY + upperPostLen / 2 - 0.01, -halfZ - 0.022, backrestTilt);

        // Zwieńczenia słupków
        const topCapGeo = new THREE.CylinderGeometry(legSize / 2, legSize / 2, legSize, 16);
        topCapGeo.rotateZ(Math.PI / 2);
        [-halfX, halfX].forEach((x) => {
            const capMesh = new THREE.Mesh(topCapGeo, woodMaterial);
            capMesh.position.set(x, topBackY - 0.012, -halfZ - 0.044);
            capMesh.castShadow = true;
            chairRootGroup.add(capMesh);
        });

        // 3. Oskrzynia siedziska
        const apronH = 0.046;
        const apronThick = 0.022;
        const innerSpan = halfX * 2 - legSize;
        addWoodenBeam(innerSpan, apronH, apronThick, 0, seatLevelY - apronH / 2, halfZ);
        addWoodenBeam(innerSpan, apronH, apronThick, 0, seatLevelY - apronH / 2, -halfZ);
        addWoodenBeam(apronThick, apronH, innerSpan, -halfX, seatLevelY - apronH / 2, 0);
        addWoodenBeam(apronThick, apronH, innerSpan,  halfX, seatLevelY - apronH / 2, 0);

        // 4. Drewniana płyta siedziska
        addWoodenBeam(0.41, 0.022, 0.38, 0, seatLevelY + 0.011, 0.0);

        // 5. Dolny stelaż H
        const stretcherLevelY = 0.145;
        const stretcherH = 0.028;
        const stretcherThick = 0.020;
        addWoodenBeam(stretcherThick, stretcherH, innerSpan, -halfX, stretcherLevelY, 0);
        addWoodenBeam(stretcherThick, stretcherH, innerSpan,  halfX, stretcherLevelY, 0);
        addWoodenBeam(innerSpan + 0.01, stretcherH, stretcherThick, 0, stretcherLevelY, -0.015);

        // 6. Trzy profilowane szczebelki oparcia
        const slatLevelsY = [0.60, 0.745, 0.89];
        const slatOffsetsZ = [-0.014, -0.026, -0.038];
        slatLevelsY.forEach((posY, index) => {
            const slatGeom = new THREE.BoxGeometry(innerSpan + 0.006, 0.062, 0.016, 32, 4, 2);
            const posAttr = slatGeom.attributes.position as THREE.BufferAttribute;

            for (let i = 0; i < posAttr.count; i++) {
                const vx = posAttr.getX(i);
                const vy = posAttr.getY(i);
                const vz = posAttr.getZ(i);
                const normX = vx / (innerSpan / 2);
                const waveArch = Math.cos(normX * Math.PI * 0.55) * 0.014;

                if (vy > 0) posAttr.setY(i, vy + waveArch);
                else posAttr.setY(i, vy + waveArch * 0.15);

                const lumbarCurve = (1 - normX * normX) * -0.010;
                posAttr.setZ(i, vz + lumbarCurve);
            }
            slatGeom.computeVertexNormals();

            const slatMesh = new THREE.Mesh(slatGeom, woodMaterial);
            slatMesh.position.set(0, posY, -halfZ + slatOffsetsZ[index]);
            slatMesh.rotation.x = backrestTilt;
            slatMesh.castShadow = true;
            slatMesh.receiveShadow = true;
            chairRootGroup.add(slatMesh);
        });

        // 7. Śruby montażowe
        const screwGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.006, 12);
        screwGeo.rotateZ(Math.PI / 2);
        const screwCoords: [number, number, number][] = [
            [-halfX - legSize / 2, seatLevelY - 0.022, halfZ],
            [ halfX + legSize / 2, seatLevelY - 0.022, halfZ],
            [-halfX - legSize / 2, seatLevelY - 0.022, -halfZ],
            [ halfX + legSize / 2, seatLevelY - 0.022, -halfZ]
        ];
        screwCoords.forEach(([sx, sy, sz]) => {
            const screw = new THREE.Mesh(screwGeo, screwMaterial);
            screw.position.set(sx, sy, sz);
            chairRootGroup.add(screw);
        });

        // 8. Pikowana poduszka siedziska z 4 wgłębieniami i troczkami
        const cushionSubGroup = new THREE.Group();
        cushionGroupRef.current = cushionSubGroup;
        chairRootGroup.add(cushionSubGroup);

        const cWidth = 0.41;
        const cHeight = 0.065;
        const cDepth = 0.38;
        const cushionGeo = new THREE.BoxGeometry(cWidth, cHeight, cDepth, 48, 14, 48);
        const cAttr = cushionGeo.attributes.position as THREE.BufferAttribute;

        const tuftCenters: [number, number][] = [
            [-0.075, -0.07],
            [ 0.075, -0.07],
            [-0.075,  0.07],
            [ 0.075,  0.07]
        ];

        for (let i = 0; i < cAttr.count; i++) {
            let x = cAttr.getX(i);
            let y = cAttr.getY(i);
            let z = cAttr.getZ(i);

            const nx = x / (cWidth / 2);
            const ny = y / (cHeight / 2);
            const nz = z / (cDepth / 2);

            const pillowProfile = Math.max(0, 1 - (nx * nx * nx * nx * 0.45 + nz * nz * nz * nz * 0.45));
            y *= (0.52 + 0.58 * pillowProfile);

            const sideBulge = (1 - ny * ny) * 0.012;
            x += Math.sign(x) * sideBulge * (1 - Math.abs(nz) * 0.3);
            z += Math.sign(z) * sideBulge * (1 - Math.abs(nx) * 0.3);

            if (ny > -0.2) {
                let pullDepth = 0;
                for (const [tx, tz] of tuftCenters) {
                    const dSq = (x - tx) * (x - tx) + (z - tz) * (z - tz);
                    const dist = Math.sqrt(dSq);
                    pullDepth += Math.exp(-dSq / 0.0016) * 0.024;
                    const foldAngle = Math.atan2(z - tz, x - tx);
                    const foldWave = Math.sin(foldAngle * 6) * Math.exp(-dSq / 0.0035) * 0.0022 * (dist / 0.04);
                    y += foldWave;
                }
                y -= pullDepth * ((ny + 0.2) / 1.2);
            }

            cAttr.setXYZ(i, x, y, z);
        }
        cushionGeo.computeVertexNormals();

        const cushionMesh = new THREE.Mesh(cushionGeo, fabricMaterial);
        cushionMesh.position.set(0, seatLevelY + 0.043, 0.0);
        cushionMesh.castShadow = true;
        cushionMesh.receiveShadow = true;
        cushionSubGroup.add(cushionMesh);

        // Guziczki w 4 pikowaniach
        const btnGeo = new THREE.SphereGeometry(0.006, 12, 8);
        btnGeo.scale(1, 0.4, 1);
        tuftCenters.forEach(([tx, tz]) => {
            const btnMesh = new THREE.Mesh(btnGeo, fabricMaterial);
            btnMesh.position.set(tx, seatLevelY + 0.049, tz);
            cushionSubGroup.add(btnMesh);
        });

        // Troczki elegancko opięte wokół tylnych słupków
        [-halfX, halfX].forEach((posX) => {
            const strapGeo = new THREE.BoxGeometry(0.042, 0.018, 0.042);
            const strapMesh = new THREE.Mesh(strapGeo, fabricMaterial);
            strapMesh.position.set(posX, seatLevelY + 0.042, -halfZ);
            strapMesh.castShadow = true;
            cushionSubGroup.add(strapMesh);
        });

        // 9. Stopki filcowe pod nogami
        const feltPadsGroup = new THREE.Group();
        feltGroupRef.current = feltPadsGroup;
        const feltGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.008, 16);
        [-halfX, halfX].forEach((x) => {
            [-halfZ, halfZ].forEach((z) => {
                const pad = new THREE.Mesh(feltGeo, feltMaterial);
                pad.position.set(x, -0.004, z);
                feltPadsGroup.add(pad);
            });
        });
        feltPadsGroup.visible = false;
        chairRootGroup.add(feltPadsGroup);

        // Cień na podłodze
        const floorGeo = new THREE.PlaneGeometry(5, 5);
        const floorMat = new THREE.ShadowMaterial({ opacity: 0.22 });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = 0;
        floorMesh.receiveShadow = true;
        scene.add(floorMesh);

        // Obsługa myszy i dotyku
        let dragging = false;
        let lastX = 0;
        let lastY = 0;

        const onMouseDown = (e: MouseEvent) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;

            targetCamRef.current.theta -= dx * 0.008;
            targetCamRef.current.phi = Math.max(0.35, Math.min(1.52, targetCamRef.current.phi - dy * 0.007));
        };

        const onMouseUp = () => {
            dragging = false;
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            targetCamRef.current.radius = Math.max(0.92, Math.min(2.65, targetCamRef.current.radius + e.deltaY * 0.0012));
        };

        const domElem = renderer.domElement;
        domElem.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        domElem.addEventListener('wheel', onWheel, { passive: false });

        const handleResize = () => {
            if (!wrap) return;
            const w = wrap.clientWidth || 720;
            const h = wrap.clientHeight || 540;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);
        document.addEventListener('fullscreenchange', handleResize);

        // Pętla animacji
        let animId = 0;
        let camTheta = targetCamRef.current.theta;
        let camPhi = targetCamRef.current.phi;
        let camRadius = targetCamRef.current.radius;
        let camLookY = targetCamRef.current.lookY;

        const animate = () => {
            animId = requestAnimationFrame(animate);

            if (autoRotateRef.current) {
                targetCamRef.current.theta += 0.0045;
            }

            camTheta += (targetCamRef.current.theta - camTheta) * 0.1;
            camPhi += (targetCamRef.current.phi - camPhi) * 0.1;
            camRadius += (targetCamRef.current.radius - camRadius) * 0.1;
            camLookY += (targetCamRef.current.lookY - camLookY) * 0.1;

            camera.position.x = camRadius * Math.sin(camPhi) * Math.sin(camTheta);
            camera.position.y = camRadius * Math.cos(camPhi) + 0.14;
            camera.position.z = camRadius * Math.sin(camPhi) * Math.cos(camTheta);
            camera.lookAt(0, camLookY, 0);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            domElem.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            domElem.removeEventListener('wheel', onWheel);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('fullscreenchange', handleResize);
            renderer.dispose();
        };
    }, []);

    // Reakcja na zmianę koloru tkaniny
    useEffect(() => {
        if (fabricMatRef.current) {
            fabricMatRef.current.color.set(fabric.hex);
            fabricMatRef.current.roughness = fabric.roughness;
        }
    }, [fabric]);

    // Reakcja na zmianę koloru drewna
    useEffect(() => {
        if (woodMatRef.current) {
            woodMatRef.current.color.set(wood.hex);
            woodMatRef.current.roughness = wood.roughness;
        }
    }, [wood]);

    // Reakcja na zdjęcie/założenie poduszki
    useEffect(() => {
        if (cushionGroupRef.current) {
            cushionGroupRef.current.visible = isCushionMounted;
        }
    }, [isCushionMounted]);

    // Reakcja na stopki filcowe (widoczne podkładki + uniesienie krzesła)
    useEffect(() => {
        if (feltGroupRef.current) {
            feltGroupRef.current.visible = hasFeltPads;
        }
        if (chairGroupRef.current) {
            chairGroupRef.current.position.y = hasFeltPads ? 0.012 : 0;
        }
    }, [hasFeltPads]);

    // Reakcja na zmianę presetu kamery
    useEffect(() => {
        const preset = CAMERA_PRESETS[activePresetIdx];
        if (preset) {
            targetCamRef.current = {
                theta: preset.theta,
                phi: preset.phi,
                radius: preset.radius,
                lookY: preset.lookY
            };
        }
    }, [activePresetIdx]);

    const handleZoom = (delta: number) => {
        targetCamRef.current.radius = Math.max(0.92, Math.min(2.65, targetCamRef.current.radius + delta));
    };

    const handleResetCamera = () => {
        onSelectPreset(0);
        targetCamRef.current = {
            theta: CAMERA_PRESETS[0].theta,
            phi: CAMERA_PRESETS[0].phi,
            radius: CAMERA_PRESETS[0].radius,
            lookY: CAMERA_PRESETS[0].lookY
        };
    };

    const handleToggleFullscreen = () => {
        const box = stageBoxRef.current;
        if (!box) return;
        if (!document.fullscreenElement) {
            box.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    };

    return (
        <div
            ref={stageBoxRef}
            className="relative w-full aspect-[4/3] rounded-3xl stage-3d-surface overflow-hidden shadow-xl flex items-center justify-center"
        >
            {/* Przełącznik 3D / 2D */}
            <div className="absolute top-5 right-5 z-30 flex gap-1.5 p-1 bg-white/85 backdrop-blur-md rounded-xl border border-black/10 shadow-sm">
                <button
                    type="button"
                    onClick={() => onSwitchMode('3D')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        stageMode === '3D' ? 'bg-stone-900 text-stone-100' : 'text-stone-700 hover:text-stone-950'
                    }`}
                >
                    3D
                </button>
                <button
                    type="button"
                    onClick={() => onSwitchMode('2D')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        stageMode === '2D' ? 'bg-stone-900 text-stone-100' : 'text-stone-700 hover:text-stone-950'
                    }`}
                >
                    2D
                </button>
            </div>

            {/* Pływające narzędzia 3D po lewej stronie */}
            <div className="absolute left-5 top-5 z-30 flex flex-col gap-2 p-1.5 bg-white/85 backdrop-blur-md rounded-2xl border border-black/10 shadow-sm">
                <button
                    type="button"
                    onClick={onToggleAutoRotate}
                    title="Obrót automatyczny 360°"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                        isAutoRotate ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => handleZoom(-0.22)}
                    title="Przybliż"
                    className="w-9 h-9 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => handleZoom(0.22)}
                    title="Oddal"
                    className="w-9 h-9 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 12H6" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    title="Pełny ekran"
                    className="w-9 h-9 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleResetCamera}
                    title="Reset widoku"
                    className="w-9 h-9 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>
            </div>

            {/* Płótno WebGL Three.js */}
            <div ref={canvasWrapRef} className="w-full h-full absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

            {/* Nakładka 2D (wyświetlana wyłącznie w trybie 2D) */}
            {stageMode === '2D' && (
                <div className="absolute inset-0 bg-[#FAF8F5] z-20 flex flex-col items-center justify-center p-8 text-center">
                    <h4 className="font-editorial text-2xl font-bold text-stone-900 mb-2">Rzut techniczny i wymiary</h4>
                    <p className="text-xs text-stone-600 max-w-sm mb-6">
                        Ergonomiczna forma zgodna ze standardem antropometrycznym krzeseł jadalnianych.
                    </p>
                    <div className="relative w-64 h-64 border-2 border-dashed border-stone-400 rounded-2xl flex items-center justify-center bg-stone-100">
                        <div className="absolute -top-3.5 bg-stone-900 text-white text-[10px] px-2.5 py-0.5 rounded font-mono">
                            Szerokość: 45 cm
                        </div>
                        <div className="absolute -bottom-3.5 bg-stone-900 text-white text-[10px] px-2.5 py-0.5 rounded font-mono">
                            Głębokość: 47 cm
                        </div>
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 bg-stone-900 text-white text-[10px] px-2.5 py-0.5 rounded font-mono">
                            Wysokość: 95 cm
                        </div>
                        <div className="w-36 h-36 border border-stone-900/40 bg-stone-200/50 rounded-xl flex flex-col items-center justify-center text-xs font-semibold text-stone-700 p-2">
                            <span>KRAKOSKI STOŁEK</span>
                            <span className="text-[10px] text-stone-500 mt-1">Siedzisko: 45 cm</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Przycisk AR */}
            <div className="absolute bottom-5 left-5 z-30">
                <button
                    type="button"
                    onClick={onOpenArModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-xl border border-black/10 text-stone-900 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                    <svg className="w-4 h-4 text-[#9E3321]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span>Zobacz w AR</span>
                </button>
            </div>

            <div className="absolute bottom-5 right-5 z-30 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-medium text-stone-700 border border-black/10 shadow-sm">
                {CAMERA_PRESETS[activePresetIdx]?.title}
            </div>
        </div>
    );
};
