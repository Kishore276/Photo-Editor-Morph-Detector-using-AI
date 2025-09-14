#!/usr/bin/env python3
"""
Utility functions for the Smart Image Preparation Tool
"""

import os
import logging
from pathlib import Path
from typing import Tuple, Optional, Union
import numpy as np
from PIL import Image
import cv2

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_logging(level=logging.INFO):
    """Setup logging configuration."""
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def load_image(image_path: Union[str, Path]) -> Optional[Image.Image]:
    """
    Load an image from file path with error handling.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        PIL Image object or None if failed
    """
    try:
        image_path = Path(image_path)
        if not image_path.exists():
            logger.error(f"Image file not found: {image_path}")
            return None
            
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        logger.info(f"Loaded image: {image_path} ({image.size})")
        return image
        
    except Exception as e:
        logger.error(f"Failed to load image {image_path}: {e}")
        return None

def save_image(image: Image.Image, output_path: Union[str, Path], quality: int = 95) -> bool:
    """
    Save PIL Image to file with error handling.
    
    Args:
        image: PIL Image object
        output_path: Path to save the image
        quality: JPEG quality (1-100)
        
    Returns:
        True if successful, False otherwise
    """
    try:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Determine format from extension
        ext = output_path.suffix.lower()
        if ext in ['.jpg', '.jpeg']:
            image.save(output_path, 'JPEG', quality=quality)
        elif ext == '.png':
            image.save(output_path, 'PNG')
        elif ext == '.webp':
            image.save(output_path, 'WEBP', quality=quality)
        else:
            # Default to PNG
            image.save(output_path, 'PNG')
            
        logger.info(f"Saved image: {output_path}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to save image {output_path}: {e}")
        return False

def calculate_aspect_ratio(width: int, height: int) -> float:
    """Calculate aspect ratio from width and height."""
    return width / height

def parse_aspect_ratio(aspect_str: str) -> float:
    """
    Parse aspect ratio string to float.
    
    Args:
        aspect_str: String like "16:9", "1:1", "9:16"
        
    Returns:
        Aspect ratio as float
    """
    try:
        if ':' in aspect_str:
            w, h = map(float, aspect_str.split(':'))
            return w / h
        else:
            return float(aspect_str)
    except:
        logger.error(f"Invalid aspect ratio format: {aspect_str}")
        return 1.0  # Default to square

def get_crop_dimensions(image_size: Tuple[int, int], target_aspect: float) -> Tuple[int, int, int, int]:
    """
    Calculate crop dimensions to achieve target aspect ratio.
    
    Args:
        image_size: (width, height) of original image
        target_aspect: Target aspect ratio (width/height)
        
    Returns:
        (left, top, right, bottom) crop coordinates
    """
    width, height = image_size
    current_aspect = width / height
    
    if current_aspect > target_aspect:
        # Image is wider than target, crop width
        new_width = int(height * target_aspect)
        left = (width - new_width) // 2
        top = 0
        right = left + new_width
        bottom = height
    else:
        # Image is taller than target, crop height
        new_height = int(width / target_aspect)
        left = 0
        top = (height - new_height) // 2
        right = width
        bottom = top + new_height
    
    return (left, top, right, bottom)

def resize_image_maintain_aspect(image: Image.Image, max_size: int = 1024) -> Image.Image:
    """
    Resize image while maintaining aspect ratio.
    
    Args:
        image: PIL Image object
        max_size: Maximum dimension size
        
    Returns:
        Resized PIL Image
    """
    width, height = image.size
    
    if max(width, height) <= max_size:
        return image
    
    if width > height:
        new_width = max_size
        new_height = int(height * max_size / width)
    else:
        new_height = max_size
        new_width = int(width * max_size / height)
    
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)

def create_output_directory(base_path: Union[str, Path] = "outputs") -> Path:
    """Create output directory if it doesn't exist."""
    output_dir = Path(base_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir

def validate_image_format(image_path: Union[str, Path]) -> bool:
    """
    Validate if the file is a supported image format.
    
    Args:
        image_path: Path to image file
        
    Returns:
        True if supported format, False otherwise
    """
    supported_formats = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'}
    ext = Path(image_path).suffix.lower()
    return ext in supported_formats

def pil_to_cv2(pil_image: Image.Image) -> np.ndarray:
    """Convert PIL Image to OpenCV format."""
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

def cv2_to_pil(cv2_image: np.ndarray) -> Image.Image:
    """Convert OpenCV image to PIL format."""
    return Image.fromarray(cv2.cvtColor(cv2_image, cv2.COLOR_BGR2RGB))

def get_image_info(image: Image.Image) -> dict:
    """Get comprehensive image information."""
    return {
        'size': image.size,
        'mode': image.mode,
        'format': image.format,
        'aspect_ratio': image.size[0] / image.size[1]
    }
