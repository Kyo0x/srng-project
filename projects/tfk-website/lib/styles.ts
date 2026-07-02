// Reusable Tailwind classes
// probably should use css variables instead but this works
export const styles = {
  // Container styles
  container: 'container mx-auto px-4',
  containerWide: 'container mx-auto px-4 md:px-8 lg:px-16',
  
  // Card styles
  card: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300',
  cardDark: 'bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300',
  
  // Button styles
  button: 'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300',
  buttonPrimary: 'bg-emerald-600 text-white hover:bg-emerald-700',
  buttonSecondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  
  // Section styles
  section: 'py-12 md:py-16',
  sectionGreen: 'py-12 md:py-16 bg-gradient-to-br from-emerald-50 to-teal-50',
  
  // Heading styles
  h1: 'text-4xl md:text-5xl font-bold text-gray-900',
  h2: 'text-3xl md:text-4xl font-bold text-gray-900 mb-8',
  h3: 'text-2xl md:text-3xl font-bold text-gray-900 mb-4',
  
  // Text styles
  prose: 'prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 prose-strong:text-gray-900',
} as const;

// Utility function to combine classes
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
