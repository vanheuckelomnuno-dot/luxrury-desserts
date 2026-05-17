# Maison Dorée — Luxury Desserts Website

An ultra-premium futuristic 3D website for a luxury dessert and pastry company. Built with an Awwwards-quality aesthetic, cinematic animations, and immersive Three.js experiences.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D Engine | Three.js + React Three Fiber + Drei |
| Animations | GSAP + ScrollTrigger |
| Motion | Framer Motion |
| Scrolling | Lenis (ultra-smooth) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, CSS variables, custom utilities
│   ├── layout.tsx           # Root layout with fonts (Playfair Display, DM Sans)
│   └── page.tsx             # Homepage composition
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Sticky nav with scroll-hide behavior
│   │   └── Footer.tsx       # Premium footer with newsletter
│   │
│   ├── providers/
│   │   └── LenisProvider.tsx  # Lenis smooth scroll + GSAP ScrollTrigger sync
│   │
│   ├── three/
│   │   ├── HeroScene.tsx    # 3D hero: cake + macarons + particles + camera rig
│   │   └── ImmersiveScene.tsx # Full 3D scene: donuts + cakes + orbs + particles
│   │
│   └── ui/
│       ├── GlassCard.tsx    # Glassmorphism card with Framer Motion
│       └── LuxuryButton.tsx # Premium animated button (3 variants)
│
└── sections/
    ├── Hero.tsx             # Full-screen hero with 3D + GSAP entrance
    ├── FeaturedDesserts.tsx # 6-item dessert grid with 3D card hover
    ├── ImmersiveExperience.tsx # Full viewport 3D scene section
    ├── AboutChef.tsx        # Split-screen chef profile + parallax
    ├── Gallery.tsx          # Masonry gallery with mouse-follow glow
    ├── Testimonials.tsx     # 6-card review grid with glass cards
    └── Contact.tsx          # Premium order form with floating labels

public/
├── images/   ← Place dessert photos here (JPG/WebP recommended)
└── models/   ← Place .glb 3D models here
```

---

## Adding Real Images

All image slots currently use CSS gradient placeholders. Replace them with real photos:

### Dessert Cards (`src/sections/FeaturedDesserts.tsx`)
```tsx
// Current placeholder:
<div className="w-full bg-gradient-to-br from-blush ...">

// Replace with:
import Image from 'next/image'
<div className="relative w-full h-[220px]">
  <Image src="/images/macaron-tower.jpg" fill alt="Rose Macaron Tower" className="object-cover" />
</div>
```

### Gallery (`src/sections/Gallery.tsx`)
Same pattern — replace gradient divs with `<Image>` components.

### Chef Photo (`src/sections/AboutChef.tsx`)
```tsx
// Replace the gradient div with:
<Image src="/images/chef-isabelle.jpg" fill alt="Chef Isabelle Fontaine" className="object-cover" />
```

---

## Adding Real 3D Models

Models are currently procedural (Three.js geometries). To use .glb files:

### Hero Cake (`src/components/three/HeroScene.tsx`)
```tsx
// Add at top of file:
import { useGLTF } from '@react-three/drei'

// Replace the LuxuryCake component with:
function LuxuryCake() {
  const { nodes, materials } = useGLTF('/models/cake.glb')
  return <primitive object={nodes.Cake} />
}
useGLTF.preload('/models/cake.glb')
```

### Macarons & Donuts
Same pattern — place .glb in `public/models/` and use `useGLTF`.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FFFDF8` | Main background |
| `beige` | `#F6EEE3` | Section backgrounds |
| `gold` | `#D4AF37` | Accents, CTAs |
| `blush` | `#FFD6E0` | Soft highlights |
| `chocolate` | `#5A3825` | Text, dark elements |

Use via Tailwind: `bg-cream`, `text-gold`, `border-blush`, etc.

---

## Sections Overview

| # | Section | Key Features |
|---|---------|-------------|
| 1 | Hero | 3D cake + macarons, mouse parallax, GSAP entrance |
| 2 | Featured Desserts | 6 cards, 3D hover tilt, reveal on scroll |
| 3 | Immersive 3D | Full viewport R3F scene, 1200+ particles |
| 4 | About Chef | Split screen, Framer Motion parallax |
| 5 | Signature Gallery | Masonry grid, mouse-follow glow, hover reveal |
| 6 | Testimonials | 6 glass cards, star ratings |
| 7 | Contact / Order | Floating labels form, occasion chips |
| 8 | Footer | Newsletter, social, luxury gold separators |

---

## Performance Tips

- 3D canvases use `dpr={[1, 2]}` — caps pixel ratio at 2× for performance
- `dynamic(() => import(...), { ssr: false })` isolates Three.js from SSR
- Lenis + GSAP ScrollTrigger are synced via `gsap.ticker` for silky scrolling
- `Suspense` wraps all 3D content with graceful fallbacks

---

## Customization

### Change Brand Name
Search and replace `Maison Dorée` across all files.

### Add New Dessert to Featured Section
In `FeaturedDesserts.tsx`, add an item to the `desserts` array:
```tsx
{
  name: 'Your Dessert Name',
  category: 'Category',
  price: '€XX',
  description: 'Description...',
  gradient: 'from-... to-...',
  accent: '#HEXCOLOR',
  badge: 'New',
  emoji: '🍰',
  size: 'medium', // 'small' | 'medium' | 'large'
}
```

### Add New Gallery Item
In `Gallery.tsx`, add to the `galleryItems` array following the same pattern.
