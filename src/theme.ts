/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeColors {
  id: 'light' | 'dark' | 'teal' | 'sunset' | 'ocean' | 'purple';
  name: string;
  description: string;
  bgPage: string;          // Main background of page
  sidebarBg: string;       // Sidebar background
  sidebarBorder: string;   // Sidebar border
  cardBg: string;          // Individual cards background
  cardBorder: string;      // Card boundary borders
  textMain: string;        // Main text title color
  textBody: string;        // Description text color
  textMuted: string;       // Soft subtitle and layout text
  primaryText: string;     // Text in accents
  primaryBg: string;       // Accent buttons background
  primaryHover: string;    // Hover states for accents
  primaryRing: string;     // Input focus borders ring
  accentBgLight: string;   // Soft badge backgrounds
  accentTextList: string;  // Soft badge text
  inputBg: string;         // Dropdowns, text fields
  borderFocus: string;     // focus:border-xxx
}

export const THEMES: Record<ThemeColors['id'], ThemeColors> = {
  light: {
    id: 'light',
    name: 'Bento Light',
    description: 'Fresh slate gray layout with professional indigo accents',
    bgPage: 'bg-[#F1F5F9]',
    sidebarBg: 'bg-white',
    sidebarBorder: 'border-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    textMain: 'text-slate-800',
    textBody: 'text-slate-600',
    textMuted: 'text-slate-400',
    primaryText: 'text-indigo-600',
    primaryBg: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    primaryRing: 'ring-indigo-500',
    accentBgLight: 'bg-indigo-50 border-indigo-100',
    accentTextList: 'text-indigo-700',
    inputBg: 'bg-slate-50',
    borderFocus: 'focus:border-indigo-500',
  },
  dark: {
    id: 'dark',
    name: 'Cosmic Obsidian',
    description: 'Immersive deep graphite canvas with neon purple links',
    bgPage: 'bg-[#0B0F19]',
    sidebarBg: 'bg-[#121A2E]',
    sidebarBorder: 'border-slate-800',
    cardBg: 'bg-[#1E293B]',
    cardBorder: 'border-slate-800',
    textMain: 'text-slate-100',
    textBody: 'text-slate-300',
    textMuted: 'text-slate-400',
    primaryText: 'text-violet-400',
    primaryBg: 'bg-violet-600',
    primaryHover: 'hover:bg-violet-500',
    primaryRing: 'ring-violet-400',
    accentBgLight: 'bg-violet-950/40 border-violet-900',
    accentTextList: 'text-violet-300',
    inputBg: 'bg-[#121A2E]',
    borderFocus: 'focus:border-violet-500',
  },
  teal: {
    id: 'teal',
    name: 'Teal Oasis',
    description: 'Crisp botanical layout with calm mint and sea foam accents',
    bgPage: 'bg-[#E4F2F1]',
    sidebarBg: 'bg-white',
    sidebarBorder: 'border-teal-200',
    cardBg: 'bg-white',
    cardBorder: 'border-teal-100',
    textMain: 'text-slate-800',
    textBody: 'text-slate-600',
    textMuted: 'text-teal-605 text-slate-400',
    primaryText: 'text-teal-600',
    primaryBg: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    primaryRing: 'ring-teal-500',
    accentBgLight: 'bg-teal-50 border-teal-100',
    accentTextList: 'text-teal-700',
    inputBg: 'bg-teal-50/20',
    borderFocus: 'focus:border-teal-500',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Peach',
    description: 'Warm golden layout with cozy amber and coral accents',
    bgPage: 'bg-[#FFFBEB]',
    sidebarBg: 'bg-white',
    sidebarBorder: 'border-amber-200',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-100',
    textMain: 'text-amber-950',
    textBody: 'text-amber-900/80',
    textMuted: 'text-amber-600',
    primaryText: 'text-orange-600',
    primaryBg: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    primaryRing: 'ring-orange-500',
    accentBgLight: 'bg-orange-50 border-orange-100',
    accentTextList: 'text-orange-700',
    inputBg: 'bg-amber-50/30',
    borderFocus: 'focus:border-orange-500',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Wave',
    description: 'Fresh turquoise backdrop with rich deep cobalt styling',
    bgPage: 'bg-[#E1F5FE]',
    sidebarBg: 'bg-white',
    sidebarBorder: 'border-sky-200',
    cardBg: 'bg-white',
    cardBorder: 'border-sky-100',
    textMain: 'text-slate-800',
    textBody: 'text-slate-600',
    textMuted: 'text-sky-600',
    primaryText: 'text-sky-600',
    primaryBg: 'bg-sky-600',
    primaryHover: 'hover:bg-sky-700',
    primaryRing: 'ring-sky-500',
    accentBgLight: 'bg-sky-50 border-sky-100',
    accentTextList: 'text-sky-750 text-sky-700',
    inputBg: 'bg-sky-50/20',
    borderFocus: 'focus:border-sky-500',
  },
  purple: {
    id: 'purple',
    name: 'Amethyst Velvet',
    description: 'Sophisticated electric lavender motif with velvet icons',
    bgPage: 'bg-[#F3E8FF]/70',
    sidebarBg: 'bg-white',
    sidebarBorder: 'border-purple-200',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-100',
    textMain: 'text-slate-800',
    textBody: 'text-slate-600',
    textMuted: 'text-purple-500',
    primaryText: 'text-purple-600',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryRing: 'ring-purple-500',
    accentBgLight: 'bg-purple-50 border-purple-100',
    accentTextList: 'text-purple-700',
    inputBg: 'bg-purple-50/20',
    borderFocus: 'focus:border-purple-500',
  }
};

export const getTheme = (id?: ThemeColors['id']): ThemeColors => {
  return THEMES[id || 'light'] || THEMES.light;
};
