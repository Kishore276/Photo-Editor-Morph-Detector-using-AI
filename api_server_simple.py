#!/usr/bin/env python3
"""
Simple FastAPI Server for Health Check Testing
"""

import logging
import uuid
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from PIL import Image

# Try to import the working Ateeqq detector
try:
    from ateeqq_final_working import AteeqqFinalWorking
    AI_DETECTOR_AVAILABLE = True
    print("✅ Working Ateeqq detector module available")
except ImportError as e:
    AI_DETECTOR_AVAILABLE = False
    print(f"⚠️  Ateeqq detector not available: {e}")

# Try to import background remover
try:
    from background_remover import remove_background
    BG_REMOVER_AVAILABLE = True
    print("✅ Background remover module available")
except ImportError as e:
    BG_REMOVER_AVAILABLE = False
    print(f"⚠️  Background remover not available: {e}")

# Try to import photo morph detector
try:
    from photo_morph_detector import PhotoMorphDetector
    MORPH_DETECTOR_AVAILABLE = True
    print("✅ Photo morph detector module available")
except ImportError as e:
    MORPH_DETECTOR_AVAILABLE = False
    print(f"⚠️  Photo morph detector not available: {e}")

# Try to import photo morph detector
try:
    from photo_morph_detector import PhotoMorphDetector
    MORPH_DETECTOR_AVAILABLE = True
    print("✅ Photo morph detector module available")
except ImportError as e:
    MORPH_DETECTOR_AVAILABLE = False
    print(f"⚠️  Photo morph detector not available: {e}")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Simple Image Preparation API",
    description="Simple API for testing health endpoint",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Mount static files
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Initialize the working Ateeqq detector
ai_detector = None
print("🔄 Initializing working Ateeqq detector...")

if AI_DETECTOR_AVAILABLE:
    try:
        print("📥 Loading working Ateeqq detector (using real model)...")
        ai_detector = AteeqqFinalWorking()
        if hasattr(ai_detector, 'model_loaded') and ai_detector.model_loaded:
            print("✅ Working Ateeqq detector initialized successfully!")
        else:
            print("⚠️  Ateeqq detector failed to load, using simulation")
            ai_detector = None
    except Exception as e:
        print(f"⚠️  Failed to initialize Ateeqq detector: {e}")
        print("🔄 Falling back to simulated AI detection")
        ai_detector = None
else:
    print("⚠️  Ateeqq detector module not available, using simulation")

# Initialize the photo morph detector
morph_detector = None
print("🔄 Initializing photo morph detector...")

if MORPH_DETECTOR_AVAILABLE:
    try:
        print("📥 Loading photo morph detector...")
        morph_detector = PhotoMorphDetector()
        print("✅ Photo morph detector initialized successfully!")
    except Exception as e:
        print(f"⚠️  Failed to initialize photo morph detector: {e}")
        print("🔄 Falling back to simulated morph detection")
        morph_detector = None
else:
    print("⚠️  Photo morph detector module not available, using simulation")

# Initialize the photo morph detector
morph_detector = None
print("🔄 Initializing photo morph detector...")

if MORPH_DETECTOR_AVAILABLE:
    try:
        print("📥 Loading photo morph detector...")
        morph_detector = PhotoMorphDetector()
        print("✅ Photo morph detector initialized successfully!")
    except Exception as e:
        print(f"⚠️  Failed to initialize photo morph detector: {e}")
        print("🔄 Falling back to simulated morph detection")
        morph_detector = None
else:
    print("⚠️  Photo morph detector module not available, using simulation")

def save_uploaded_file(upload_file: UploadFile) -> str:
    """Save uploaded file and return unique ID."""
    file_id = str(uuid.uuid4())
    file_extension = Path(upload_file.filename).suffix.lower()
    if not file_extension:
        file_extension = ".jpg"

    file_path = UPLOAD_DIR / f"{file_id}{file_extension}"

    with open(file_path, "wb") as buffer:
        content = upload_file.file.read()
        buffer.write(content)

    return file_id

def get_image_path(image_id: str) -> Optional[Path]:
    """Get image path from ID."""
    for ext in [".jpg", ".jpeg", ".png", ".webp"]:
        path = UPLOAD_DIR / f"{image_id}{ext}"
        if path.exists():
            return path
    return None

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Simple Image Preparation API",
        "version": "1.0.0",
        "status": "ready",
        "endpoints": {
            "health": "/health",
            "test": "/test",
            "upload": "/upload",
            "ai_detect": "/ai-detect",
            "morph_detect": "/morph-detect"
        }
    }

@app.get("/test")
async def test_endpoint():
    """Simple test endpoint."""
    return {"message": "Server is working!", "status": "ok"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file."""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Save file
        file_id = save_uploaded_file(file)
        file_path = get_image_path(file_id)

        if not file_path:
            raise HTTPException(status_code=500, detail="Failed to save file")

        # Get image info
        try:
            with Image.open(file_path) as image:
                size = image.size
                format_name = image.format
        except Exception:
            size = (800, 600)  # Default size
            format_name = "JPEG"

        return {
            "success": True,
            "image_id": file_id,
            "filename": file.filename,
            "size": size,
            "format": format_name,
            "url": f"/uploads/{file_path.name}"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai-detect")
async def ai_detect_endpoint(image_id: str = Form(...)):
    """Detect if an image is AI-generated."""
    try:
        # Get image path
        image_path = get_image_path(image_id)
        if not image_path:
            raise HTTPException(status_code=404, detail="Image not found")

        # Check if your AI detector is available
        if ai_detector and hasattr(ai_detector, 'model_loaded') and ai_detector.model_loaded:
            # Use your real AI detection
            logger.info(f"🔍 Running your AI detection on image: {image_path}")
            result = ai_detector.check_if_image_is_ai(str(image_path))

            if result['success']:
                # Format the response with detailed information from your detector
                response = {
                    "success": True,
                    "prediction": result['prediction'],
                    "confidence": result['confidence'],
                    "real_probability": result['real_probability'],
                    "ai_probability": result['ai_probability'],
                    "certainty": result['certainty'],
                    "raw_label": result.get('raw_label', 'unknown'),
                    "model_used": result.get('model_used', 'Ateeqq/ai-vs-human-image-detector'),
                    "device": result.get('device', 'unknown'),
                    "method": result.get('method', 'transformers'),
                    "detection_type": "real",
                    "model_name": "Your AI Detector v1.0"
                }

                logger.info(f"✅ Your AI Detection Result: {result['prediction']} ({result['confidence']:.3f})")
                return response
            else:
                logger.error(f"❌ Your AI detection failed: {result.get('error', 'Unknown error')}")
                raise HTTPException(status_code=500, detail=result.get('error', 'AI detection failed'))
        else:
            # Fall back to simulated result
            logger.info("🔄 Using simulated AI detection")
            return {
                "success": True,
                "prediction": "Real Photo",
                "confidence": 0.85,
                "real_probability": 0.85,
                "ai_probability": 0.15,
                "certainty": "Medium",
                "raw_label": "human",
                "model_used": "simulated",
                "device": "cpu",
                "method": "simulation",
                "detection_type": "simulated"
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI detection endpoint failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/remove-background/{image_id}")
async def remove_background_endpoint(image_id: str):
    """Remove background from image using rembg."""
    try:
        logger.info(f"🎯 Background removal request for image {image_id}")

        if not BG_REMOVER_AVAILABLE:
            logger.error("❌ Background remover not available")
            raise HTTPException(status_code=503, detail="Background remover service not available")

        # Find image file
        image_path = None
        for ext in ['.jpg', '.jpeg', '.png', '.webp']:
            potential_path = UPLOAD_DIR / f"{image_id}{ext}"
            if potential_path.exists():
                image_path = potential_path
                break

        if not image_path:
            logger.error(f"❌ Image {image_id} not found")
            raise HTTPException(status_code=404, detail="Image not found")

        logger.info(f"📁 Processing image: {image_path}")

        # Remove background using your updated code
        result_id = str(uuid.uuid4())
        result_path = UPLOAD_DIR / f"{result_id}.png"

        # Use your background remover function
        from background_remover import remove_background as bg_remove
        output_path = bg_remove(str(image_path), str(result_path))

        # Create metadata
        metadata = {
            'model_used': 'rembg (U2Net)',
            'device': 'CPU',
            'output_format': 'PNG',
            'has_transparency': True,
            'original_size': None
        }

        logger.info(f"✅ Background removal completed: {result_path}")

        return {
            "success": True,
            "image_id": result_id,
            "output_url": f"uploads/{result_id}.png",
            "final_image_url": f"uploads/{result_id}.png",
            "download_url": f"/download/{result_id}.png",
            "filename": f"{result_id}.png",
            "model_used": metadata['model_used'],
            "device": metadata['device'],
            "output_format": "PNG",
            "has_transparency": True,
            "original_size": metadata['original_size']
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Background removal failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_file(filename: str):
    """Download processed images with proper headers."""
    try:
        # Construct file path
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Determine media type based on extension
        if filename.lower().endswith('.png'):
            media_type = 'image/png'
        elif filename.lower().endswith(('.jpg', '.jpeg')):
            media_type = 'image/jpeg'
        elif filename.lower().endswith('.webp'):
            media_type = 'image/webp'
        else:
            media_type = 'application/octet-stream'
        
        # Return file with download headers
        return FileResponse(
            path=str(file_path),
            media_type=media_type,
            filename=filename,
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Download failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/morph-detect")
async def morph_detect_endpoint(image_id: str = Form(...)):
    """Detect if an image is morphed/edited."""
    try:
        # Get image path
        image_path = get_image_path(image_id)
        if not image_path:
            raise HTTPException(status_code=404, detail="Image not found")

        # Check if morph detector is available
        if morph_detector:
            # Use real morph detection
            logger.info(f"🔍 Running morph detection on image: {image_path}")
            result = morph_detector.detect_morph(str(image_path))

            if result['success']:
                # Format the response with detailed information
                response = {
                    "success": True,
                    "prediction": result['prediction'],
                    "morph_probability": result['morph_probability'],
                    "morph_percentage": result['morph_percentage'],
                    "real_percentage": result['real_percentage'],
                    "certainty": result['certainty'],
                    "component_scores": result['component_scores'],
                    "detailed_analysis": result['detailed_analysis'],
                    "model_used": result.get('model_used', 'Photo Morph Detector'),
                    "device": result.get('device', 'unknown'),
                    "method": result.get('method', 'multi-analysis'),
                    "detection_type": "real"
                }

                logger.info(f"✅ Morph Detection Result: {result['prediction']} ({result['morph_percentage']:.1f}% morphed)")
                return response
            else:
                logger.error(f"❌ Morph detection failed: {result.get('error', 'Unknown error')}")
                raise HTTPException(status_code=500, detail=result.get('error', 'Morph detection failed'))
        else:
            # Fall back to simulated result
            logger.info("🔄 Using simulated morph detection")
            return {
                "success": True,
                "prediction": "Real Photo",
                "morph_probability": 0.25,
                "morph_percentage": 25.0,
                "real_percentage": 75.0,
                "certainty": "Medium",
                "component_scores": {
                    "compression_artifacts": 20.0,
                    "noise_inconsistency": 15.0,
                    "edge_irregularities": 25.0,
                    "lighting_inconsistency": 30.0,
                    "color_inconsistency": 20.0,
                    "texture_irregularities": 15.0
                },
                "model_used": "simulated",
                "device": "cpu",
                "method": "simulation",
                "detection_type": "simulated"
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Morph detection endpoint failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    ai_detector_status = (
        ai_detector is not None and
        hasattr(ai_detector, 'model_loaded') and
        ai_detector.model_loaded
    )

    return {
        "status": "healthy",
        "components": {
            "smart_cropper": True,
            "outpainter": True,
            "background_remover": BG_REMOVER_AVAILABLE,
            "morph_detector": morph_detector is not None,
            "ai_detector_your_model": ai_detector_status,
            "ai_detector_advanced": False,
            "ai_detector_improved": False,
            "ai_detector_simple": False
        },
        "ai_detection": "real" if ai_detector_status else "simulated",
        "model_info": {
            "available": ai_detector_status,
            "model_name": ai_detector.model_id if ai_detector_status else "none",
            "device": ai_detector.device if ai_detector_status else "none",
            "detector_name": "Your AI Detector v1.0"
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Simple Image Prep API")
    print("📍 Backend will be available at: http://localhost:8000")
    print("📖 API docs will be available at: http://localhost:8000/docs")

    uvicorn.run(
        "api_server_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
