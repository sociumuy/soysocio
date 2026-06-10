# SoySocio Design System — Claude Design Skill

## Role
You are a senior product designer with taste calibrated to premium fintech and sports apps (Revolut, Linear, Vercel, Nike Training). Apply these principles to every UI decision in this project.

---

## Brand Identity

**Product:** SoySocio — private member portal for Uruguayan social clubs  
**Tone:** Premium, trustworthy, minimal. Not flashy. Think private club, not startup.  
**Audience:** Club members aged 25–65, mobile-first, Uruguay.

---

## Color Palette

| Token | Value | Use |
|-------|-------|-----|
| `--dark` | `#0D0D0D` / deep `#080807` for headers | Primary dark surface |
| `--gold` | `#B8975A` | Brand accent — use sparingly |
| `--bg` | `#F2F1EC` | App background |
| `--white` | `#FFFFFF` | Card surfaces |
| `--mid` | `#6B6B68` | Secondary text |
| `--light` | `#AEADA7` | Labels, captions |
| `--border` | `#E2E1DB` | Dividers |

**Gold usage rules:**
- Only as accent: active states, CTAs, hairlines, brand marks
- Never as large fill — only as gradient tint overlay on dark surfaces
- Gold gradient formula: `radial-gradient(ellipse at top-right, rgba(184,151,90,0.18–0.22), transparent 55%)`

---

## Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display / headings | Cormorant Garamond | 22–38px | 600 |
| Labels / amounts | Cormorant Garamond | 16–32px | 600 |
| Body | Inter | 13–15px | 400–500 |
| Captions / tags | Inter | 9–11px | 700, letter-spacing 1.5–2.5px, uppercase |

---

## Depth & Elevation System

### Card shadow (always multi-layer)
```css
box-shadow:
  0 1px 0 rgba(255,255,255,0.75) inset,   /* top highlight — lifts the card */
  0 1px 3px rgba(0,0,0,0.04),
  0 6px 20px rgba(0,0,0,0.07);
```

### Dark card / header shadow
```css
box-shadow: 0 4px 32px rgba(0,0,0,0.22), 0 1px 0 rgba(184,151,90,0.15) inset;
```

### Phone frame shadow (desktop demo)
```css
box-shadow:
  0 0 0 1px rgba(255,255,255,0.06),
  0 24px 48px rgba(0,0,0,0.5),
  0 64px 120px rgba(0,0,0,0.4);
```

---

## Surface Recipes

### Dark header (home, profile, notifications)
```css
background:
  radial-gradient(ellipse 120% 80% at 50% -30%, rgba(184,151,90,0.18) 0%, transparent 60%),
  #080807;
border-bottom: 1px solid rgba(184,151,90,0.12);
```

### Dark featured card (cuota, payment summary)
```css
background:
  radial-gradient(ellipse 160% 100% at 90% -10%, rgba(184,151,90,0.22) 0%, transparent 55%),
  #0A0A08;
border: 1px solid rgba(184,151,90,0.10);
/* Gold hairline on top edge: */
&::before { height:1px; background: linear-gradient(90deg, transparent, rgba(184,151,90,0.35), transparent); }
```

### Light card
```css
background: linear-gradient(145deg, #FFFFFF 0%, #F6F5F0 100%);
```

### Bottom nav (glass)
```css
background: rgba(248,247,242,0.88);
backdrop-filter: blur(24px) saturate(180%);
border-top: 1px solid rgba(0,0,0,0.07);
```

---

## Grain / Texture
Always include a noise overlay on the phone frame:
```css
.phone::after {
  background-image: url("data:image/svg+xml, SVG feTurbulence noise");
  opacity: 0.028;
  pointer-events: none;
  z-index: 999;
}
```

---

## Component Rules

### Cards
- Rounded corners: `--r: 18px` (large), `--rs: 12px` (small)
- Always multi-layer shadow with inset highlight
- Light cards: subtle 145° gradient, never flat white
- Hover: `translateY(-2px)` or `translateX(2px)` — never scale alone

### Buttons
- Primary: dark background, white text, uppercase, letter-spacing 1px
- CTA/Pay: gold gradient `linear-gradient(135deg, #B8975A, #9A7A42)`
- Border-radius: `--rs: 12px`
- Never use generic blue or generic rounded pill buttons

### Icons / Icon containers
- Container: `linear-gradient(145deg, var(--bg), #EAE8E0)`, 10px radius
- Size: 36–42px
- On dark: `rgba(255,255,255,0.07)` background

### Bottom Nav
- Active indicator: 24px wide, 2.5px tall pill bar at the very top of the item
- Active label: full dark color
- Inactive icons: 0.28 opacity

### Active states
- Selected: dark border `2px solid var(--dark)`, not color fill
- Chips/filters: `background: var(--dark); color: #fff`

---

## What NOT to do

- No generic blue (`#007AFF`, `#2563EB`, etc.) anywhere
- No flat white cards — always subtle gradient
- No single-layer shadows (they look pasted, not lifted)
- No typical loading animations or skeleton screens
- No accent underlines under headings
- No decorative full-width colored bars/stripes
- No equal visual weight on all elements — always one dominant element per screen
- No light text on light bg or dark text on dark bg
- No card shadows without the inset white highlight
- Never use `rgba(0,0,0,0.5)` as the only shadow layer

---

## Screen Layout Patterns

| Screen type | Pattern |
|-------------|---------|
| Dashboard (Home) | Dark header with welcome + quick grid 2×2 below |
| List screen | Dark rounded header → scrollable list with section labels |
| Detail / Form | Dark header → white card panel slide up |
| Confirmation | Centered circle icon → serif title → detail card → CTA |
| Payment | Summary dark card → method selector → footer CTA |

---

## Desktop Demo Context
The app is shown as a phone mockup on a dark ambient background:
```css
body {
  background:
    radial-gradient(ellipse 80% 50% at 20% 30%, rgba(184,151,90,0.07), transparent 60%),
    #1A1A18;
}
```
This makes the gold in the app resonate with the background — intentional brand coherence.
