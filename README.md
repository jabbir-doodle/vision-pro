# Vision Pro UI Demo

A stunning Vision Pro-style upload UI component built with Next.js, React, and Framer Motion. This project demonstrates how to create Apple Vision Pro-inspired interfaces with glass morphism, 3D effects, and smooth animations.

## ✨ Features

- **Glass Morphism UI** - Realistic glass effects with backdrop blur
- **3D Interactions** - Mouse-responsive transforms and perspective
- **Animated Backgrounds** - Dynamic gradients and particle systems
- **Theme Support** - Built-in light/dark mode switching
- **File Upload** - Drag & drop functionality with visual feedback
- **Processing Animation** - Holographic progress indicators
- **Responsive Design** - Mobile-friendly layouts
- **TypeScript** - Full type safety

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone or download this project**
   ```bash
   # If you have this as a zip file, extract it
   # If you have it in a git repo, clone it
   cd vision-pro-ui-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the demo.

## 🎨 Component Usage

### Basic Implementation

```tsx
import VisionProUpload from './components/VisionProUpload';

function App() {
  const handleFileLoaded = (content: string) => {
    console.log('File uploaded:', content);
    // Handle the uploaded file content
  };

  return (
    <VisionProUpload onFileLoaded={handleFileLoaded} />
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onFileLoaded` | `(content: string) => void` | Callback function called when a file is successfully uploaded and processed |

### Supported File Types

- `.txt` - Text files
- `.json` - JSON files
- `.log` - Log files
- `.csv` - CSV files
- `.xml` - XML files

## 🎯 Key Technologies

- **Next.js 14** - React framework with App Router
- **React 18** - Component library
- **Framer Motion** - Animation and gesture library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **TypeScript** - Type safety

## 📁 Project Structure

```
vision-pro-ui-demo/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   └── VisionProUpload.tsx  # Main component
│   └── styles/
│       └── vision-pro-upload.css # Component styles
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Customization

### Theme Colors

Edit the CSS variables in `src/styles/vision-pro-upload.css`:

```css
/* Dark mode colors */
.vision-pro-upload {
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
}

/* Light mode colors */
.light-mode .vision-pro-upload {
  background: radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
}
```

### Animation Speed

Modify animation durations in the component:

```tsx
// Slower animations
transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}

// Faster animations  
transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
```

### Glass Effect Intensity

Adjust the backdrop blur and opacity:

```tsx
style={{
  backdropFilter: 'blur(40px) saturate(200%)', // More blur
  background: 'rgba(255, 255, 255, 0.05)',     // More transparency
}}
```

## 📱 Mobile Responsive

The component includes responsive breakpoints:

- **Desktop**: Full features with 3D effects
- **Tablet (768px)**: Adjusted sizing and spacing  
- **Mobile (480px)**: Simplified layout, optimized touch targets

## 🎭 Animation Details

### Mouse Tracking
- 3D rotation based on mouse position
- Interactive light fields that follow cursor
- Smooth spring animations

### Processing States
- Holographic progress rings
- Particle explosion effects  
- Dynamic gradient backgrounds
- Smooth state transitions

### Glass Morphism
- Multi-layer blur effects
- Subtle border highlights
- Realistic depth shadows
- Interactive hover states

## 🔧 Build Commands

```bash
# Development server
npm run dev

# Production build  
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📄 License

MIT License - feel free to use this in your own projects!

## 🤝 Contributing

This is a demo project, but feel free to:
- Report issues
- Suggest improvements
- Share your implementations
- Create variants

## 💡 Tips for Implementation

1. **Performance**: The component uses many animations - consider reducing them for lower-end devices
2. **Accessibility**: Add proper ARIA labels and keyboard navigation
3. **File Validation**: Extend the file handling for your specific use cases
4. **Error Handling**: Add comprehensive error states and user feedback
5. **Testing**: Consider adding unit tests for file upload functionality

## 🌟 Inspiration

This component is inspired by Apple's Vision Pro interface design principles:
- Spatial computing aesthetics
- Glass morphism materials
- Depth and layering
- Smooth, natural animations
- Premium visual quality

---

**Enjoy building with Vision Pro UI! 🚀**