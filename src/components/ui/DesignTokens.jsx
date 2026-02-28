/**
 * BrandForge Design System Tokens
 * Single source of truth for all styling decisions.
 * Import this in any page or component that needs consistent styles.
 */

export const tokens = {
  // ── Colors ──────────────────────────────────────────────
  colors: {
    brand: {
      primary:   'from-amber-500 to-orange-500',
      primaryHover: 'from-amber-600 to-orange-600',
      accent:    'from-violet-600 to-indigo-600',
      accentHover: 'from-violet-700 to-indigo-700',
    },
    surface: {
      page:      'bg-slate-900',
      card:      'bg-slate-800/60 border-slate-700/50',
      cardLight: 'bg-white',
      muted:     'bg-slate-800/40',
    },
    text: {
      primary:   'text-white',
      secondary: 'text-slate-300',
      muted:     'text-slate-400',
      heading:   'text-white',
      // On light cards
      bodyLight: 'text-slate-600',
      headingLight: 'text-slate-800',
    },
    status: {
      success: 'from-emerald-500 to-teal-600',
      warning: 'from-amber-500 to-orange-600',
      danger:  'from-rose-500 to-pink-600',
      info:    'from-violet-500 to-indigo-600',
    },
  },

  // ── Typography ───────────────────────────────────────────
  typography: {
    h1: 'text-3xl md:text-4xl font-bold tracking-tight text-white',
    h2: 'text-2xl font-bold tracking-tight text-white',
    h3: 'text-xl font-semibold tracking-tight text-white',
    h4: 'text-base font-semibold text-slate-200',
    body: 'text-sm text-slate-400 leading-relaxed',
    bodyLight: 'text-sm text-slate-600 leading-relaxed',
    label: 'text-sm font-medium text-slate-300',
    // Content sections (inside cards on light bg)
    contentH1: 'text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b-2 border-violet-200',
    contentH2: 'text-lg font-bold text-violet-700 mt-6 mb-3',
    contentH3: 'text-base font-semibold text-slate-700 mt-5 mb-2',
    contentBody: 'text-sm text-slate-600 leading-relaxed mb-3',
  },

  // ── Spacing ──────────────────────────────────────────────
  spacing: {
    section: 'py-16 md:py-24',
    sectionSm: 'py-10 md:py-16',
    container: 'max-w-7xl mx-auto px-4',
    containerNarrow: 'max-w-4xl mx-auto px-4',
    cardPad: 'p-6 md:p-8',
    cardPadSm: 'p-4 md:p-6',
  },

  // ── Borders & Radius ─────────────────────────────────────
  radius: {
    card: 'rounded-xl',
    button: 'rounded-lg',
    badge: 'rounded-full',
    icon: 'rounded-xl',
  },

  // ── Shadows ──────────────────────────────────────────────
  shadows: {
    card: 'shadow-xl shadow-black/20',
    button: 'shadow-lg shadow-amber-500/20',
    accentButton: 'shadow-lg shadow-violet-500/20',
  },

  // ── Buttons ──────────────────────────────────────────────
  button: {
    primary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20',
    accent: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/20',
    ghost: 'border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white',
    outline: 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white bg-transparent',
  },

  // ── Markdown / Rich Text ─────────────────────────────────
  markdown: {
    wrapper: 'bg-slate-50 rounded-xl p-6 border border-slate-100',
  },
};

/**
 * Stat card gradient presets for quick use
 */
export const statGradients = [
  'from-violet-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

export default tokens;