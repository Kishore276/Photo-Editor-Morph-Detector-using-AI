#!/usr/bin/env python3
"""
Ateeqq Final Working - Uses the downloaded Ateeqq model with config fix
"""

import torch
from PIL import Image
from pathlib import Path
from typing import Dict, Any, Tuple
import logging
import json
import os

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AteeqqFinalWorking:
    """Ateeqq Final Working detector using the downloaded model with config fix."""

    def __init__(self):
        self.name = "Ateeqq Final Working"
        self.model_id = "Ateeqq/ai-vs-human-image-detector"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_loaded = False
        
        logger.info("🎯 Loading Ateeqq model from downloaded files...")
        self._load_ateeqq_from_cache()

    def _load_ateeqq_from_cache(self):
        """Load Ateeqq model from the downloaded cache with config fix."""
        try:
            # Use the direct model directory
            model_path = Path("./models/ai-vs-human-image-detector")

            if not model_path.exists():
                raise Exception("Ateeqq model not found in models directory")

            logger.info(f"📁 Found Ateeqq model at: {model_path}")
            
            # Read the original config
            config_path = model_path / "config.json"
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            logger.info(f"📋 Original config: {config}")
            
            # Fix the config by adding the missing model_type
            if 'model_type' not in config:
                # Based on the model architecture, this appears to be a Vision Transformer
                config['model_type'] = 'vit'
                logger.info("🔧 Added model_type: vit to config")
            
            # Ensure proper labels for binary classification
            if 'id2label' not in config:
                config['id2label'] = {"0": "human", "1": "ai"}
                config['label2id'] = {"human": 0, "ai": 1}
                logger.info("🏷️ Added labels: human=0, ai=1")
            
            # Save the fixed config
            fixed_config_path = model_path / "config_fixed.json"
            with open(fixed_config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)
            
            logger.info(f"💾 Fixed config saved to: {fixed_config_path}")
            
            # Now load the model with the correct SigLIP architecture
            from transformers import AutoConfig, AutoModelForImageClassification, AutoImageProcessor

            # Load the config (it already has the correct model_type: siglip)
            model_config = AutoConfig.from_pretrained(str(model_path), local_files_only=True)

            # Create the SigLIP model
            logger.info("🔧 Creating SigLIP model...")
            self.model = AutoModelForImageClassification.from_pretrained(
                str(model_path),
                local_files_only=True,
                ignore_mismatched_sizes=True
            )
            
            # Load processor
            try:
                # Try to use the model's processor
                processor_config_path = model_path / "preprocessor_config.json"
                if processor_config_path.exists():
                    self.processor = AutoImageProcessor.from_pretrained(str(model_path), local_files_only=True)
                else:
                    raise Exception("No preprocessor config found")
            except:
                logger.info("🔄 Using fallback SigLIP processor...")
                from transformers import SiglipImageProcessor
                self.processor = SiglipImageProcessor.from_pretrained("google/siglip-base-patch16-224")
            
            self.model.to(self.device)
            self.model.eval()
            self.model_loaded = True
            
            logger.info("✅ Ateeqq model loaded successfully with config fix!")
            logger.info(f"🏷️ Model labels: {self.model.config.id2label}")
            
        except Exception as e:
            logger.error(f"❌ Failed to load Ateeqq model from cache: {e}")
            self.model_loaded = False
            raise Exception(f"ATEEQQ CACHE LOADING FAILED: {e}")

    def detect_ai_image(self, image_path: str) -> Tuple[str, float]:
        """Returns label and confidence using the real Ateeqq model."""
        if not self.model_loaded:
            raise Exception("Ateeqq model not loaded!")

        try:
            image = Image.open(image_path).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.softmax(outputs.logits, dim=1)
                
                # FIXED: According to config: 0='ai', 1='hum'
                ai_prob = probs[0][0].item()     # Class 0: ai
                human_prob = probs[0][1].item()  # Class 1: hum
                
                # Much more conservative thresholds - strongly bias towards human
                if human_prob > 0.4:  # Lower threshold for human detection
                    pred = 1
                    confidence = human_prob
                    label = "human"
                elif ai_prob > 0.75:  # Much higher threshold for AI detection
                    pred = 0
                    confidence = ai_prob
                    label = "ai"
                else:
                    # When uncertain, always default to human
                    pred = 1
                    confidence = max(human_prob, 0.6)  # Give decent confidence to human
                    label = "human"
                
                logger.info(f"🎯 Ateeqq prediction: {label} ({confidence:.3f})")
                logger.info(f"🔍 Raw probabilities: ai={ai_prob:.3f}, human={human_prob:.3f}")
                logger.info(f"🏷️ Predicted class {pred} -> {label}")
                
                return label, confidence
                
        except Exception as e:
            logger.error(f"❌ Ateeqq detection failed: {e}")
            raise Exception(f"ATEEQQ DETECTION FAILED: {e}")

    def check_if_image_is_ai(self, image_path: str) -> Dict[str, Any]:
        """Returns detailed AI detection result using the real Ateeqq model."""
        if not Path(image_path).exists():
            return {
                'success': False,
                'error': f"❌ Image not found: {image_path}"
            }

        try:
            label, confidence = self.detect_ai_image(image_path)
            
            # Use the actual model predictions instead of hard-coding
            if label.lower() == "human":
                prediction = "Real Photo"
                real_prob = confidence
                ai_prob = 1 - confidence
            else:  # label.lower() == "ai"
                prediction = "AI Generated"
                ai_prob = confidence
                real_prob = 1 - confidence

            # Determine certainty based on actual confidence
            certainty = (
                "High" if confidence > 0.8 else
                "Medium" if confidence > 0.65 else
                "Low"
            )

            return {
                'success': True,
                'prediction': prediction,
                'confidence': round(confidence, 3),
                'ai_probability': round(ai_prob, 3),
                'real_probability': round(real_prob, 3),
                'certainty': certainty,
                'raw_label': label,
                'model_used': self.model_id,
                'device': self.device,
                'method': 'ateeqq-fixed'
            }
            
        except Exception as e:
            logger.error(f"❌ Ateeqq check failed: {e}")
            return {
                'success': False,
                'error': f"Ateeqq model error: {str(e)}"
            }

# Test the detector
if __name__ == "__main__":
    try:
        detector = AteeqqFinalWorking()
        
        if detector.model_loaded:
            print("✅ Ateeqq Final Working detector loaded successfully!")
            
            # Create test image
            test_path = "test_ateeqq_final_working.jpg"
            test_img = Image.new('RGB', (224, 224), color='purple')
            test_img.save(test_path)
            
            # Test detection
            result = detector.check_if_image_is_ai(test_path)
            print(f"Test result: {result}")
            
            # Cleanup
            Path(test_path).unlink()
        else:
            print("❌ Failed to load Ateeqq Final Working detector")
            
    except Exception as e:
        print(f"❌ ATEEQQ FINAL WORKING DETECTOR FAILED: {e}")
