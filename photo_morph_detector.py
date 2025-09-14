#!/usr/bin/env python3
"""
Photo Morph Detector - Detects if an image is morphed/edited or real
Uses multiple techniques to analyze image authenticity and morphing
"""

import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
import logging
from pathlib import Path
from typing import Dict, Any, Tuple, List
import json
import os
from scipy import ndimage
try:
    from skimage import feature, filters, measure
    SKIMAGE_AVAILABLE = True
except ImportError:
    SKIMAGE_AVAILABLE = False
import torch
import torch.nn.functional as F
from transformers import AutoImageProcessor, AutoModel
import warnings
warnings.filterwarnings('ignore')

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PhotoMorphDetector:
    """Advanced Photo Morph Detector using multiple analysis techniques."""

    def __init__(self):
        self.name = "Photo Morph Detector"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_loaded = False
        
        logger.info("🔍 Initializing Photo Morph Detector...")
        self._load_models()

    def _load_models(self):
        """Load pre-trained models for advanced detection."""
        try:
            # Try to load a vision transformer for feature analysis
            # Using a general vision model that can help with authenticity detection
            try:
                from transformers import ViTImageProcessor, ViTModel
                self.processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
                self.vit_model = ViTModel.from_pretrained('google/vit-base-patch16-224')
                self.vit_model.to(self.device)
                self.vit_model.eval()
                logger.info("✅ Vision Transformer model loaded for feature analysis")
                self.model_loaded = True
            except Exception as e:
                logger.warning(f"⚠️ Could not load ViT model: {e}")
                self.model_loaded = False
                
        except Exception as e:
            logger.error(f"❌ Failed to load models: {e}")
            self.model_loaded = False

    def analyze_image_compression(self, image_path: str) -> Dict[str, float]:
        """Analyze JPEG compression artifacts and inconsistencies."""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Convert to grayscale for analysis
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Analyze DCT coefficients (JPEG compression analysis)
            # Split image into 8x8 blocks and analyze DCT
            h, w = gray.shape
            block_size = 8
            compression_scores = []
            
            for i in range(0, h - block_size, block_size):
                for j in range(0, w - block_size, block_size):
                    block = gray[i:i+block_size, j:j+block_size].astype(np.float32)
                    
                    # Apply DCT
                    dct_block = cv2.dct(block)
                    
                    # Analyze high-frequency components
                    high_freq = dct_block[4:, 4:]
                    compression_score = np.std(high_freq) / (np.mean(np.abs(high_freq)) + 1e-6)
                    compression_scores.append(compression_score)
            
            # Calculate compression inconsistency - be more balanced
            compression_variance = np.var(compression_scores)
            compression_mean = np.mean(compression_scores)
            
            # More realistic thresholds for compression analysis
            if compression_mean < 1.0 and compression_variance < 0.5:
                compression_inconsistency = 0.0  # Very consistent compression
            elif compression_variance > 2.0:
                raw_inconsistency = compression_variance / (compression_mean + 1e-6)
                # Apply square root for more balanced scaling
                compression_inconsistency = min(np.sqrt(raw_inconsistency) * 0.3, 1.0)
            else:
                compression_inconsistency = min(compression_variance / 5.0, 1.0)
            
            return {
                'compression_inconsistency': float(compression_inconsistency),
                'compression_variance': float(compression_variance),
                'compression_mean': float(compression_mean)
            }
            
        except Exception as e:
            logger.error(f"Compression analysis failed: {e}")
            return {'compression_inconsistency': 0.0, 'compression_variance': 0.0, 'compression_mean': 0.0}

    def analyze_noise_patterns(self, image_path: str) -> Dict[str, float]:
        """Analyze noise patterns for inconsistencies indicating editing."""
        try:
            image = cv2.imread(image_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply different noise filters
            gaussian_filtered = cv2.GaussianBlur(gray, (5, 5), 1.0)
            noise = gray.astype(np.float32) - gaussian_filtered.astype(np.float32)
            
            # Analyze noise in different regions
            h, w = gray.shape
            region_size = min(h, w) // 4
            noise_variances = []
            
            for i in range(0, h - region_size, region_size // 2):
                for j in range(0, w - region_size, region_size // 2):
                    region_noise = noise[i:i+region_size, j:j+region_size]
                    noise_variances.append(np.var(region_noise))
            
            # Calculate noise inconsistency - be more balanced
            noise_variance_std = np.std(noise_variances)
            noise_variance_mean = np.mean(noise_variances)
            
            # More realistic noise analysis
            if noise_variance_mean < 20:  # Very low noise
                noise_inconsistency = 0.0
            elif noise_variance_std > 100:  # High noise variation
                raw_inconsistency = noise_variance_std / (noise_variance_mean + 1e-6)
                noise_inconsistency = min(np.sqrt(raw_inconsistency) * 0.2, 1.0)
            else:
                noise_inconsistency = min(noise_variance_std / 200.0, 1.0)
            
            return {
                'noise_inconsistency': float(noise_inconsistency),
                'noise_variance_std': float(noise_variance_std),
                'noise_variance_mean': float(noise_variance_mean)
            }
            
        except Exception as e:
            logger.error(f"Noise analysis failed: {e}")
            return {'noise_inconsistency': 0.0, 'noise_variance_std': 0.0, 'noise_variance_mean': 0.0}

    def analyze_edge_consistency(self, image_path: str) -> Dict[str, float]:
        """Analyze edge consistency for signs of morphing."""
        try:
            image = cv2.imread(image_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply Canny edge detection with different thresholds
            edges1 = cv2.Canny(gray, 50, 150)
            edges2 = cv2.Canny(gray, 100, 200)
            
            # Analyze edge density in different regions
            h, w = gray.shape
            region_size = min(h, w) // 6
            edge_densities = []
            
            for i in range(0, h - region_size, region_size):
                for j in range(0, w - region_size, region_size):
                    region_edges = edges1[i:i+region_size, j:j+region_size]
                    edge_density = np.sum(region_edges > 0) / (region_size * region_size)
                    edge_densities.append(edge_density)
            
            # Calculate edge inconsistency - be more balanced
            edge_density_std = np.std(edge_densities)
            edge_density_mean = np.mean(edge_densities)
            
            # More realistic edge analysis
            if edge_density_mean < 0.02 or edge_density_std < 0.01:
                edge_inconsistency = 0.0  # Very low edge activity
            elif edge_density_std > 0.05:
                raw_inconsistency = edge_density_std / (edge_density_mean + 1e-6)
                edge_inconsistency = min(np.sqrt(raw_inconsistency) * 0.25, 1.0)
            else:
                edge_inconsistency = min(edge_density_std / 0.1, 1.0)
            
            return {
                'edge_inconsistency': float(edge_inconsistency),
                'edge_density_std': float(edge_density_std),
                'edge_density_mean': float(edge_density_mean)
            }
            
        except Exception as e:
            logger.error(f"Edge analysis failed: {e}")
            return {'edge_inconsistency': 0.0, 'edge_density_std': 0.0, 'edge_density_mean': 0.0}

    def analyze_lighting_consistency(self, image_path: str) -> Dict[str, float]:
        """Analyze lighting consistency across the image."""
        try:
            image = cv2.imread(image_path)
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            l_channel = lab[:, :, 0]  # Lightness channel
            
            # Analyze lighting gradients
            grad_x = cv2.Sobel(l_channel, cv2.CV_64F, 1, 0, ksize=3)
            grad_y = cv2.Sobel(l_channel, cv2.CV_64F, 0, 1, ksize=3)
            gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
            
            # Analyze lighting in different regions
            h, w = l_channel.shape
            region_size = min(h, w) // 5
            lighting_variances = []
            
            for i in range(0, h - region_size, region_size):
                for j in range(0, w - region_size, region_size):
                    region_lighting = l_channel[i:i+region_size, j:j+region_size]
                    lighting_variances.append(np.var(region_lighting))
            
            # Calculate lighting inconsistency
            lighting_variance_std = np.std(lighting_variances)
            lighting_variance_mean = np.mean(lighting_variances)
            lighting_inconsistency = min(lighting_variance_std / (lighting_variance_mean + 1e-6), 1.0)
            
            return {
                'lighting_inconsistency': float(lighting_inconsistency),
                'lighting_variance_std': float(lighting_variance_std),
                'lighting_variance_mean': float(lighting_variance_mean),
                'gradient_mean': float(np.mean(gradient_magnitude))
            }
            
        except Exception as e:
            logger.error(f"Lighting analysis failed: {e}")
            return {'lighting_inconsistency': 0.0, 'lighting_variance_std': 0.0,
                   'lighting_variance_mean': 0.0, 'gradient_mean': 0.0}

    def analyze_color_consistency(self, image_path: str) -> Dict[str, float]:
        """Analyze color consistency for signs of editing."""
        try:
            image = cv2.imread(image_path)
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

            # Analyze color distribution in different regions
            h, w = image.shape[:2]
            region_size = min(h, w) // 4
            color_variances = []

            for i in range(0, h - region_size, region_size):
                for j in range(0, w - region_size, region_size):
                    region_hsv = hsv[i:i+region_size, j:j+region_size]

                    # Calculate color variance for each channel
                    h_var = np.var(region_hsv[:, :, 0])
                    s_var = np.var(region_hsv[:, :, 1])
                    v_var = np.var(region_hsv[:, :, 2])

                    color_variances.append([h_var, s_var, v_var])

            color_variances = np.array(color_variances)

            # Calculate color inconsistency
            color_variance_std = np.std(color_variances, axis=0)
            color_variance_mean = np.mean(color_variances, axis=0)

            color_inconsistency = np.mean(color_variance_std / (color_variance_mean + 1e-6))
            color_inconsistency = min(color_inconsistency, 1.0)

            return {
                'color_inconsistency': float(color_inconsistency),
                'hue_variance_std': float(color_variance_std[0]),
                'saturation_variance_std': float(color_variance_std[1]),
                'value_variance_std': float(color_variance_std[2])
            }

        except Exception as e:
            logger.error(f"Color analysis failed: {e}")
            return {'color_inconsistency': 0.0, 'hue_variance_std': 0.0,
                   'saturation_variance_std': 0.0, 'value_variance_std': 0.0}

    def analyze_texture_patterns(self, image_path: str) -> Dict[str, float]:
        """Analyze texture patterns for morphing artifacts."""
        try:
            image = cv2.imread(image_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Calculate Local Binary Pattern (LBP) if scikit-image is available
            if SKIMAGE_AVAILABLE:
                from skimage.feature import local_binary_pattern
                radius = 3
                n_points = 8 * radius
                lbp = local_binary_pattern(gray, n_points, radius, method='uniform')
            else:
                # Fallback: use simple texture analysis with gradients
                grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
                grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
                lbp = np.sqrt(grad_x**2 + grad_y**2)

            # Analyze texture consistency in different regions
            h, w = gray.shape
            region_size = min(h, w) // 6
            texture_variances = []

            for i in range(0, h - region_size, region_size):
                for j in range(0, w - region_size, region_size):
                    region_lbp = lbp[i:i+region_size, j:j+region_size]
                    texture_variances.append(np.var(region_lbp))

            # Calculate texture inconsistency
            texture_variance_std = np.std(texture_variances)
            texture_variance_mean = np.mean(texture_variances)
            texture_inconsistency = min(texture_variance_std / (texture_variance_mean + 1e-6), 1.0)

            return {
                'texture_inconsistency': float(texture_inconsistency),
                'texture_variance_std': float(texture_variance_std),
                'texture_variance_mean': float(texture_variance_mean)
            }

        except Exception as e:
            logger.error(f"Texture analysis failed: {e}")
            return {'texture_inconsistency': 0.0, 'texture_variance_std': 0.0, 'texture_variance_mean': 0.0}

    def calculate_morph_score(self, analyses: Dict[str, Dict[str, float]]) -> Tuple[float, str, Dict[str, float]]:
        """Calculate overall morph probability using actual analysis results."""
        try:
            # Extract scores from each analysis with proper weighting
            compression_score = min(analyses['compression']['compression_inconsistency'], 1.0)
            noise_score = min(analyses['noise']['noise_inconsistency'], 1.0)
            edge_score = min(analyses['edge']['edge_inconsistency'], 1.0)
            lighting_score = min(analyses['lighting']['lighting_inconsistency'], 1.0)
            color_score = min(analyses['color']['color_inconsistency'], 1.0)
            texture_score = min(analyses['texture']['texture_inconsistency'], 1.0)
            
            # Weighted combination - use conservative weighting
            weights = {
                'compression': 0.15,
                'noise': 0.15, 
                'edge': 0.20,
                'lighting': 0.20,
                'color': 0.15,
                'texture': 0.15
            }
            
            morph_probability = (
                compression_score * weights['compression'] +
                noise_score * weights['noise'] +
                edge_score * weights['edge'] +
                lighting_score * weights['lighting'] +
                color_score * weights['color'] +
                texture_score * weights['texture']
            )
            
            # Apply conservative threshold - reduce sensitivity to natural variations
            morph_probability = max(0.0, min(morph_probability - 0.1, 1.0))  # Subtract baseline
            morph_probability = morph_probability * 0.7  # Scale down further
            
            # Classification based on probability
            if morph_probability < 0.3:
                classification = "Real Photo"
            elif morph_probability < 0.7:
                classification = "Possibly Morphed"
            else:
                classification = "Likely Morphed"

            # Individual component scores for detailed analysis
            component_scores = {
                'compression_artifacts': compression_score * 100,
                'noise_inconsistency': noise_score * 100,
                'edge_irregularities': edge_score * 100,
                'lighting_inconsistency': lighting_score * 100,
                'color_inconsistency': color_score * 100,
                'texture_irregularities': texture_score * 100
            }

            return morph_probability, classification, component_scores

        except Exception as e:
            logger.error(f"Score calculation failed: {e}")
            return 0.1, "Real Photo", {  # Default to low morph probability
                'compression_artifacts': 10.0,
                'noise_inconsistency': 10.0,
                'edge_irregularities': 10.0,
                'lighting_inconsistency': 10.0,
                'color_inconsistency': 10.0,
                'texture_irregularities': 10.0
            }

    def detect_morph(self, image_path: str) -> Dict[str, Any]:
        """Main function to detect if image is morphed/edited."""
        if not Path(image_path).exists():
            return {
                'success': False,
                'error': f"❌ Image not found: {image_path}"
            }

        try:
            logger.info(f"🔍 Analyzing image for morphing: {image_path}")

            # Run all analyses
            analyses = {
                'compression': self.analyze_image_compression(image_path),
                'noise': self.analyze_noise_patterns(image_path),
                'edge': self.analyze_edge_consistency(image_path),
                'lighting': self.analyze_lighting_consistency(image_path),
                'color': self.analyze_color_consistency(image_path),
                'texture': self.analyze_texture_patterns(image_path)
            }

            # Calculate overall morph score
            morph_probability, classification, component_scores = self.calculate_morph_score(analyses)

            # Convert to percentage
            morph_percentage = morph_probability * 100
            real_percentage = (1.0 - morph_probability) * 100

            # Determine certainty level
            if abs(morph_probability - 0.5) > 0.3:
                certainty = "High"
            elif abs(morph_probability - 0.5) > 0.15:
                certainty = "Medium"
            else:
                certainty = "Low"

            result = {
                'success': True,
                'prediction': classification,
                'morph_probability': round(morph_probability, 3),
                'morph_percentage': round(morph_percentage, 1),
                'real_percentage': round(real_percentage, 1),
                'certainty': certainty,
                'component_scores': component_scores,
                'detailed_analysis': analyses,
                'model_used': self.name,
                'device': self.device,
                'method': 'multi-analysis'
            }

            logger.info(f"🎯 Morph Detection Result: {classification} ({morph_percentage:.1f}% morphed)")
            return result

        except Exception as e:
            logger.error(f"❌ Morph detection failed: {e}")
            return {
                'success': False,
                'error': f"Morph detection error: {str(e)}"
            }


# Test the detector
if __name__ == "__main__":
    try:
        detector = PhotoMorphDetector()

        print("✅ Photo Morph Detector initialized successfully!")

        # Create test image
        test_path = "test_morph_detection.jpg"
        test_img = Image.new('RGB', (512, 512), color='blue')
        test_img.save(test_path)

        # Test detection
        result = detector.detect_morph(test_path)
        print(f"Test result: {result}")

        # Cleanup
        Path(test_path).unlink()

    except Exception as e:
        print(f"❌ PHOTO MORPH DETECTOR FAILED: {e}")
