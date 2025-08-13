import React, { useState, useEffect } from 'react';
// Theme management utilities for dynamic color palette and accessibility
export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.systemPrefers = this.getSystemPreference();
    this.customColors = {};
    
    // Initialize theme on load
    this.initialize();
  }
  
  initialize() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('cashflow_theme');
    const savedColors = localStorage.getItem('cashflow_colors');
    const savedAccessibility = localStorage.getItem('cashflow_accessibility');
    
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    
    if (savedColors) {
      try {
        this.customColors = JSON.parse(savedColors);
      } catch (e) {
        console.warn('Failed to parse saved colors');
      }
    }
    
    if (savedAccessibility) {
      try {
        const accessibility = JSON.parse(savedAccessibility);
        this.applyAccessibilitySettings(accessibility);
      } catch (e) {
        console.warn('Failed to parse accessibility settings');
      }
    }
    
    // Apply initial theme
    this.applyTheme();
    
    // Listen for system theme changes
    this.setupSystemThemeListener();
  }
  
  getSystemPreference() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
    }
    return 'light';
  }
  
  setupSystemThemeListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        this.systemPrefers = e?.matches ? 'dark' : 'light';
        if (this.currentTheme === 'auto') {
          this.applyTheme();
        }
      };
      
      // Modern browsers
      if (mediaQuery?.addEventListener) {
        mediaQuery?.addEventListener('change', handleChange);
      } else {
        // Legacy browsers
        mediaQuery?.addListener(handleChange);
      }
    }
  }
  
  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('cashflow_theme', theme);
    this.applyTheme();
  }
  
  applyTheme() {
    const root = document.documentElement;
    const effectiveTheme = this.getEffectiveTheme();
    
    // Remove existing theme classes
    root.classList?.remove('light', 'dark');
    
    // Add new theme class
    root.classList?.add(effectiveTheme);
    
    // Apply custom colors if any
    this.applyCustomColors();
    
    // Trigger theme change event
    this.dispatchThemeChange(effectiveTheme);
  }
  
  getEffectiveTheme() {
    if (this.currentTheme === 'auto') {
      return this.systemPrefers;
    }
    return this.currentTheme;
  }
  
  setCustomColors(colors) {
    this.customColors = { ...this.customColors, ...colors };
    localStorage.setItem('cashflow_colors', JSON.stringify(this.customColors));
    this.applyCustomColors();
  }
  
  applyCustomColors() {
    const root = document.documentElement;
    
    // Apply custom colors to CSS variables
    Object.entries(this.customColors)?.forEach(([key, value]) => {
      if (this.validateColor(value)) {
        root.style?.setProperty(`--color-${key}`, value);
      }
    });
  }
  
  validateColor(color) {
    // Basic hex color validation
    return /^#[0-9A-F]{6}$/i?.test(color);
  }
  
  resetColors() {
    this.customColors = {};
    localStorage.removeItem('cashflow_colors');
    
    // Remove custom color properties
    const root = document.documentElement;
    const customProperties = [
      '--color-primary',
      '--color-secondary',
      '--color-accent',
      '--color-success',
      '--color-warning',
      '--color-error'
    ];
    
    customProperties?.forEach(prop => {
      root.style?.removeProperty(prop);
    });
  }
  
  setDensity(density) {
    const body = document.body;
    
    // Remove existing density classes
    body?.classList?.remove('compact', 'comfortable');
    
    // Add new density class
    if (density === 'compact' || density === 'comfortable') {
      body?.classList?.add(density);
    }
    
    localStorage.setItem('cashflow_density', density);
  }
  
  setAccessibilitySettings(settings) {
    this.applyAccessibilitySettings(settings);
    localStorage.setItem('cashflow_accessibility', JSON.stringify(settings));
  }
  
  applyAccessibilitySettings(settings) {
    const body = document.body;
    
    // High contrast mode
    if (settings?.highContrast) {
      body?.classList?.add('high-contrast');
    } else {
      body?.classList?.remove('high-contrast');
    }
    
    // Large text mode
    if (settings?.largeText) {
      body?.classList?.add('large-text');
    } else {
      body?.classList?.remove('large-text');
    }
    
    // Reduced motion mode
    if (settings?.reducedMotion) {
      body?.classList?.add('reduced-motion');
    } else {
      body?.classList?.remove('reduced-motion');
    }
  }
  
  // Color contrast validation (WCAG AAA compliance)
  checkContrast(foreground, background) {
    const rgb1 = this.hexToRgb(foreground);
    const rgb2 = this.hexToRgb(background);
    
    if (!rgb1 || !rgb2) return false;
    
    const luminance1 = this.getLuminance(rgb1);
    const luminance2 = this.getLuminance(rgb2);
    
    const contrast = (Math.max(luminance1, luminance2) + 0.05) / 
                    (Math.min(luminance1, luminance2) + 0.05);
    
    return {
      ratio: contrast,
      AA: contrast >= 4.5,
      AAA: contrast >= 7
    };
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i?.exec(hex);
    return result ? {
      r: parseInt(result?.[1], 16),
      g: parseInt(result?.[2], 16),
      b: parseInt(result?.[3], 16)
    } : null;
  }
  
  getLuminance(rgb) {
    const { r, g, b } = rgb;
    
    const sRGB = [r, g, b]?.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB?.[0] + 0.7152 * sRGB?.[1] + 0.0722 * sRGB?.[2];
  }
  
  // Generate accessible color palette
  generateAccessiblePalette(baseColor) {
    const base = this.hexToRgb(baseColor);
    if (!base) return null;
    
    const variants = {
      50: this.lightenColor(baseColor, 95),
      100: this.lightenColor(baseColor, 90),
      200: this.lightenColor(baseColor, 80),
      300: this.lightenColor(baseColor, 70),
      400: this.lightenColor(baseColor, 60),
      500: baseColor, // Base color
      600: this.darkenColor(baseColor, 10),
      700: this.darkenColor(baseColor, 20),
      800: this.darkenColor(baseColor, 30),
      900: this.darkenColor(baseColor, 40),
    };
    
    return variants;
  }
  
  lightenColor(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = percent / 100;
    const r = Math.round(rgb?.r + (255 - rgb?.r) * factor);
    const g = Math.round(rgb?.g + (255 - rgb?.g) * factor);
    const b = Math.round(rgb?.b + (255 - rgb?.b) * factor);
    
    return this.rgbToHex(r, g, b);
  }
  
  darkenColor(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = 1 - (percent / 100);
    const r = Math.round(rgb?.r * factor);
    const g = Math.round(rgb?.g * factor);
    const b = Math.round(rgb?.b * factor);
    
    return this.rgbToHex(r, g, b);
  }
  
  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)?.toString(16)?.slice(1)}`;
  }
  
  dispatchThemeChange(theme) {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('theme-change', {
        detail: { theme, manager: this }
      });
      window.dispatchEvent(event);
    }
  }
  
  // Export current theme settings
  exportSettings() {
    return {
      theme: this.currentTheme,
      colors: this.customColors,
      density: localStorage.getItem('cashflow_density') || 'comfortable',
      accessibility: JSON.parse(localStorage.getItem('cashflow_accessibility') || '{}'),
    };
  }
  
  // Import theme settings
  importSettings(settings) {
    if (settings?.theme) {
      this.setTheme(settings?.theme);
    }
    
    if (settings?.colors) {
      this.setCustomColors(settings?.colors);
    }
    
    if (settings?.density) {
      this.setDensity(settings?.density);
    }
    
    if (settings?.accessibility) {
      this.setAccessibilitySettings(settings?.accessibility);
    }
  }
}

// Create global theme manager instance
export const themeManager = new ThemeManager();

// Theme hook for React components
export const useTheme = () => {
  const [theme, setTheme] = React.useState(themeManager?.getEffectiveTheme());
  
  React.useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event?.detail?.theme);
    };
    
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);
  
  return {
    theme,
    setTheme: themeManager?.setTheme?.bind(themeManager),
    setCustomColors: themeManager?.setCustomColors?.bind(themeManager),
    setDensity: themeManager?.setDensity?.bind(themeManager),
    setAccessibilitySettings: themeManager?.setAccessibilitySettings?.bind(themeManager),
    checkContrast: themeManager?.checkContrast?.bind(themeManager),
    exportSettings: themeManager?.exportSettings?.bind(themeManager),
    importSettings: themeManager?.importSettings?.bind(themeManager),
  };
};

export default themeManager;