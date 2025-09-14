# Smart Image Prep - Frontend

A modern, professional React frontend for the Smart Image Preparation Tool. Built with React, Vite, and Tailwind CSS for an exceptional user experience.

## 🚀 Features

### ✨ Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - Automatic theme switching based on user preference
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Professional Design** - Clean, modern interface with attention to detail

### 🎯 Core Functionality
- **Drag & Drop Upload** - Intuitive image uploading with progress indicators
- **Real-time Preview** - Live image preview with zoom and pan controls
- **Interactive Tools** - Easy-to-use controls for all AI features
- **Results Management** - Download, share, and manage processed images
- **Batch Processing** - Handle multiple images efficiently

### 🔧 Technical Features
- **React 18** - Latest React with concurrent features
- **Vite** - Lightning-fast development and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Context API** - Efficient state management
- **TypeScript Ready** - Full TypeScript support (optional)

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API server running on port 8000

### Quick Start

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── tools/         # Tool-specific panels
│   │   ├── ImageUpload.jsx
│   │   ├── ImagePreview.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/           # React Context providers
│   │   └── ImageContext.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   └── About.jsx
│   ├── services/          # API and utility services
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#0ea5e9` to `#0284c7`)
- **Secondary**: Purple gradient (`#d946ef` to `#c026d3`)
- **Accent**: Orange gradient (`#f97316` to `#ea580c`)
- **Gray Scale**: Tailwind gray palette

### Typography
- **Font Family**: Inter (primary), JetBrains Mono (code)
- **Font Weights**: 300, 400, 500, 600, 700, 800

### Components
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Cards**: Consistent shadow and border radius
- **Inputs**: Unified styling with focus states
- **Badges**: Color-coded status indicators

## 🔌 API Integration

The frontend communicates with the Python backend through a REST API:

### Endpoints Used
- `POST /upload` - Upload images
- `POST /smart-crop` - Smart cropping
- `POST /outpaint` - Image outpainting
- `POST /text-overlay` - Text overlay
- `POST /ai-detect` - AI detection
- `POST /process-complete` - Complete pipeline
- `GET /health` - Health check

### Configuration
API base URL is configured in `vite.config.js` proxy settings:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

## 🎯 Key Components

### ImageUpload
- Drag & drop interface
- File validation
- Upload progress
- Error handling

### ImagePreview
- Zoom and pan controls
- Before/after comparison
- Image information display
- Download functionality

### ToolPanel
- Dynamic tool configuration
- Real-time settings updates
- Progress indicators
- Error handling

### ProcessingStatus
- Live progress updates
- Step-by-step breakdown
- Cancel functionality
- Error recovery

## 🚀 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Image Optimization
- Responsive image loading
- Progressive enhancement
- Efficient caching strategies

### Bundle Optimization
- Tree shaking enabled
- Minification and compression
- Asset optimization

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Tips
1. **Hot Reload** - Changes reflect immediately
2. **Error Overlay** - Clear error messages in development
3. **DevTools** - React DevTools integration
4. **Console Logging** - Comprehensive logging for debugging

### Environment Variables
Create a `.env.local` file for local configuration:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Smart Image Prep
```

## 🎨 Customization

### Theming
Modify `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Animations
- Breakpoints

### Components
All components are modular and can be easily customized:
- Consistent prop interfaces
- CSS class composition
- Theme-aware styling

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly interface
- Optimized image handling
- Reduced motion options
- Efficient data usage

## 🔧 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure API server is running on port 8000
   - Check CORS configuration
   - Verify network connectivity

2. **Upload Failures**
   - Check file size limits (50MB max)
   - Verify supported formats (JPEG, PNG, WebP)
   - Ensure stable internet connection

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true')
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Vite** - For the fast build tool
- **Lucide React** - For beautiful icons

---

**Happy coding! 🎨✨**
