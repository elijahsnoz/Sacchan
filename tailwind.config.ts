import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sac: {
          gold: '#d7b56d',
          cream: '#f5ead7',
          blue: '#63a7ff',
          ink: '#08111f',
          panel: 'rgba(8, 17, 31, 0.72)',
          line: 'rgba(255, 255, 255, 0.12)'
        }
      },
      boxShadow: {
        glow: '0 0 80px rgba(215, 181, 109, 0.22)'
      },
      backgroundImage: {
        'sac-grid': 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)'
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' }
        },
        routeLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' }
        }
      },
      animation: {
        drift: 'drift 10s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        routeLine: 'routeLine 12s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
