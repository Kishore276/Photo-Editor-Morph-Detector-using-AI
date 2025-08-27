# Smart Image Preparation Tool 🎨

A comprehensive AI-powered image preparation toolkit with a professional React frontend and Python backend. Perfect for social media creators who need professional-quality image processing with complete privacy and offline operation.

## 🌟 Features

### 🔍 Smart Cropping with Content Preservation
- **AI Object Detection** - Uses YOLOv8 to detect main subjects
- **Intelligent Cropping** - Crops to target aspect ratios without cutting off subjects
- **Smart Padding** - Uses padding instead of cropping when subjects would be lost
- **Multiple Formats** - Supports 1:1, 9:16, 16:9 and custom aspect ratios

### 🧠 AI Image Enlargement / Outpainting
- **Stable Diffusion Powered** - Uses Stable Diffusion 2 Inpainting for extensions
- **Style Preservation** - Maintains original style and content seamlessly
- **Custom Prompts** - Control the style of generated extensions
- **Aspect Ratio Fitting** - Extend to specific aspect ratios automatically

### ✍️ Smart Text Overlay
- **Subject-Aware Placement** - Automatically avoids covering main subjects
- **Auto-Contrast** - Adjusts text color for optimal readability
- **Behind Subject Mode** - Place text behind subjects using AI segmentation
- **Full Customization** - Fonts, colors, sizes, and positioning

### 🔍 Real vs AI Image Detection
- **Robust Ensemble** - Uses 4 different Hugging Face models for maximum accuracy
- **High Confidence** - Ensemble prediction with confidence scoring
- **Multiple Architectures** - DiT, ViT, and specialized AI detectors
- **Batch Processing** - Analyze multiple images at once
- **Format Support** - Works with JPG, PNG, WEBP formats

### 🕵️ Photo Morph Detection
- **Advanced Analysis** - Multi-technique approach for detecting morphed/edited images
- **Compression Analysis** - Detects inconsistent JPEG compression artifacts
- **Noise Pattern Analysis** - Identifies noise inconsistencies across image regions
- **Edge Consistency** - Examines edge irregularities and morphing artifacts
- **Lighting Analysis** - Checks for lighting inconsistencies and gradients
- **Color Consistency** - Analyzes color distribution patterns for editing signs
- **Texture Pattern Analysis** - Uses Local Binary Patterns to detect texture irregularities
- **Percentage Results** - Provides detailed percentage breakdown of morph probability

### 🌐 Professional Web Interface
- **Modern React Frontend** - Beautiful, responsive web interface
- **Real-time Preview** - Live image preview with zoom and pan
- **Drag & Drop Upload** - Intuitive file uploading
- **Progress Tracking** - Real-time processing progress
- **Results Management** - Download, share, and manage processed images

## 🤖 Robust AI Models

This project uses multiple robust Hugging Face models for maximum accuracy and reliability:

### AI Detection Models
- **Primary**: `umm-maybe/AI-image-detector` - Specialized AI image detector
- **Secondary**: `Organika/sdxl-detector` - SDXL-specific AI detector
- **Tertiary**: `microsoft/DiT-base-patch16-224` - DiT architecture
- **Quaternary**: `google/vit-base-patch16-224` - Vision Transformer

### Inpainting Models
- **Primary**: `runwayml/stable-diffusion-inpainting` - High-quality inpainting
- **Secondary**: `stabilityai/stable-diffusion-2-inpainting` - Fallback model

### Object Detection Models
- **Nano**: `yolov8n.pt` - Fast detection for real-time use
- **Small**: `yolov8s.pt` - Balanced speed and accuracy
- **Medium**: `yolov8m.pt` - High accuracy for detailed analysis

All models include robust fallback mechanisms and ensemble prediction for maximum reliability.

## 🚀 Quick Start

### Automated Setup (Recommended)
```bash
python setup_project.py
```
This script will automatically:
- Check requirements
- Set up Python virtual environment
- Install all dependencies
- Set up the React frontend
- Download AI models
- Create startup scripts

### Manual Setup

1. **Backend Setup:**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Download robust AI models (multiple models for better accuracy)
python download_models.py

# Test all models to ensure they work
python test_robust_models.py
```

2. **Frontend Setup:**
```bash
cd frontend
npm install
```

## 🎯 Usage

### Start the Application

1. **Start Backend (Terminal 1):**
```bash
# Windows:
start_backend.bat
# macOS/Linux:
./start_backend.sh
# Or manually:
python api_server.py
```

2. **Start Frontend (Terminal 2):**
```bash
# Windows:
start_frontend.bat
# macOS/Linux:
./start_frontend.sh
# Or manually:
cd frontend && npm run dev
```

3. **Open Browser:**
```
http://localhost:3000
```

## 🎮 Using the Web Interface

### Dashboard Features
- **Image Upload** - Drag & drop or click to upload images
- **Tool Selection** - Choose from Smart Crop, Outpaint, Text Overlay, AI Detection, or Complete Pipeline
- **Real-time Settings** - Adjust parameters with live preview
- **Processing Status** - Track progress with detailed status updates
- **Results Panel** - View, download, and manage processed images

### Command Line Interface (Optional)
```bash
# Run comprehensive demo
python main.py --demo

# Process single image
python main.py -i image.jpg -a 16:9 -t "Hello World!"

# Complete pipeline
python main.py -i image.jpg -a 9:16 -t "Social Media Ready!"
```

## Individual Module Usage 🔧

### Smart Cropping
```python
from smart_crop import SmartCropper

cropper = SmartCropper()
result = cropper.smart_crop("image.jpg", "16:9", "output.jpg")

if result['success']:
    print(f"Cropped: {result['original_size']} -> {result['cropped_size']}")
    print(f"Main subject: {result['main_subject']['class_name']}")
```

### Outpainting
```python
from outpaint_image import ImageOutpainter

outpainter = ImageOutpainter()
result = outpainter.outpaint_image("image.jpg", extension_factor=1.5, output_path="extended.jpg")

if result['success']:
    print(f"Extended: {result['original_size']} -> {result['extended_size']}")
```

### Text Overlay
```python
from add_text_overlay import TextOverlayEngine

text_engine = TextOverlayEngine()
result = text_engine.add_text_overlay(
    "image.jpg", 
    "Hello World!",
    style_options={
        'font_size': 60,
        'placement': 'auto',
        'auto_contrast': True
    },
    output_path="with_text.jpg"
)
```

### AI Detection
```python
from ai_image_check import AIImageDetector

detector = AIImageDetector()
result = detector.check_if_image_is_ai("image.jpg")

if result['success']:
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']:.3f}")
```

### Photo Morph Detection
```python
from photo_morph_detector import PhotoMorphDetector

detector = PhotoMorphDetector()
result = detector.detect_morph("image.jpg")

if result['success']:
    print(f"Prediction: {result['prediction']}")
    print(f"Morph Percentage: {result['morph_percentage']}%")
    print(f"Real Percentage: {result['real_percentage']}%")
    print(f"Certainty: {result['certainty']}")

    # Component analysis scores
    for component, score in result['component_scores'].items():
        print(f"{component}: {score:.1f}%")
```

## Configuration ⚙️

### Model Paths
Models are stored in the `models/` directory:
- `models/yolo/` - YOLO object detection
- `models/inpainting/` - Stable Diffusion inpainting
- `models/ai_detector/` - AI image detection

### Customization
Each module accepts various parameters:

**Smart Cropping:**
- `confidence_threshold`: Object detection confidence (default: 0.5)
- `padding_color`: RGB color for padding (default: white)

**Outpainting:**
- `extension_factor`: How much to extend (default: 1.5)
- `num_inference_steps`: Quality vs speed (default: 20)
- `guidance_scale`: How closely to follow prompt (default: 7.5)

**Text Overlay:**
- `font_size`, `font_family`, `font_color`
- `placement`: 'auto', 'center', 'top', 'bottom', etc.
- `behind_subject`: Place text behind detected subjects

## System Requirements 💻

- **Python 3.9+**
- **RAM:** 8GB+ recommended (4GB minimum)
- **Storage:** 5GB for models
- **GPU:** Optional but recommended for faster processing

### GPU Support
The tool automatically detects and uses GPU if available:
- NVIDIA GPU with CUDA support recommended
- Falls back to CPU if no GPU detected

## File Structure 📁

```
smart-image-prep/
├── requirements.txt          # Dependencies
├── download_models.py        # Model download script
├── utils.py                  # Utility functions
├── smart_crop.py            # Smart cropping module
├── outpaint_image.py        # Outpainting module
├── add_text_overlay.py      # Text overlay module
├── ai_image_check.py        # AI detection module
├── main.py                  # Main demo script
├── models/                  # Downloaded models (created automatically)
├── outputs/                 # Generated outputs
└── README.md               # This file
```

## Troubleshooting 🔧

### Common Issues

1. **"Model not found" errors:**
   ```bash
   python download_models.py
   ```

2. **Out of memory errors:**
   - Reduce image size before processing
   - Use CPU instead of GPU for large images
   - Reduce `num_inference_steps` for outpainting

3. **Slow processing:**
   - Ensure GPU is being used (check logs)
   - Reduce image resolution
   - Use smaller models if available

### Performance Tips
- Images are automatically resized for processing efficiency
- GPU processing is 5-10x faster than CPU
- Batch processing is more efficient for multiple images

## Examples 📸

Check the `examples/` directory (created after running demo) for:
- Input images
- Cropped outputs
- Outpainted results
- Text overlay examples
- AI detection results

## Contributing 🤝

Feel free to:
- Report bugs and issues
- Suggest new features
- Submit improvements
- Add support for new models

## License 📄

This project uses various open-source models and libraries. Please check individual model licenses:
- YOLOv8: AGPL-3.0
- Stable Diffusion: CreativeML Open RAIL-M
- Transformers: Apache 2.0

## Acknowledgments 🙏

- **Ultralytics** for YOLOv8
- **Stability AI** for Stable Diffusion
- **Hugging Face** for model hosting and transformers
- **OpenAI** for inspiration from DALL-E outpainting

---

**Happy image preparation! 🎨✨**
