/**
 * Theme Configuration
 *
 * Based on the project's theme profile:
 * - Tone: Neutral
 * - Density: Balanced
 * - Primary: #6366f1 (Indigo)
 * - Font: Inter
 */

export interface Theme {
  name: string;
  tone: string;
  density: string;
  palette: {
    primary: {
      base: string;
      foreground: string;
      emphasis: string;
    };
    secondary: {
      base: string;
      foreground: string;
      emphasis: string;
    };
    accent: {
      base: string;
      foreground: string;
      emphasis: string;
    };
    success: {
      base: string;
      foreground: string;
      emphasis: string;
    };
    warning: {
      base: string;
      foreground: string;
      emphasis: string;
    };
    danger: {
      base: string;
      foreground: string;
      emphasis: string;
    };
  };
  neutrals: {
    background: string;
    surface: string;
    muted: string;
    textPrimary: string;
    textSecondary: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  spacing: {
    scale: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      "2xl": number;
    };
    components: {
      paddingY: number;
      paddingX: number;
      gap: number;
    };
  };
  typography: {
    fontFamily: string;
    headingsFamily: string;
    scale: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      "2xl": number;
    };
    weight: {
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  motion: {
    ease: string;
    duration: {
      fast: number;
      base: number;
      slow: number;
    };
  };
}

export const theme: Theme = {
  name: "jn74zky3xx5yj89rx9nes87swx7skt7x-theme",
  tone: "neutral",
  density: "balanced",
  palette: {
    primary: {
      base: "#6366f1",
      foreground: "#ffffff",
      emphasis: "#4338ca",
    },
    secondary: {
      base: "#0ea5e9",
      foreground: "#0f172a",
      emphasis: "#0284c7",
    },
    accent: {
      base: "#f97316",
      foreground: "#0f172a",
      emphasis: "#ea580c",
    },
    success: {
      base: "#16a34a",
      foreground: "#022c22",
      emphasis: "#15803d",
    },
    warning: {
      base: "#facc15",
      foreground: "#422006",
      emphasis: "#eab308",
    },
    danger: {
      base: "#ef4444",
      foreground: "#450a0a",
      emphasis: "#dc2626",
    },
  },
  neutrals: {
    background: "#f8fafc",
    surface: "#ffffff",
    muted: "#e2e8f0",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    pill: 999,
  },
  spacing: {
    scale: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 20,
      xl: 28,
      "2xl": 40,
    },
    components: {
      paddingY: 12,
      paddingX: 20,
      gap: 16,
    },
  },
  typography: {
    fontFamily: "Inter, 'Inter Variable', system-ui, sans-serif",
    headingsFamily: "'Plus Jakarta Sans', 'Inter Variable', sans-serif",
    scale: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 22,
      "2xl": 28,
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(15, 23, 42, 0.08)",
    md: "0 10px 25px -15px rgba(15, 23, 42, 0.25)",
    lg: "0 18px 40px -20px rgba(15, 23, 42, 0.35)",
  },
  motion: {
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    duration: {
      fast: 120,
      base: 200,
      slow: 320,
    },
  },
};
