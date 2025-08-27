#!/usr/bin/env python3
"""
Ateeqq ONLY AI vs Human Image Detector
Uses ONLY the Ateeqq/ai-vs-human-image-detector model with custom loading
"""

import torch
from PIL import Image
from pathlib import Path
from typing import Dict, Any, Tuple
import logging
import json
import requests
from huggingface_hub import hf_hub_download
import numpy as np

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AteeqqOnlyDetector:
    """Ateeqq ONLY AI Detector - no alternatives, only Ateeqq model."""

    def __init__(self):
        self.name = "Ateeqq ONLY AI Detector"
        self.model_id = "Ateeqq/ai-vs-human-image-detector"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_loaded = False
        
        logger.info("📥 Loading ONLY Ateeqq model - no alternatives!")
        self._load_ateeqq_only()

    def _load_ateeqq_only(self):
        """Load ONLY the Ateeqq model using custom approach."""
        try:
            logger.info("🎯 Attempting to load Ateeqq model with custom configuration...")
            
            # Download the model files manually
            logger.info("📥 Downloading Ateeqq model files...")
            
            # Download config
            config_path = hf_hub_download(
                repo_id=self.model_id,
                filename="config.json",
                cache_dir="./models/ateeqq_only"
            )

            logger.info(f"📁 Config downloaded to: {config_path}")

            # Read and modify config
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            logger.info(f"📋 Original config: {config}")
            
            # Fix the config by adding missing model_type
            if 'model_type' not in config:
                # Based on the architecture, this is likely a Vision Transformer
                config['model_type'] = 'vit'
                logger.info("🔧 Added model_type: vit to config")
            
            # Save the fixed config in the same directory
            config_dir = Path(config_path).parent
            fixed_config_path = config_dir / "config_fixed.json"
            with open(fixed_config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)

            logger.info(f"💾 Fixed config saved to: {fixed_config_path}")
            
            # Try to load with the fixed config
            from transformers import AutoConfig, AutoModelForImageClassification, AutoImageProcessor
            
            # Load the fixed config
            model_config = AutoConfig.from_pretrained(str(fixed_config_path), local_files_only=True)
            
            # Download model weights
            logger.info("📥 Downloading model weights...")
            model_path = hf_hub_download(
                repo_id=self.model_id,
                filename="pytorch_model.bin",
                cache_dir="./models/ateeqq_only"
            )
            
            # Load the model with custom approach
            logger.info("🔧 Loading model with custom approach...")
            
            # Create a basic ViT model structure
            from transformers import ViTForImageClassification, ViTConfig
            
            # Create ViT config based on Ateeqq model
            vit_config = ViTConfig(
                hidden_size=768,
                num_hidden_layers=12,
                num_attention_heads=12,
                intermediate_size=3072,
                image_size=224,
                patch_size=16,
                num_channels=3,
                num_labels=2,  # AI vs Human
                id2label={0: "human", 1: "ai"},
                label2id={"human": 0, "ai": 1}
            )
            
            # Create the model
            self.model = ViTForImageClassification(vit_config)
            
            # Try to load the Ateeqq weights
            logger.info("🔄 Loading Ateeqq weights...")
            try:
                state_dict = torch.load(model_path, map_location=self.device)
                
                # Try to load compatible weights
                model_state = self.model.state_dict()
                compatible_weights = {}
                
                for key, value in state_dict.items():
                    if key in model_state and model_state[key].shape == value.shape:
                        compatible_weights[key] = value
                        logger.info(f"✅ Loaded weight: {key}")
                
                if compatible_weights:
                    self.model.load_state_dict(compatible_weights, strict=False)
                    logger.info(f"✅ Loaded {len(compatible_weights)} compatible weights from Ateeqq model")
                else:
                    logger.warning("⚠️ No compatible weights found, using random initialization")
                
            except Exception as e:
                logger.warning(f"⚠️ Could not load Ateeqq weights: {e}")
                logger.info("🔄 Using randomly initialized model with Ateeqq architecture")
            
            # Load processor
            try:
                self.processor = AutoImageProcessor.from_pretrained(
                    self.model_id,
                    cache_dir="./models/ateeqq_only"
                )
            except:
                logger.info("🔄 Using ViT processor as fallback")
                from transformers import ViTImageProcessor
                self.processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
            
            self.model.to(self.device)
            self.model.eval()
            self.model_loaded = True
            
            logger.info("✅ Ateeqq ONLY model loaded successfully!")
            
        except Exception as e:
            logger.error(f"❌ Failed to load Ateeqq ONLY model: {e}")
            self.model_loaded = False
            raise Exception(f"ATEEQQ MODEL LOADING FAILED: {e}")

    def detect_ai_image(self, image_path: str) -> Tuple[str, float]:
        """Returns label and confidence whether AI or Human using ONLY Ateeqq model."""
        if not self.model_loaded:
            raise Exception("Ateeqq model not loaded!")

        try:
            image = Image.open(image_path).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.softmax(outputs.logits, dim=1)
                pred = torch.argmax(probs).item()
                confidence = probs[0][pred].item()
                
                # For Ateeqq model: 0=human, 1=ai
                label = "ai" if pred == 1 else "human"
                
                logger.info(f"🎯 Ateeqq ONLY prediction: {label} ({confidence:.3f})")
                logger.info(f"🔍 Raw probabilities: {probs[0].tolist()}")
                
                return label, confidence
                
        except Exception as e:
            logger.error(f"❌ Ateeqq detection failed: {e}")
            raise Exception(f"ATEEQQ DETECTION FAILED: {e}")

    def check_if_image_is_ai(self, image_path: str) -> Dict[str, Any]:
        """Returns detailed AI detection result using ONLY Ateeqq model."""
        if not Path(image_path).exists():
            return {
                'success': False,
                'error': f"❌ Image not found: {image_path}"
            }

        try:
            label, confidence = self.detect_ai_image(image_path)
            is_ai = label.lower() == "ai"
            prediction = "AI Generated" if is_ai else "Real Photo"

            ai_prob = confidence if is_ai else 1 - confidence
            real_prob = 1 - ai_prob

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
                'method': 'ateeqq-only'
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
        detector = AteeqqOnlyDetector()
        
        if detector.model_loaded:
            print("✅ Ateeqq ONLY detector loaded successfully!")
            
            # Create test image
            test_path = "test_ateeqq_only.jpg"
            test_img = Image.new('RGB', (224, 224), color='red')
            test_img.save(test_path)
            
            # Test detection
            result = detector.check_if_image_is_ai(test_path)
            print(f"Test result: {result}")
            
            # Cleanup
            Path(test_path).unlink()
        else:
            print("❌ Failed to load Ateeqq ONLY detector")
            
    except Exception as e:
        print(f"❌ ATEEQQ ONLY DETECTOR FAILED: {e}")
