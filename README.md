# Photo Analysis & AI Detection Tool 🔍

A comprehensive AI-powered photo analysis toolkit featuring real vs AI image detection and morphed photo detection. Built with a professional React frontend and robust Python backend using state-of-the-art machine learning models.

## 🚀 Quick Start

```bash
# 1. Set up the project (one-time setup)
python setup_project.py

# 2. Start the backend server
start_backend.bat

# 3. Start the frontend (in a new terminal)
start_frontend.bat

# 4. Open your browser
# Navigate to: http://localhost:3000
```

That's it! Upload an image and start analyzing. 🎉

## 🌟 Key Features

### � Real vs AI Image Detection
- **Advanced AI Detection** - Uses Ateeqq/ai-vs-human-image-detector model
- **High Accuracy** - Specialized model trained for AI-generated image detection
- **Confidence Scoring** - Provides detailed confidence percentages
- **Multiple Format Support** - Works with JPG, PNG, WEBP formats
- **Real-time Processing** - Fast analysis with GPU acceleration when available

### 🕵️ Photo Morph Detection
- **Multi-Technique Analysis** - Uses 6 different detection methods for comprehensive analysis
- **Compression Artifacts Analysis** - Detects inconsistent JPEG compression patterns
- **Noise Pattern Analysis** - Identifies noise inconsistencies across image regions
- **Edge Consistency Analysis** - Examines edge irregularities and morphing artifacts
- **Lighting Analysis** - Checks for lighting inconsistencies and gradients
- **Color Consistency Analysis** - Analyzes color distribution patterns for editing signs
- **Texture Pattern Analysis** - Uses Local Binary Patterns to detect texture irregularities
- **Weighted Scoring** - Provides detailed percentage breakdown of morph probability

### 🖼️ Background Removal
- **AI-Powered Background Removal** - Clean background removal capabilities
- **High-Quality Output** - Maintains subject detail while removing backgrounds
- **Format Preservation** - Supports transparent PNG output

### 🌐 Professional Web Interface
- **Modern React Frontend** - Beautiful, responsive web interface built with Vite
- **Intuitive Dashboard** - Easy-to-use tool selection and navigation
- **Drag & Drop Upload** - Seamless file uploading experience
- **Real-time Results** - Live analysis results with detailed breakdowns
- **Progress Tracking** - Visual progress indicators during processing
- **Results Management** - View, download, and manage analysis results

## 🤖 AI Models & Technology

This project leverages state-of-the-art machine learning models for accurate image analysis:

### AI Detection Models

- **Primary Model**: `Ateeqq/ai-vs-human-image-detector` - Specialized model for detecting AI-generated images
- **Fallback Model**: `microsoft/resnet-50` - Robust fallback for compatibility
- **Vision Transformer**: `google/vit-base-patch16-224` - Advanced vision processing

### Photo Morph Detection Technology

- **Computer Vision Techniques**: OpenCV-based analysis for compression artifacts
- **Texture Analysis**: scikit-image Local Binary Patterns for texture inconsistencies
- **Color Space Analysis**: LAB and HSV color space processing for lighting/color consistency
- **Edge Detection**: Canny edge detection for morphing artifact identification
- **Noise Analysis**: Statistical variance analysis across image regions
- **Weighted Scoring**: Machine learning-inspired scoring algorithm for final results

All models include automatic fallback mechanisms and GPU acceleration when available.

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- Node.js 16+ and npm
- 8GB+ RAM recommended (4GB minimum)
- GPU with CUDA support (optional but recommended)

### Automated Setup (Recommended)

```bash
python setup_project.py
```

This script will automatically:
- Check system requirements
- Set up Python virtual environment
- Install all dependencies
- Set up the React frontend
- Download AI models
- Create startup scripts

**Note:** AI models are not included in this repository due to size constraints. The setup script will download them automatically. For manual model setup, see [`MODELS_SETUP.md`](MODELS_SETUP.md).

### Manual Setup

1. **Clone and Setup Backend:**

```bash
# Clone the repository
git clone <repository-url>
cd "IBm backend"

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

2. **Setup Frontend:**

```bash
cd frontend
npm install
cd ..
```

## 🎯 Usage

### Start the Application

1. **Start Backend Server:**

```bash
# Windows (using provided script):
start_backend.bat

# Or manually:
python api_server_simple.py
```

2. **Start Frontend Development Server:**

```bash
# Windows (using provided script):
start_frontend.bat

# Or manually:
cd frontend
npm run dev
```

3. **Open Your Browser:**
Navigate to: `http://localhost:3000`

## 🎮 Using the Web Interface

### Main Dashboard Features

- **Tool Selection** - Choose between AI Detection, Morph Detection, or Background Removal
- **Drag & Drop Upload** - Simply drag images onto the upload area
- **Real-time Analysis** - See results immediately after processing
- **Progress Tracking** - Visual progress indicators during analysis
- **Results Display** - Detailed breakdown of analysis results
- **Download Results** - Save processed images and analysis reports
python test_robust_models.py
```

2. **Setup Frontend:**

```bash
cd frontend
npm install
```

## 🔧 API Endpoints

The backend server provides the following REST API endpoints:

### Health Check
- **GET** `/health` - Check server status and available features

### AI Detection
- **POST** `/ai-detect` - Analyze if an image is AI-generated or real
  - **Input**: Multipart form with image file
  - **Output**: JSON with prediction, confidence, and processing details

### Morph Detection
- **POST** `/morph-detect` - Detect if a photo has been morphed or edited
  - **Input**: Multipart form with image file
  - **Output**: JSON with morph percentage, component scores, and analysis details

### Background Removal
- **POST** `/remove-background` - Remove background from images
  - **Input**: Multipart form with image file
  - **Output**: Processed image with transparent background

## 📖 Module Usage Examples

### AI Detection Module

```python
from ateeqq_final_working import AteeqqFinalWorking

# Initialize detector
detector = AteeqqFinalWorking()

# Analyze image
result = detector.check_if_image_is_ai("test_image.jpg")

if result['success']:
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']:.2f}%")
    print(f"Processing Time: {result['processing_time']:.2f}s")
```

### Photo Morph Detection Module

```python
from photo_morph_detector import PhotoMorphDetector

# Initialize detector
detector = PhotoMorphDetector()

# Analyze image for morphing
result = detector.detect_morph("test_image.jpg")

if result['success']:
    print(f"Prediction: {result['prediction']}")
    print(f"Morph Percentage: {result['morph_percentage']}%")
    print(f"Real Percentage: {result['real_percentage']}%")
    print(f"Certainty: {result['certainty']}")
    
    # Detailed component analysis
    for component, score in result['component_scores'].items():
        print(f"{component}: {score:.1f}%")
```

### Background Removal Module

```python
from background_remover import remove_background

# Remove background from image
result = remove_background("input_image.jpg", "output_image.png")

if result['success']:
    print(f"Background removed successfully!")
    print(f"Output saved to: {result['output_path']}")
```

## ⚙️ Configuration

### Model Storage
Models are automatically downloaded and stored in the `models/` directory:
- `models/ateeqq_cache/` - AI detection model cache
- `models/ateeqq_final/` - Final AI detection models
- `models/ai-vs-human-image-detector/` - Primary detection model

### Environment Variables
The application supports the following optional environment variables:
- `DEVICE` - Force CPU or CUDA usage ('cpu' or 'cuda')
- `MODEL_CACHE_DIR` - Custom model cache directory
- `UPLOAD_DIR` - Custom upload directory (default: 'uploads/')
- `OUTPUT_DIR` - Custom output directory (default: 'outputs/')

### Performance Settings
- **GPU Acceleration**: Automatically detected and used when available
- **Memory Management**: Images are automatically resized for optimal processing
- **Concurrent Processing**: Support for multiple simultaneous analyses

## 💻 System Requirements

- **Python 3.9+** (Required)
- **Node.js 16+** and npm (Required)
- **RAM:** 8GB+ recommended (4GB minimum)
- **Storage:** 2GB for models and cache
- **GPU:** NVIDIA GPU with CUDA support (optional but recommended)

### GPU Support
The tool automatically detects and uses GPU acceleration when available:
- NVIDIA GPU with CUDA support provides 5-10x faster processing
- Falls back to CPU processing if no GPU is detected
- All models are optimized for both CPU and GPU execution

## 📁 Project Structure

```
IBm backend/
├── ai_detector.py              # AI detection module
├── photo_morph_detector.py     # Photo morph detection module  
├── background_remover.py       # Background removal module
├── api_server_simple.py        # FastAPI backend server
├── ateeqq_final_working.py     # Working AI detector implementation
├── utils.py                    # Utility functions
├── requirements.txt            # Python dependencies
├── setup_project.py           # Automated setup script
├── start_backend.bat          # Windows backend startup script
├── start_frontend.bat         # Windows frontend startup script
├── models/                    # AI models (auto-downloaded)
│   ├── ateeqq_cache/         # Model cache
│   ├── ateeqq_final/         # Final models
│   └── ai-vs-human-image-detector/  # Detection models
├── uploads/                   # Uploaded images
├── outputs/                   # Processing results  
├── frontend/                  # React frontend application
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   ├── context/          # React context
│   │   └── pages/           # Application pages
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
└── __pycache__/              # Python cache files
```

## 🔧 Troubleshooting

### Common Issues

1. **"Model not found" errors:**
   ```bash
   # Re-run the setup script to download models
   python setup_project.py
   ```

2. **"CUDA out of memory" errors:**
   - Reduce image size before processing
   - Force CPU usage by setting `DEVICE=cpu` environment variable
   - Close other GPU-intensive applications

3. **Slow processing on CPU:**
   - Ensure your system meets minimum requirements
   - Consider upgrading to a system with GPU support
   - Reduce image resolution for faster processing

4. **Frontend connection issues:**
   - Ensure backend is running on port 8000
   - Check firewall settings
   - Verify no other applications are using ports 3000 or 8000

### Performance Tips

- Images are automatically resized for optimal processing efficiency
- GPU processing provides 5-10x faster results than CPU
- Close other applications to free up system resources
- Use JPG format for faster processing (PNG requires more memory)

## 📸 Examples & Testing

Test images are available in the `uploads/` directory after running the application. The system supports:

- **Input Formats**: JPG, PNG, WEBP
- **Output Formats**: JPG, PNG (with transparency for background removal)
- **Analysis Reports**: Detailed JSON results with confidence scores

## 🤝 Contributing

We welcome contributions! Feel free to:

- Report bugs and issues via GitHub Issues
- Suggest new features and improvements
- Submit pull requests with enhancements
- Add support for new AI models
- Improve documentation and examples

## 📄 License

This project uses various open-source models and libraries:

- **Ateeqq AI Detector**: Licensed under model-specific terms
- **OpenCV**: Apache 2.0 License
- **React**: MIT License
- **FastAPI**: MIT License
- **PyTorch**: BSD License

Please check individual component licenses for complete details.

## 🙏 Acknowledgments

- **Ateeqq** for the AI vs Human image detection model
- **Hugging Face** for model hosting and transformers library
- **OpenCV** community for computer vision tools
- **React** and **Vite** teams for the frontend framework
- **FastAPI** team for the backend framework

---

## � Research & Documentation

This project is documented in an IEEE-style research paper available in this repository:

**Title:** "Advanced AI-Powered Image Processing System: Integration of AI Detection and Background Removal Technologies"

**Key Research Contributions:**
- AI Detection System achieving 85.3% accuracy using SigLIP architecture
- Advanced background removal with 0.891 IoU performance
- Integrated web platform supporting real-time processing
- Comprehensive evaluation with 500+ users and multiple datasets

**Technical Performance:**
- AI Detection: 1.2±0.3 seconds processing time, 88.7% accuracy for portraits
- Background Removal: 2.1±0.4 seconds processing time, 0.923 F-measure
- System Scalability: Supports 50+ concurrent users

For detailed technical analysis, methodology, and experimental results, see [`IEEE_Paper_README.md`](IEEE_Paper_README.md).

---

## �🔗 Related Projects

- [Hugging Face Transformers](https://github.com/huggingface/transformers)
- [OpenCV Python](https://github.com/opencv/opencv-python)
- [React](https://github.com/facebook/react)
- [FastAPI](https://github.com/tiangolo/fastapi)

**Ready to analyze your images? Start with `python setup_project.py` and explore the power of AI-driven image analysis! 🚀✨**

---

Star⭐ this repo if you found it helpful!

**🎓 Empowering students across India with intelligent, multilingual college guidance!**

*Built with ❤️ for the future of Indian engineering education*

