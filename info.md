# Lucia Urcelay Ganzabal - Personal Website

## Tech Stack

- **React** (TypeScript)
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Section.tsx
│   ├── SectionTitle.tsx
│   ├── ExternalLink.tsx
│   └── PublicationCard.tsx
├── data/               # Static content data
│   ├── publications.ts
│   └── news.ts
├── pages/              # Page components
│   ├── Landing/
│   ├── About/
│   └── Publications/
├── App.tsx             # Main app with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Adding Content

### Publications

Edit `src/data/publications.ts` to add or modify publications.

### News/Updates

Edit `src/data/news.ts` to add or modify news items.

### Images

Replace placeholder components with actual images by:
1. Add images to `public/` or `src/assets/`
2. Update the corresponding components

## Customization

### Colors

Edit CSS variables in `tailwind.config.js` under `theme.extend.colors`.

### Typography

The site uses Helvetica Neue as the primary font family, with system fallbacks configured in `tailwind.config.js`.

## License

© 2025 Lucia Urcelay Ganzabal. All rights reserved.
