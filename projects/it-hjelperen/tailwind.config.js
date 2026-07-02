/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			screens: {
				'nav': '850px',
			},
			zIndex: {
				'60': '60',
			},
			colors: {
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#4a90d9',
					600: '#376698',
					700: '#2c5278',
					800: '#1e3a54',
					900: '#152a3d',
				},
				dark: {
					bg: '#0e1318',
					surface: '#161e25',
				},
				light: {
					bg: '#F8F8FA',
					surface: '#FFFFFF',
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				'4xl': '2rem',
			}
		}
	},
	plugins: []
};
