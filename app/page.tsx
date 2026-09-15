'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';
import { ArrowRight, ChevronDown } from 'lucide-react';

/* ── Stable seed data (no Math.random at render time) ── */
const DUST_MOTES = [
  { id:0, left:'22%', top:'35%', size:'2px', duration:'5.2s', delay:'0s',    opacity:0.5 },
  { id:1, left:'38%', top:'42%', size:'3px', duration:'6.8s', delay:'0.8s',  opacity:0.4 },
  { id:2, left:'51%', top:'30%', size:'2px', duration:'4.6s', delay:'1.6s',  opacity:0.6 },
  { id:3, left:'63%', top:'55%', size:'4px', duration:'7.1s', delay:'0.4s',  opacity:0.35 },
  { id:4, left:'29%', top:'60%', size:'2px', duration:'5.9s', delay:'2.2s',  opacity:0.45 },
  { id:5, left:'74%', top:'38%', size:'3px', duration:'6.3s', delay:'1.0s',  opacity:0.5 },
  { id:6, left:'45%', top:'48%', size:'2px', duration:'4.9s', delay:'3.1s',  opacity:0.55 },
  { id:7, left:'58%', top:'62%', size:'3px', duration:'8.0s', delay:'0.2s',  opacity:0.3 },
  { id:8, left:'33%', top:'28%', size:'2px', duration:'5.5s', delay:'1.8s',  opacity:0.6 },
  { id:9, left:'67%', top:'45%', size:'2px', duration:'6.6s', delay:'2.8s',  opacity:0.4 },
  { id:10,left:'78%', top:'58%', size:'3px', duration:'7.3s', delay:'0.6s',  opacity:0.45 },
  { id:11,left:'42%', top:'70%', size:'2px', duration:'5.0s', delay:'1.4s',  opacity:0.5 },
  { id:12,left:'55%', top:'33%', size:'4px', duration:'6.1s', delay:'2.5s',  opacity:0.35 },
  { id:13,left:'25%', top:'52%', size:'2px', duration:'8.2s', delay:'0.9s',  opacity:0.6 },
  { id:14,left:'70%', top:'65%', size:'3px', duration:'4.8s', delay:'3.4s',  opacity:0.4 },
  { id:15,left:'48%', top:'40%', size:'2px', duration:'7.5s', delay:'1.2s',  opacity:0.55 },
  { id:16,left:'36%', top:'67%', size:'3px', duration:'5.7s', delay:'2.0s',  opacity:0.45 },
  { id:17,left:'61%', top:'50%', size:'2px', duration:'6.4s', delay:'3.8s',  opacity:0.5 },
];

/* ─────────────────────────────────────────────────────────
   COLLECTION PANELS
   ───────────────────────────────────────────────────────── */
const COLLECTIONS = [
  {
    id: 'mens',
    label: 'I',
    tag: "TRADITIONAL MEN'S",
    title: 'THE HERITAGE\nGENTLEMAN',
    subtitle: 'Structured silhouettes · Heritage tailoring · Timeless authority',
    description: 'Crafted for the discerning man. Each piece rooted in centuries of Florentine artisanship — heavyweight wools, hand-rolled lapels, and obsidian-dyed linens built to outlast fashion itself.',
    cta: "EXPLORE MEN'S",
    link: '/products?category=Apparel',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1920',
    bgColor: '#0e0c0a',
    accentColor: '#c5a46d',
    textColor: '#f5f0e8',
    overlayGradient: 'linear-gradient(105deg, rgba(14,12,10,0.92) 0%, rgba(14,12,10,0.65) 50%, rgba(14,12,10,0.3) 100%)',
    borderColor: 'rgba(197,164,109,0.35)',
    tagColor: '#c5a46d',
  },
  {
    id: 'womens',
    label: 'II',
    tag: "WOMEN'S COLLECTION",
    title: 'FLUID\nELEGANCE',
    subtitle: 'Draped silk · Champagne tones · Feminine architecture',
    description: 'A language of softness spoken through structure. Bias-cut silks, raw-edge cashmere, and ivory organza designed for the woman who commands a room without a word.',
    cta: "EXPLORE WOMEN'S",
    link: '/products?category=Outerwear',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920',
    bgColor: '#f5f0eb',
    accentColor: '#8b6b4a',
    textColor: '#1a1008',
    overlayGradient: 'linear-gradient(105deg, rgba(245,240,235,0.88) 0%, rgba(245,240,235,0.55) 50%, rgba(245,240,235,0.15) 100%)',
    borderColor: 'rgba(139,107,74,0.4)',
    tagColor: '#8b6b4a',
  },
  {
    id: 'western',
    label: 'III',
    tag: 'WESTERN COLLECTION',
    title: 'FRONTIER\nBOLDNESS',
    subtitle: 'Raw denim · Aged leather · Untamed spirit',
    description: 'Where the frontier meets the atelier. Dark indigo selvedge, hand-tooled leather, and brushed suede — garments built for those who live without borders.',
    cta: 'EXPLORE WESTERN',
    link: '/products?category=Footwear',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920',
    bgColor: '#0d1220',
    accentColor: '#8b5e3c',
    textColor: '#e8ddd0',
    overlayGradient: 'linear-gradient(105deg, rgba(13,18,32,0.93) 0%, rgba(13,18,32,0.65) 50%, rgba(13,18,32,0.25) 100%)',
    borderColor: 'rgba(139,94,60,0.4)',
    tagColor: '#8b5e3c',
  },
];

/* ─────────────────────────────────────────────────────────
   REALISTIC STORE DOOR
   ───────────────────────────────────────────────────────── */
function StoreDoor({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'waiting' | 'opening' | 'exiting'>('waiting');
  const triggered = useRef(false);

  const open = () => {
    if (triggered.current) return;
    triggered.current = true;
    setPhase('opening');
    // Doors swing fully open after 2.5s → then fade scene out
    setTimeout(() => {
      setPhase('exiting');
      setTimeout(onComplete, 900);
    }, 2500);
  };

  // Auto-open after 2s
  useEffect(() => {
    const t = setTimeout(open, 2000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isOpen = phase === 'opening' || phase === 'exiting';

  return (
    <div
      className="door-scene"
      onClick={() => phase === 'waiting' && open()}
      style={{
        cursor: phase === 'waiting' ? 'pointer' : 'default',
        opacity: phase === 'exiting' ? 0 : 1,
        transition: phase === 'exiting' ? 'opacity 1s ease 1.9s' : 'none',
        pointerEvents: phase === 'exiting' ? 'none' : 'all',
      }}
    >

      {/* ══ LAYER 0: Luxury boutique interior — revealed behind the doors ══ */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=90&w=1920"
          alt="Maison RK atelier interior"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.7) saturate(0.8)' }}
        />
        {/* Warm amber-gold boutique atmosphere overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg,rgba(38,22,6,0.55) 0%,rgba(18,10,2,0.25) 55%,rgba(8,5,1,0.75) 100%)',
          }}
        />
        {/* Chandelier warm glow from within */}
        <div
          className="absolute"
          style={{
            top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '65%', height: '65%',
            background:
              'radial-gradient(ellipse at 50% 25%, rgba(255,210,120,0.25) 0%, rgba(220,160,60,0.08) 55%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ══ LAYER 1: Exterior stone facade walls flanking the doorway ══ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Left wall */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            right: 'calc(50% + min(352px, 40.5vw))',
            background: 'linear-gradient(90deg,#080604 0%,#111009 65%,#1c1610 100%)',
            boxShadow: 'inset -35px 0 70px rgba(0,0,0,0.85)',
          }}
        />
        {/* Right wall */}
        <div
          className="absolute right-0 top-0 bottom-0"
          style={{
            left: 'calc(50% + min(352px, 40.5vw))',
            background: 'linear-gradient(270deg,#080604 0%,#111009 65%,#1c1610 100%)',
            boxShadow: 'inset 35px 0 70px rgba(0,0,0,0.85)',
          }}
        />
      </div>

      {/* ══ LAYER 2: Doorway frame + panels ══ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative flex-shrink-0"
          style={{ width: 'min(700px, 80vw)', height: 'min(848px, 91vh)' }}
        >

          {/* Thick architectural frame moulding */}
          <div
            className="absolute"
            style={{
              inset: '-30px -34px',
              background: 'linear-gradient(140deg,#1f160d 0%,#130e07 45%,#0e0a04 100%)',
              boxShadow: `
                inset 0 0 0 3px rgba(197,164,109,0.6),
                inset 0 0 0 7px rgba(28,18,8,0.95),
                inset 0 0 0 10px rgba(197,164,109,0.18),
                0 0 100px rgba(0,0,0,0.95),
                0 0 200px rgba(0,0,0,0.65)
              `,
            }}
          />

          {/* Keystone above door */}
          <div
            className="absolute"
            style={{
              top: '-56px', left: '50%', transform: 'translateX(-50%)',
              width: '130px', height: '32px',
              background: 'linear-gradient(180deg,#1f160d,#130e07)',
              boxShadow: 'inset 0 0 0 2px rgba(197,164,109,0.45),0 -6px 24px rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '8px', letterSpacing: '0.42em',
                color: 'rgba(197,164,109,0.72)',
                fontFamily: 'Georgia,serif', fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              MRK
            </span>
          </div>

          {/* Left pilaster */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: '-34px', width: '34px',
              background: 'linear-gradient(90deg,#0b0804 0%,#1a1208 55%,#231911 100%)',
            }}
          >
            <div
              className="absolute inset-y-0 right-0"
              style={{
                width: '2px',
                background:
                  'linear-gradient(180deg,rgba(197,164,109,0.08),rgba(197,164,109,0.55),rgba(197,164,109,0.08))',
              }}
            />
          </div>
          {/* Right pilaster */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              right: '-34px', width: '34px',
              background: 'linear-gradient(270deg,#0b0804 0%,#1a1208 55%,#231911 100%)',
            }}
          >
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: '2px',
                background:
                  'linear-gradient(180deg,rgba(197,164,109,0.08),rgba(197,164,109,0.55),rgba(197,164,109,0.08))',
              }}
            />
          </div>

          {/* Volumetric light rays — fade in as doors part */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 1.4s ease 0.5s' }}
          >
            {([-10, -3, 0, 3, 10] as number[]).map((deg, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: '-15%', left: '50%',
                  transform: `translateX(-50%) rotate(${deg}deg)`,
                  transformOrigin: 'top center',
                  width: '3px', height: '130%',
                  background:
                    'linear-gradient(180deg,rgba(255,210,120,0) 0%,rgba(255,210,120,0.18) 35%,rgba(255,200,100,0.28) 60%,rgba(255,210,120,0) 100%)',
                  filter: 'blur(14px)',
                }}
              />
            ))}
            {/* Broad warm glow zone */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: '20%', right: '20%',
                background:
                  'linear-gradient(180deg,rgba(255,200,100,0.07) 0%,rgba(255,180,60,0.15) 45%,rgba(255,200,100,0.05) 100%)',
                filter: 'blur(22px)',
              }}
            />
          </div>

          {/* Dust motes */}
          {isOpen && DUST_MOTES.map((m) => (
            <div
              key={m.id}
              className="dust-mote absolute rounded-full pointer-events-none"
              style={{
                left: m.left, top: m.top,
                width: m.size, height: m.size,
                background: 'rgba(255,225,155,0.92)',
                animationDuration: m.duration,
                animationDelay: m.delay,
                opacity: m.opacity,
                filter: 'blur(0.4px)',
              }}
            />
          ))}

          {/* ══════ LEFT DOOR ══════ */}
          <div
            className={`door-left absolute top-0 left-0 h-full overflow-hidden${isOpen ? ' opening' : ''}`}
            style={{
              width: '50%',
              boxShadow: isOpen
                ? '-12px 0 50px rgba(0,0,0,0.98),-3px 0 14px rgba(0,0,0,0.85)'
                : '3px 0 14px rgba(0,0,0,0.65)',
              transition: 'box-shadow 0.6s ease',
            }}
          >
            {/* Real dark wood texture */}
            <img
              src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800"
              alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.22) saturate(0.55) sepia(0.5)' }}
            />
            {/* Dark lacquer coat */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(155deg,rgba(30,21,12,0.84) 0%,rgba(18,12,6,0.9) 55%,rgba(24,16,8,0.8) 100%)',
              }}
            />
            {/* Specular lacquer sheen */}
            <div
              className="absolute inset-y-0"
              style={{
                left: '8%', width: '22%',
                background:
                  'linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)',
              }}
            />

            {/* Upper panel moulding */}
            <div
              className="absolute"
              style={{
                top: '5.5%', left: '7%', right: '13%', bottom: '53%',
                boxShadow: `
                  inset 2.5px 2.5px 0 rgba(197,164,109,0.4),
                  inset -2.5px -2.5px 0 rgba(0,0,0,0.55),
                  inset 0 0 0 1px rgba(197,164,109,0.2)
                `,
              }}
            >
              <div
                className="absolute"
                style={{
                  inset: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  boxShadow: 'inset 1px 1px 5px rgba(0,0,0,0.55)',
                }}
              />
            </div>

            {/* Lower panel moulding */}
            <div
              className="absolute"
              style={{
                top: '49%', left: '7%', right: '13%', bottom: '4.5%',
                boxShadow: `
                  inset 2.5px 2.5px 0 rgba(197,164,109,0.4),
                  inset -2.5px -2.5px 0 rgba(0,0,0,0.55),
                  inset 0 0 0 1px rgba(197,164,109,0.2)
                `,
              }}
            >
              <div
                className="absolute"
                style={{
                  inset: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  boxShadow: 'inset 1px 1px 5px rgba(0,0,0,0.55)',
                }}
              />
            </div>

            {/* Horizontal mid-rail */}
            <div
              className="absolute inset-x-0"
              style={{
                top: '46%', height: '4%',
                background:
                  'linear-gradient(180deg,rgba(197,164,109,0.065),rgba(197,164,109,0.02))',
                borderTop: '1px solid rgba(197,164,109,0.18)',
                borderBottom: '1px solid rgba(197,164,109,0.18)',
              }}
            />

            {/* Brass handle + escutcheon — left door (handle near seam, right side) */}
            <div
              className="door-handle absolute"
              style={{ right: '9px', top: '46.5%', transform: 'translateY(-50%)' }}
            >
              {/* Escutcheon backplate */}
              <div
                style={{
                  width: '15px', height: '96px',
                  background:
                    'linear-gradient(180deg,#9f7618 0%,#c9a86c 18%,#ecca7a 38%,#c9a86c 58%,#9a6f12 80%,#c9a86c 100%)',
                  borderRadius: '3px',
                  boxShadow:
                    '0 0 0 1px rgba(90,60,8,0.55),0 3px 10px rgba(0,0,0,0.75),inset 1.5px 0 3px rgba(255,255,255,0.22)',
                  position: 'relative',
                }}
              >
                {/* Keyhole */}
                <div
                  style={{
                    position: 'absolute',
                    top: '49%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: '5px', height: '9px',
                    background: '#090705',
                    borderRadius: '50% 50% 0 0',
                    boxShadow: '0 5px 0 #090705',
                  }}
                />
              </div>
              {/* Handle lever bar */}
              <div
                style={{
                  position: 'absolute', right: '13px', top: '24px',
                  width: '26px', height: '11px',
                  background:
                    'linear-gradient(90deg,#9f7618,#ecca7a 42%,#c9a86c 72%,#9a6f12)',
                  borderRadius: '4px 0 0 4px',
                  boxShadow:
                    '0 3px 9px rgba(0,0,0,0.72),inset 0 1.5px 3px rgba(255,255,255,0.28)',
                  transform: 'rotate(-2deg)',
                }}
              />
            </div>

            {/* Door edge — visible depth when swinging */}
            <div
              className="absolute top-0 bottom-0 right-0"
              style={{
                width: '7px',
                background:
                  'linear-gradient(90deg,rgba(28,18,8,0.15),rgba(197,164,109,0.07),rgba(0,0,0,0.92))',
                boxShadow: '3px 0 10px rgba(0,0,0,0.85)',
              }}
            />
          </div>

          {/* ══════ RIGHT DOOR (mirror) ══════ */}
          <div
            className={`door-right absolute top-0 right-0 h-full overflow-hidden${isOpen ? ' opening' : ''}`}
            style={{
              width: '50%',
              boxShadow: isOpen
                ? '12px 0 50px rgba(0,0,0,0.98),3px 0 14px rgba(0,0,0,0.85)'
                : '-3px 0 14px rgba(0,0,0,0.65)',
              transition: 'box-shadow 0.6s ease',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800"
              alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'brightness(0.2) saturate(0.55) sepia(0.5)',
                transform: 'scaleX(-1)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(205deg,rgba(24,16,8,0.8) 0%,rgba(18,12,6,0.9) 55%,rgba(30,21,12,0.84) 100%)',
              }}
            />
            <div
              className="absolute inset-y-0"
              style={{
                right: '8%', width: '22%',
                background:
                  'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)',
              }}
            />

            {/* Upper panel */}
            <div
              className="absolute"
              style={{
                top: '5.5%', left: '13%', right: '7%', bottom: '53%',
                boxShadow: `
                  inset 2.5px 2.5px 0 rgba(197,164,109,0.4),
                  inset -2.5px -2.5px 0 rgba(0,0,0,0.55),
                  inset 0 0 0 1px rgba(197,164,109,0.2)
                `,
              }}
            >
              <div className="absolute" style={{ inset:'10px', background:'rgba(255,255,255,0.02)', boxShadow:'inset 1px 1px 5px rgba(0,0,0,0.55)' }} />
            </div>
            {/* Lower panel */}
            <div
              className="absolute"
              style={{
                top: '49%', left: '13%', right: '7%', bottom: '4.5%',
                boxShadow: `
                  inset 2.5px 2.5px 0 rgba(197,164,109,0.4),
                  inset -2.5px -2.5px 0 rgba(0,0,0,0.55),
                  inset 0 0 0 1px rgba(197,164,109,0.2)
                `,
              }}
            >
              <div className="absolute" style={{ inset:'10px', background:'rgba(255,255,255,0.02)', boxShadow:'inset 1px 1px 5px rgba(0,0,0,0.55)' }} />
            </div>
            {/* Mid-rail */}
            <div className="absolute inset-x-0" style={{ top:'46%', height:'4%', background:'linear-gradient(180deg,rgba(197,164,109,0.065),rgba(197,164,109,0.02))', borderTop:'1px solid rgba(197,164,109,0.18)', borderBottom:'1px solid rgba(197,164,109,0.18)' }} />

            {/* Right door handle */}
            <div className="door-handle absolute" style={{ left:'9px', top:'46.5%', transform:'translateY(-50%)' }}>
              <div
                style={{
                  width:'15px', height:'96px',
                  background:'linear-gradient(180deg,#9a6f12 0%,#c9a86c 18%,#ecca7a 38%,#c9a86c 58%,#9f7618 80%,#c9a86c 100%)',
                  borderRadius:'3px',
                  boxShadow:'0 0 0 1px rgba(90,60,8,0.55),0 3px 10px rgba(0,0,0,0.75),inset -1.5px 0 3px rgba(255,255,255,0.22)',
                  position:'relative',
                }}
              >
                <div style={{ position:'absolute', top:'49%', left:'50%', transform:'translate(-50%,-50%)', width:'5px', height:'9px', background:'#090705', borderRadius:'50% 50% 0 0', boxShadow:'0 5px 0 #090705' }} />
              </div>
              <div
                style={{
                  position:'absolute', left:'13px', top:'24px',
                  width:'26px', height:'11px',
                  background:'linear-gradient(270deg,#9f7618,#ecca7a 42%,#c9a86c 72%,#9a6f12)',
                  borderRadius:'0 4px 4px 0',
                  boxShadow:'0 3px 9px rgba(0,0,0,0.72),inset 0 1.5px 3px rgba(255,255,255,0.28)',
                  transform:'rotate(2deg)',
                }}
              />
            </div>

            {/* Door edge depth */}
            <div
              className="absolute top-0 bottom-0 left-0"
              style={{
                width:'7px',
                background:'linear-gradient(270deg,rgba(28,18,8,0.15),rgba(197,164,109,0.07),rgba(0,0,0,0.92))',
                boxShadow:'-3px 0 10px rgba(0,0,0,0.85)',
              }}
            />
          </div>

          {/* Seam line — fades when opening */}
          <div
            className="absolute top-0 bottom-0 left-1/2 pointer-events-none z-10"
            style={{
              width: '1px', transform: 'translateX(-0.5px)',
              background:
                'linear-gradient(180deg,rgba(0,0,0,0.9),rgba(197,164,109,0.25) 40%,rgba(0,0,0,0.9))',
              opacity: isOpen ? 0 : 1,
              transition: 'opacity 0.45s ease',
            }}
          />
        </div>
      </div>

      {/* ══ LAYER 3: Dark marble floor with door shadow & gold reflection ══ */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '20%' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg,rgba(6,4,2,0) 0%,rgba(6,4,2,0.72) 45%,rgba(3,2,1,0.97) 100%)',
          }}
        />
        {/* Subtle marble vein lines */}
        {[18, 36, 54, 72].map((p) => (
          <div
            key={p}
            className="absolute inset-x-0"
            style={{ top:`${p}%`, height:'1px', background:'rgba(197,164,109,0.025)' }}
          />
        ))}
        {/* Golden floor glow from door light */}
        <div
          className="absolute"
          style={{
            bottom:0, left:'50%', transform:'translateX(-50%)',
            width:'min(700px,80vw)', height:'100%',
            background:'linear-gradient(180deg,rgba(197,164,109,0.05) 0%,transparent 65%)',
            filter:'blur(4px)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 1.2s ease 0.6s',
          }}
        />
      </div>

      {/* ══ LAYER 4: Brand monogram (above the frame) ══ */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center pointer-events-none z-20"
        style={{ paddingTop:'clamp(18px,4.5vh,44px)' }}
      >
        <div
          style={{
            width:'36px', height:'1px',
            background:'linear-gradient(90deg,transparent,rgba(197,164,109,0.65),transparent)',
            marginBottom:'9px',
          }}
        />
        <div
          className="logo-glow"
          style={{
            fontFamily:'"Cormorant Garamond","Didot","Bodoni MT","Times New Roman",serif',
            fontSize:'clamp(9px,1.1vw,13px)',
            letterSpacing:'0.78em',
            color:'rgba(197,164,109,0.78)',
            fontWeight:400,
            textTransform:'uppercase',
          }}
        >
          MAISON
        </div>
        <div
          className="logo-glow"
          style={{
            fontFamily:'"Cormorant Garamond","Didot","Bodoni MT","Times New Roman",serif',
            fontSize:'clamp(42px,6.8vw,100px)',
            letterSpacing:'0.32em',
            color:'#f5f0e8',
            fontWeight:700,
            lineHeight:0.93,
            marginTop:'2px',
          }}
        >
          RK
        </div>
        {/* Diamond separator */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'10px 0' }}>
          <div style={{ width:'28px', height:'1px', background:'rgba(197,164,109,0.42)' }} />
          <div style={{ width:'5px', height:'5px', background:'rgba(197,164,109,0.72)', transform:'rotate(45deg)' }} />
          <div style={{ width:'28px', height:'1px', background:'rgba(197,164,109,0.42)' }} />
        </div>
        <div
          style={{
            fontSize:'clamp(7px,0.75vw,10px)',
            letterSpacing:'0.52em',
            color:'rgba(197,164,109,0.42)',
            fontFamily:'"Cormorant Garamond",serif',
            textTransform:'uppercase',
            fontWeight:400,
          }}
        >
          Est. Florence · mmxxiv
        </div>
      </div>

      {/* ══ LAYER 5: Click-to-enter prompt ══ */}
      {phase === 'waiting' && (
        <div
          className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse pointer-events-none"
          style={{ color:'rgba(197,164,109,0.42)' }}
        >
          <span
            style={{
              fontSize:'8px', letterSpacing:'0.52em',
              fontFamily:'"Cormorant Garamond",serif',
              textTransform:'uppercase', fontWeight:400,
            }}
          >
            Click to Enter
          </span>
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   COLLECTION PANEL
   ───────────────────────────────────────────────────────── */
function CollectionPanel({
  collection,
  index,
}: {
  collection: typeof COLLECTIONS[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isEven = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="collection-panel"
      style={{ background: collection.bgColor, minHeight: '100vh' }}
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={collection.image}
          alt={collection.tag}
          className="collection-img-zoom w-full h-full object-cover"
          style={{ transformOrigin: isEven ? 'right center' : 'left center' }}
        />
        <div className="collection-panel-overlay" style={{ background: collection.overlayGradient }} />
      </div>

      {/* Roman numeral watermark */}
      <div
        className="absolute top-8 right-8 z-10 pointer-events-none"
        style={{
          fontFamily:'"Cormorant Garamond",serif',
          fontSize:'clamp(52px,9vw,130px)',
          color: collection.accentColor,
          opacity:0.07, fontWeight:700, lineHeight:1,
        }}
      >
        {collection.label}
      </div>

      {/* Content */}
      <div
        className="collection-panel-content w-full max-w-7xl mx-auto px-8 sm:px-16 lg:px-24"
        style={{ color: collection.textColor }}
      >
        <div className={`flex flex-col ${isEven ? 'items-end text-right ml-auto' : 'items-start'} max-w-xl`}>
          {/* Tag */}
          <div
            className={`ornament-divider mb-6 ${isEven ? 'flex-row-reverse' : ''}`}
            style={{ color: collection.tagColor }}
          >
            <span
              style={{
                fontSize:'clamp(8px,0.9vw,11px)', letterSpacing:'0.48em',
                fontFamily:'Inter,sans-serif', fontWeight:700,
                opacity: visible ? 1 : 0, transition:'opacity 0.85s ease 0.2s',
              }}
            >
              {collection.tag}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily:'"Cormorant Garamond","Bodoni MT","Times New Roman",serif',
              fontSize:'clamp(38px,5.8vw,92px)',
              fontWeight:700, letterSpacing:'0.08em',
              lineHeight:1.04, whiteSpace:'pre-line',
              color: collection.textColor,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(34px)',
              transition:'opacity 1s ease 0.38s,transform 1s cubic-bezier(0.16,1,0.3,1) 0.38s',
            }}
          >
            {collection.title}
          </h2>

          {/* Gold accent rule */}
          <div
            style={{
              height:'2px', margin:'22px 0',
              width: visible ? '80px' : '0px',
              background:`linear-gradient(${isEven?270:90}deg,${collection.accentColor},transparent)`,
              transition:'width 0.95s cubic-bezier(0.16,1,0.3,1) 0.62s',
              ...(isEven ? { marginLeft:'auto' } : {}),
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontSize:'clamp(9px,1.05vw,13px)', letterSpacing:'0.26em',
              fontFamily:'Inter,sans-serif', color: collection.tagColor,
              textTransform:'uppercase', fontWeight:500,
              opacity: visible ? 0.9 : 0, transition:'opacity 0.95s ease 0.52s',
            }}
          >
            {collection.subtitle}
          </p>

          {/* Description */}
          <p
            style={{
              fontSize:'clamp(12px,1.15vw,15px)', lineHeight:1.88,
              fontFamily:'Inter,sans-serif', maxWidth:'420px', marginTop:'18px',
              color: collection.textColor,
              opacity: visible ? 0.75 : 0, transition:'opacity 1.05s ease 0.68s',
            }}
          >
            {collection.description}
          </p>

          {/* CTA */}
          <Link
            href={collection.link}
            className="inline-flex items-center gap-3 mt-8 group"
            style={{
              border:`1px solid ${collection.borderColor}`,
              padding:'14px 34px',
              fontSize:'10px', letterSpacing:'0.36em',
              fontFamily:'Inter,sans-serif', fontWeight:700,
              textTransform:'uppercase',
              color: collection.textColor,
              background:'transparent',
              opacity: visible ? 1 : 0,
              transition:'opacity 1.05s ease 0.82s,background 0.3s,border-color 0.3s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = collection.accentColor;
              el.style.borderColor = collection.accentColor;
              el.style.color = collection.bgColor;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.borderColor = collection.borderColor;
              el.style.color = collection.textColor;
            }}
          >
            {collection.cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Scroll hint on last panel */}
      {index === COLLECTIONS.length - 1 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse"
          style={{ color:`${collection.accentColor}80` }}
        >
          <span style={{ fontSize:'8px', letterSpacing:'0.4em', fontFamily:'Inter,sans-serif', textTransform:'uppercase' }}>
            More Below
          </span>
          <ChevronDown className="h-4 w-4" />
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN LANDING PAGE
   ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [doorDone, setDoorDone] = useState(false);

  const HERO_SLIDES = [
    {
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1920',
      title: 'ARCHITECTURAL PRECISION',
      subtitle: 'THE SPRING/SUMMER COLLECTION',
      cta: 'EXPLORE APPAREL',
      link: '/products?category=Apparel',
    },
    {
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1920',
      title: 'THE SILK TRENCH COAT',
      subtitle: 'FLORENTINE TAILORING, MODERN SILHOUETTES',
      cta: 'SHOP OUTERWEAR',
      link: '/products?category=Outerwear',
    },
    {
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1920',
      title: 'REFINED ACCESSORIES',
      subtitle: 'STRUCTURED CALFSKIN LEATHER GOODS',
      cta: 'DISCOVER BAGS',
      link: '/products?category=Accessories',
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [HERO_SLIDES.length]);

  useEffect(() => {
    fetch('/api/products?sortBy=rating')
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setFeaturedProducts(d.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Store door overlay */}
      {!doorDone && <StoreDoor onComplete={() => setDoorDone(true)} />}

      <Navbar />

      <main className="flex-1">

        {/* ── 3 COLLECTION COMPARTMENTS ── */}
        {COLLECTIONS.map((col, idx) => (
          <CollectionPanel key={col.id} collection={col} index={idx} />
        ))}

        {/* ── EDITORIAL HERO SLIDER ── */}
        <section
          id="editorial"
          className="relative w-full overflow-hidden bg-black"
          style={{ height: '100vh', minHeight: '600px' }}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-70 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover scale-[1.01]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 font-sans text-white">
            <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.45em] uppercase text-gray-300 animate-fade-in mb-4">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-[0.16em] uppercase leading-tight max-w-5xl animate-slide-up font-sans">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <div className="mt-10 animate-fade-in">
              <Link
                href={HERO_SLIDES[currentSlide].link}
                className="bg-white text-black text-[10px] uppercase tracking-widest px-8 py-4 font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
              >
                {HERO_SLIDES[currentSlide].cta} <ArrowRight className="h-4 w-4 text-black" />
              </Link>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1.5 text-white/50 animate-pulse">
            <span className="text-[8px] uppercase tracking-[0.3em] font-semibold font-sans">Scroll to explore</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
          <div className="absolute bottom-8 right-10 z-20 flex space-x-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1 transition-all duration-300 cursor-pointer ${
                  i === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-1'
                }`}
              />
            ))}
          </div>
        </section>

        {/* ── BRAND MANIFESTO ── */}
        <section id="manifesto" className="max-w-6xl mx-auto px-6 sm:px-10 py-24 lg:py-32 font-sans scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted-foreground">01 / OUR PHILOSOPHY</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-foreground leading-snug uppercase">
                Designed for fluidity, engineered for comfort, crafted for permanence.
              </h2>
              <div className="h-px w-12 bg-foreground/20" />
            </div>
            <div className="flex flex-col gap-5 text-xs text-muted-foreground leading-relaxed">
              <p>
                At Maison RK, we disconnect from hyper-trend fast cycles. We specialize in producing small,
                slow-crafted batches of functional modern wardrobe staples that balance organic silk-weaves,
                heavy virgin wool, and vegetable calfskin treatments.
              </p>
              <p>
                Every stitch is inspected at our Florence atelier, blending Japanese minimalist design philosophy
                with Italian garment execution to bring luxury comfort directly to your modern landscape.
              </p>
              <div className="mt-4">
                <Link href="/products" className="text-foreground hover:text-muted-foreground text-[10px] uppercase tracking-widest font-bold inline-flex items-center gap-2 underline underline-offset-4">
                  VIEW OUR ARCHIVE <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORY GRID ── */}
        <section className="bg-secondary border-y border-border py-24 font-sans">
          <div className="max-w-6xl mx-auto px-6 sm:px-10">
            <div className="text-center mb-20">
              <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-muted-foreground">02 / CURATED COLLECTIONS</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest mt-2 text-foreground uppercase">EDITORIAL INDEX</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1 flex flex-col gap-8">
                <Link href="/products?category=Outerwear" className="group relative aspect-[3/4] bg-background border border-border/30 overflow-hidden block">
                  <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600" alt="Outerwear" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">OUTERWEAR</h3>
                    <span className="text-[8px] text-gray-300 font-semibold tracking-wider uppercase mt-1 block">Atelier trench &amp; blazers</span>
                  </div>
                </Link>
              </div>
              <div className="md:col-span-1 md:mt-16 flex flex-col gap-8">
                <Link href="/products?category=Apparel" className="group relative aspect-[3/4] bg-background border border-border/30 overflow-hidden block">
                  <img src="https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=600" alt="Apparel" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">APPAREL</h3>
                    <span className="text-[8px] text-gray-300 font-semibold tracking-wider uppercase mt-1 block">Relaxed Knitwear &amp; Sets</span>
                  </div>
                </Link>
              </div>
              <div className="md:col-span-1 flex flex-col gap-10">
                <Link href="/products?category=Accessories" className="group relative aspect-[4/5] bg-background border border-border/30 overflow-hidden block">
                  <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600" alt="Accessories" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 text-white"><h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">ACCESSORIES</h3></div>
                </Link>
                <Link href="/products?category=Footwear" className="group relative aspect-[4/5] bg-background border border-border/30 overflow-hidden block">
                  <img src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600" alt="Footwear" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 text-white"><h3 className="text-[10px] font-bold tracking-[0.25em] uppercase">FOOTWEAR</h3></div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-24 lg:py-32 font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-20 border-b border-border pb-6">
            <div>
              <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-muted-foreground">03 / CURATED ARCHIVE</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest mt-2 text-foreground uppercase">EDITORIAL CAMPAIGNS</h2>
            </div>
            <Link href="/products" className="text-[10px] uppercase tracking-widest font-semibold hover:text-muted-foreground underline underline-offset-4 mt-3 sm:mt-0 transition-colors">
              VIEW THE COMPLETE ARCHIVE
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} variant="editorial" />
        </section>

        {/* ── NOIR CAMPAIGN BANNER ── */}
        <section className="relative h-[65vh] w-full overflow-hidden bg-black font-sans">
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1920"
            alt="Noir Campaign"
            className="absolute inset-0 h-full w-full object-cover opacity-45 scale-[1.01]"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white z-10">
            <span className="text-[9px] font-bold tracking-[0.45em] uppercase text-gray-300">04 / THE NOIR EDITION</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.16em] uppercase mt-3 mb-8">POLISHED ACETATE FRAMES</h2>
            <Link href="/products?category=Accessories" className="bg-white text-black text-[10px] uppercase tracking-widest px-8 py-4 font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]">
              DISCOVER BATCHES
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
