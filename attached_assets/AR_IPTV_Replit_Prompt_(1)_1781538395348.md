# 🎯 AR IPTV — Replit AI Full Project Prompt

> এই prompt টা Replit AI তে দিলে তোমার সম্পূর্ণ project ready হয়ে যাবে।

---

## ✅ TOOLS যা লাগবে তোমার Project এ

| Tool / Package | কেন লাগবে |
|---|---|
| **Next.js 14 (App Router)** | Full-stack React framework, SSR, routing |
| **TypeScript** | Type-safe code, কম bug |
| **Tailwind CSS** | Rapid UI styling |
| **HLS.js** | M3U8 HLS stream video play করতে |
| **Video.js** | Modern video player UI |
| **next/font (Google Fonts)** | Share Tech Mono font load করতে |
| **Capacitor.js** | APK বানাতে (Android TV / Mobile) |
| **@capacitor/android** | Android APK export |
| **lucide-react** | Icons |
| **clsx / tailwind-merge** | Conditional class utility |

---

## 📋 REPLIT AI তে দেওয়ার জন্য PROMPT

নিচের পুরো text টা copy করে Replit AI তে paste করো:

---

```
Build me a complete, premium modern IPTV web application using Next.js 14 (App Router), TypeScript, and Tailwind CSS. This is called "AR IPTV" and must look and feel like a premium smart TV streaming platform.

=== DESIGN SYSTEM ===
- Font: "Share Tech Mono" from Google Fonts — use for ALL text sitewide
- Theme: Pure black background (#000000) with cyan/teal accent colors
- Primary accent: #00E5FF (cyan — matching the logo)
- Secondary accent: #00B8D9
- Glow effects: box-shadow and text-shadow using cyan rgba values
- NO white backgrounds anywhere — only #000, #0a0a0a, #111, #1a1a1a for cards
- Border colors: rgba(0, 229, 255, 0.2) to rgba(0, 229, 255, 0.6)
- Hover states: cyan glow pulse animation
- All text: white or cyan — never dark on light

=== LOGO & BRANDING ===
- Logo image: Place the AR logo PNG at /public/logo.png (I will upload it)
- In the header/navbar: show the logo image on the left
- Below logo text: "Arif" — this text must be a clickable link to https://github.com/Arifur999
- The "Arif" link should glow cyan and open in a new tab

=== M3U CHANNEL DATA ===
Parse this M3U data as a static JS/TS array of channels. Each channel has:
- name: string (channel name from #EXTINF line)
- url: string (the stream URL)
- country: string (detect from flag emoji 🇦🇷🇷🇺🇧🇷 etc. in channel name, or detect from name keywords like ARG=Argentina, BR=Brazil, TR=Turkey, etc.)
- group: string (Sport, News, Entertainment — infer from channel name)

Use this M3U channel list (parse ALL of them):
[PASTE YOUR FULL M3U CONTENT HERE — include all #EXTINF lines and URLs]

Detected countries from the M3U file include: Argentina 🇦🇷, Brazil 🇧🇷, Russia 🇷🇺, Turkey 🇹🇷, Portugal 🇵🇹, Spain 🇪🇸, France 🇫🇷, UK 🇬🇧, USA 🇺🇸, Colombia 🇨🇴, Chile 🇨🇱, Italy 🇮🇹, Mexico 🇲🇽, Israel 🇮🇱, Bulgaria 🇧🇬, Romania 🇷🇴, Macau 🇲🇴, Turkmenistan 🇹🇲, Hong Kong 🇭🇰, India 🇮🇳, Saudi Arabia 🇸🇦, Qatar 🇶🇦.

=== PAGE STRUCTURE ===

**1. HOMEPAGE ( / )**
- Full-width hero section with the AR logo centered, glowing cyan animation
- Below hero: "Select a Country" heading
- Country grid: Show ALL detected countries as cards in a responsive grid (3 cols mobile, 4-5 cols desktop)
- Each country card shows:
  - Large flag emoji (3rem)
  - Country name in Share Tech Mono
  - Number of channels badge (e.g. "12 Channels")
  - Cyan border glow on hover with scale(1.05) transform
  - Click → navigate to /country/[slug] page

**2. COUNTRY PAGE ( /country/[slug] )**
- Header shows: flag emoji + country name + back button
- Channel list: vertical list of all channels for that country
- Each channel item shows:
  - Channel name
  - Stream quality badge if detectable (720p, 1080p, HD)
  - Play button (▶) with cyan color
  - Click → open video player modal OR navigate to /watch/[id]

**3. WATCH PAGE / VIDEO PLAYER MODAL**
- Full-screen-capable HLS video player
- Use HLS.js to load .m3u8 streams
- Custom controls: Play/Pause, Volume, Fullscreen, Progress bar
- Channel name shown at top
- Loading spinner with cyan glow while buffering
- Error state: "Stream unavailable — try another channel"
- Back button to return to country channels list
- Sidebar or bottom list: other channels from same country for quick switching

=== COMPONENTS TO BUILD ===

/components/
├── Navbar.tsx          — Logo + "Arif" GitHub link + nav
├── CountryCard.tsx     — Flag + name + channel count card
├── ChannelList.tsx     — List of channels with play button
├── VideoPlayer.tsx     — HLS.js player with custom UI
├── LoadingSpinner.tsx  — Cyan animated spinner
├── GlowButton.tsx      — Reusable cyan glow button

/app/
├── page.tsx            — Homepage with country grid
├── country/[slug]/page.tsx   — Country channel list
├── watch/[id]/page.tsx       — Full watch page
├── layout.tsx          — Root layout with font + metadata

/lib/
├── channels.ts         — All channel data as typed TS array
├── parseM3U.ts         — M3U parser utility function
├── countries.ts        — Country slug mapping and metadata

=== NAVBAR ===
- Sticky top navbar
- Left: AR logo image (40px height) + site name "AR IPTV" in cyan
- Right: "Arif" text as a glowing cyan link → https://github.com/Arifur999 (target="_blank")
- Below "Arif" text add tiny text: "Developer" in dimmer color
- Navbar background: rgba(0,0,0,0.95) with backdrop-blur
- Bottom border: 1px solid rgba(0,229,255,0.3)

=== VIDEO PLAYER REQUIREMENTS ===
- Use HLS.js for all .m3u8 streams
- For non-HLS streams (plain HTTP streams), use standard HTML5 video
- Custom styled controls (NOT default browser controls)
- Controls: ⏮ Prev Channel | ⏪ | ▶/⏸ | ⏩ | ⏭ Next Channel | 🔊 Volume | ⛶ Fullscreen
- Auto-hide controls after 3 seconds of inactivity
- Show channel name and current time as overlay
- Cyan progress bar
- Loading skeleton while stream connects
- Retry button on error

=== APK / ANDROID TV SUPPORT ===
- Set up Capacitor.js in the project for Android APK export
- capacitor.config.ts: appId="com.ariptv.app", appName="AR IPTV"
- Add capacitor.config.ts and note how to run: npx cap add android && npx cap sync && npx cap open android
- Make the UI TV-friendly: large click targets (min 60px), keyboard/remote navigation support
- Add manifest.json for PWA support as well

=== ANIMATIONS & EFFECTS ===
- Page load: fade-in from bottom (opacity 0→1, translateY 20px→0)
- Country cards: stagger animation on load
- Hover on cards: cyan glow box-shadow pulse
- Active channel in player sidebar: glowing left border cyan
- Logo in hero: breathing glow animation (infinite pulse)

=== METADATA & SEO ===
- Title: "AR IPTV — Live Sports Streaming"
- Description: "Watch live sports channels from around the world"
- Favicon: use the AR logo
- Open Graph tags

=== TAILWIND CONFIG ===
Extend tailwind.config.ts with:
- Custom colors: cyan: { DEFAULT: '#00E5FF', dark: '#00B8D9' }
- Custom font family: mono: ['Share Tech Mono', 'monospace']
- Custom animation: 'glow-pulse': glow keyframe with cyan box-shadow

=== IMPORTANT RULES ===
1. ALL text must use Share Tech Mono font
2. NO light backgrounds anywhere
3. ALL interactive elements must have cyan hover glow
4. Video player must work on both desktop and mobile
5. The site must be fully responsive (mobile → tablet → desktop → TV)
6. Keep all channel URLs exactly as provided — do not modify them
7. Use Next.js Image component for the logo
8. Use "use client" directive on all interactive components
9. Do not use any UI library (no shadcn, no MUI) — custom Tailwind only
10. Add loading.tsx and error.tsx for each route segment

Start by creating the project structure, then channels.ts with all channel data, then build components bottom-up, then pages.
```

---

## 📁 M3U File এ যে Channels আছে (Summary)

তোমার M3U তে **মোট ~130+ channels** আছে এবং নিচের দেশগুলো detected:

| দেশ | Flag | চ্যানেল উদাহরণ |
|---|---|---|
| Argentina | 🇦🇷 | ESPN ARG, TyC Sports, TNT Sports ARG |
| Brazil | 🇧🇷 | RS Sports 1-5, RS Premier |
| Russia | 🇷🇺 | Матч!, X Sport, OTT Club |
| Turkey | 🇹🇷 | BEIN Sports 2-5, IDMANTV |
| Portugal | 🇵🇹 | Dazn 1-5 PT |
| Spain | 🇪🇸 | Real Madrid TV, BEIN SPORT EXTRA, LIG |
| France | 🇫🇷 | BEIN SPORTS 3 FR, L'Equipe, INFOSPORT |
| UK | 🇬🇧 | TNT Sports Premium, MTR Sports |
| USA | 🇺🇸 | ESPN Deportes, TUDN USA, NBC Universo, BEK Sports |
| Colombia | 🇨🇴 | ESPN CO, Win Sports |
| Chile | 🇨🇱 | ESPN Premium CHI, TELETRAK |
| Italy | 🇮🇹 | Sport Italia, TR Sport |
| Mexico | 🇲🇽 | Sky Sport LaLiga MX, TUDN MX, Azteca |
| Bulgaria | 🇧🇬 | MAX SPORT 4 |
| Romania | 🇷🇴 | Digi Sport 2 |
| Israel | 🇮🇱 | Sport5 |
| India | 🇮🇳 | Fox Sports IN |
| Saudi Arabia | 🇸🇦 | MMN Sport |
| Qatar | 🇶🇦 | MASR |
| Macau | 🇲🇴 | TDM Desporto |
| Turkmenistan | 🇹🇲 | Turkmenistan Sport |
| Hong Kong | 🇭🇰 | ON Sports+ |
| International | 🌍 | Eurosport 1&2, DAZN F1, BEIN SPORTS, Red Bull TV |

---

## 🛠️ Project এ কি কি Tools/Packages লাগবে — বিস্তারিত

### Core Framework
```bash
npx create-next-app@latest ar-iptv --typescript --tailwind --app --src-dir
```

### Extra Packages Install করতে হবে
```bash
npm install hls.js
npm install lucide-react
npm install clsx tailwind-merge
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
```

### Dev Dependencies
```bash
npm install -D @types/hls.js
```

---

## 📱 APK বানানোর Steps (Capacitor)

Project ready হলে এই steps follow করো:

```bash
# 1. Next.js static export enable করো (next.config.js তে)
# output: 'export' add করো

# 2. Build করো
npm run build

# 3. Capacitor setup
npx cap add android

# 4. Sync করো
npx cap sync

# 5. Android Studio তে open করো
npx cap open android

# 6. Android Studio থেকে APK/AAB build করো
# Build → Generate Signed Bundle/APK
```

### next.config.js (APK এর জন্য)
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
module.exports = nextConfig
```

---

## 🎨 Logo ব্যবহারের নির্দেশনা

তোমার দেওয়া logo file (`ChatGPT_Image_Dec_18__2025__12_01_17_PM-removebg-preview__1_.png`) টা:

1. Rename করো → `logo.png`
2. Next.js project এ রাখো: `/public/logo.png`
3. Code এ use হবে এভাবে:
```tsx
import Image from 'next/image'
<Image src="/logo.png" alt="AR IPTV Logo" width={60} height={60} />
```

---

## ✨ "Arif" GitHub Link Implementation

```tsx
// Navbar.tsx এ এইভাবে add করবে:
<a 
  href="https://github.com/Arifur999" 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-cyan-400 font-mono hover:text-cyan-300 hover:drop-shadow-[0_0_8px_#00E5FF] transition-all duration-300"
>
  Arif
</a>
```

---

## 🖥️ TV Remote Navigation (Android TV Support)

Capacitor এর সাথে এই CSS add করো:
```css
/* TV D-pad navigation support */
*:focus {
  outline: 2px solid #00E5FF;
  outline-offset: 2px;
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
}
```

এবং সব interactive element এ `tabIndex={0}` দিতে হবে।

---

## 📝 Replit AI তে কীভাবে দেবে

1. **Replit.com** তে যাও
2. নতুন **Replit** create করো → Template: **Node.js** বা **Next.js**
3. বাম দিকে **AI** বাটনে click করো (Replit AI / Ghostwriter)
4. উপরের পুরো prompt copy করো
5. M3U content এর জায়গায় তোমার আসল M3U file এর content paste করো
6. Send করো — Replit AI পুরো project বানিয়ে দেবে
7. Logo file টা `/public/` folder এ upload করো
8. `npm install` → `npm run dev` চালাও

---

> **বানিয়েছে:** Claude (Anthropic) | তোমার project: AR IPTV by Arif
