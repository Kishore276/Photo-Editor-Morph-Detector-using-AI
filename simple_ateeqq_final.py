#!/usr/bin/env python3
"""
Simple Ateeqq Final - Direct approach to use ONLY Ateeqq model
"""

import torch
from PIL import Image
from pathlib import Path
from typing import Dict, Any, Tuple
import logging

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleAteeqqFinal:
    """Simple final approach to use ONLY Ateeqq model."""

    def __init__(self):
        self.name = "Simple Ateeqq Final"
        self.model_id = "Ateeqq/ai-vs-human-image-detector"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_loaded = False
        
        logger.info("🎯 Loading ONLY Ateeqq model with direct approach...")
        self._load_ateeqq_direct()

    def _load_ateeqq_direct(self):
        """Load Ateeqq model with direct transformers approach."""
        try:
            from transformers import AutoImageProcessor, AutoModelForImageClassification
            
            logger.info("📥 Downloading Ateeqq model directly...")
            
            # Method 1: Try direct loading with trust_remote_code
            try:
                logger.info("🔄 Method 1: Direct loading with trust_remote_code...")
                self.model = AutoModelForImageClassification.from_pretrained(
                    self.model_id,
                    trust_remote_code=True,
                    ignore_mismatched_sizes=True
                )
                self.processor = AutoImageProcessor.from_pretrained(
                    self.model_id,
                    trust_remote_code=True
                )
                self.model.to(self.device)
                self.model.eval()
                self.model_loaded = True
                logger.info("✅ Method 1 successful - Ateeqq model loaded!")
                return
                
            except Exception as e1:
                logger.warning(f"⚠️ Method 1 failed: {e1}")
            
            # Method 2: Try with pipeline
            try:
                logger.info("🔄 Method 2: Pipeline approach...")
                from transformers import pipeline
                
                self.classifier = pipeline(
                    "image-classification",
                    model=self.model_id,
                    trust_remote_code=True,
                    device=0 if torch.cuda.is_available() else -1
                )
                self.model_loaded = True
                self.use_pipeline = True
                logger.info("✅ Method 2 successful - Ateeqq pipeline loaded!")
                return
                
            except Exception as e2:
                logger.warning(f"⚠️ Method 2 failed: {e2}")
            
            # Method 3: Force download and manual loading
            try:
                logger.info("🔄 Method 3: Force download...")
                from huggingface_hub import snapshot_download
                
                # Download the entire model
                model_path = snapshot_download(
                    repo_id=self.model_id,
                    cache_dir="./models/ateeqq_final"
                )
                
                logger.info(f"📁 Model downloaded to: {model_path}")
                
                # Try to load from local path
                self.model = AutoModelForImageClassification.from_pretrained(
                    model_path,
                    local_files_only=True,
                    trust_remote_code=True
                )
                
                try:
                    self.processor = AutoImageProcessor.from_pretrained(
                        model_path,
                        local_files_only=True
                    )
                except:
                    from transformers import ViTImageProcessor
                    self.processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
                
                self.model.to(self.device)
                self.model.eval()
                self.model_loaded = True
                self.use_pipeline = False
                logger.info("✅ Method 3 successful - Ateeqq model loaded from local!")
                return
                
            except Exception as e3:
                logger.warning(f"⚠️ Method 3 failed: {e3}")
            
            # If all methods fail
            raise Exception("All Ateeqq loading methods failed")
            
        except Exception as e:
            logger.error(f"❌ Failed to load Ateeqq model: {e}")
            self.model_loaded = False
            raise Exception(f"ATEEQQ MODEL LOADING FAILED: {e}")

    def detect_ai_image(self, image_path: str) -> Tuple[str, float]:
        """Returns label and confidence using ONLY Ateeqq model."""
        if not self.model_loaded:
            raise Exception("Ateeqq model not loaded!")

        try:
            image = Image.open(image_path).convert("RGB")
            
            if hasattr(self, 'use_pipeline') and self.use_pipeline:
                # Use pipeline approach
                predictions = self.classifier(image)
                
                # Process pipeline results
                for pred in predictions:
                    label = pred['label'].lower()
                    score = pred['score']
                    
                    if 'ai' in label or 'artificial' in label or 'fake' in label:
                        logger.info(f"🎯 Ateeqq pipeline: ai ({score:.3f})")
                        return "ai", score
                    elif 'human' in label or 'real' in label or 'authentic' in label:
                        logger.info(f"🎯 Ateeqq pipeline: human ({score:.3f})")
                        return "human", score
                
                # Fallback: use first prediction
                best_pred = predictions[0]
                label = "ai" if "ai" in best_pred['label'].lower() else "human"
                logger.info(f"🎯 Ateeqq pipeline fallback: {label} ({best_pred['score']:.3f})")
                return label, best_pred['score']
                
            else:
                # Use direct model approach
                inputs = self.processor(images=image, return_tensors="pt").to(self.device)
                
                with torch.no_grad():
                    outputs = self.model(**inputs)
                    probs = torch.softmax(outputs.logits, dim=1)
                    pred = torch.argmax(probs).item()
                    confidence = probs[0][pred].item()
                    
                    # Check if model has labels
                    if hasattr(self.model.config, 'id2label') and self.model.config.id2label:
                        label = self.model.config.id2label[pred].lower()
                        logger.info(f"🏷️ Model labels: {self.model.config.id2label}")
                    else:
                        # Assume binary: 0=human, 1=ai
                        label = "ai" if pred == 1 else "human"
                    
                    logger.info(f"🎯 Ateeqq direct: {label} ({confidence:.3f})")
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
                'method': 'ateeqq-final'
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
        detector = SimpleAteeqqFinal()
        
        if detector.model_loaded:
            print("✅ Ateeqq FINAL detector loaded successfully!")
            
            # Create test image
            test_path = "test_ateeqq_final.jpg"
            test_img = Image.new('RGB', (224, 224), color='green')
            test_img.save(test_path)
            
            # Test detection
            result = detector.check_if_image_is_ai(test_path)
            print(f"Test result: {result}")
            
            # Cleanup
            Path(test_path).unlink()
        else:
            print("❌ Failed to load Ateeqq FINAL detector")
            
    except Exception as e:
        print(f"❌ ATEEQQ FINAL DETECTOR FAILED: {e}")
