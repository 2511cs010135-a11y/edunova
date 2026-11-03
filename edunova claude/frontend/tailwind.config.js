/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0F19',
          light: '#111827',
          soft: '#1F2937'
        },
        paper: '#F3F4F6',
        amber: {
          DEFAULT: '#6366F1', // Electric Indigo
          dark: '#4F46E5',
          neon: '#8B5CF6'
        },
        mint: {
          DEFAULT: '#06B6D4', // Vibrant Cyan
          dark: '#0891B2',
          emerald: '#10B981'
        },
        slate: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgba(99,102,241,0.2) 1px, transparent 1px)',
        'hero-gradient':
          'radial-gradient(ellipse at 50% -20%, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.15), rgba(11, 15, 25, 1))',
        'card-glow':
          'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.08) 100%)'
      },
      backgroundSize: {
        'dot-grid': '20px 20px'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    }
  },
  plugins: []
};
