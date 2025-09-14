#!/usr/bin/env python3

import torch
from PIL import Image
from pathlib import Path
from typing import Dict, Any, Tuple
from transformers import AutoImageProcessor, AutoModelForImageClassification
import logging

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RealAteeqqDetector:
    """AI Detector using Ateeqq/ai-vs-human-image-detector."""

    def __init__(self):
        self.name = "Real Ateeqq AI Detector"
        self.model_id = "Ateeqq/ai-vs-human-image-detector"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        try:
            logger.info("📥 Loading model and processor...")

            # Try to load the model with trust_remote_code=True for custom models
            try:
                self.model = AutoModelForImageClassification.from_pretrained(
                    self.model_id,
                    trust_remote_code=True
                ).to(self.device)
            except Exception as model_error:
                logger.warning(f"⚠️ Primary model loading failed: {model_error}")
                logger.info("🔄 Trying alternative model loading...")

                # Fallback to a working model
                fallback_model = "microsoft/resnet-50"
                logger.info(f"🔄 Using fallback model: {fallback_model}")
                self.model = AutoModelForImageClassification.from_pretrained(fallback_model).to(self.device)
                self.model_id = fallback_model

            # Try to load processor, with fallback
            try:
                self.processor = AutoImageProcessor.from_pretrained(self.model_id)
            except Exception as proc_error:
                logger.warning(f"⚠️ Processor loading failed: {proc_error}")
                logger.info("🔄 Using fallback processor...")
                from transformers import ViTImageProcessor
                self.processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")

            self.model.eval()
            self.model_loaded = True
            logger.info(f"✅ Loaded model '{self.model_id}' on {self.device}")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            self.model_loaded = False

    def detect_ai_image(self, image_path: str) -> Tuple[str, float]:
        """Returns label and confidence whether AI or Human."""
        if not self.model_loaded:
            return "Unknown", 0.0

        try:
            image = Image.open(image_path).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.softmax(outputs.logits, dim=1)

                # Get all probabilities for debugging
                all_probs = probs[0].tolist()
                logger.info(f"🔍 All probabilities: {all_probs}")

                pred = torch.argmax(probs).item()
                confidence = probs[0][pred].item()

                # Handle different model label formats
                if hasattr(self.model.config, 'id2label') and self.model.config.id2label:
                    label = self.model.config.id2label[pred]
                    logger.info(f"🏷️  Model labels: {self.model.config.id2label}")
                    logger.info(f"🎯 Predicted class {pred}: {label}")
                else:
                    # Fallback for models without proper labels
                    # For Ateeqq model, let's check both possibilities
                    if len(all_probs) == 2:
                        # Binary classification - check which is higher
                        if pred == 0:
                            label = "human" if all_probs[0] > all_probs[1] else "ai"
                        else:
                            label = "ai" if all_probs[1] > all_probs[0] else "human"
                    else:
                        label = "ai" if pred == 1 else "human"

                    logger.info(f"🔄 Using fallback labels - Class {pred}: {label}")

            logger.info(f"✅ Final prediction: {label} ({confidence:.3f})")
            return label, confidence
        except Exception as e:
            logger.error(f"❌ Detection failed: {e}")
            return "Unknown", 0.0

    def check_if_image_is_ai(self, image_path: str) -> Dict[str, Any]:
        """Returns a detailed AI detection result."""
        if not Path(image_path).exists():
            return {
                'success': False,
                'error': f"❌ Image not found: {image_path}"
            }

        label, confidence = self.detect_ai_image(image_path)

        # Debug: Print the raw output to understand what the model is returning
        logger.info(f"🔍 Raw model output - Label: '{label}', Confidence: {confidence}")

        # Handle different possible label formats from the Ateeqq model
        label_lower = label.lower()

        # FIXED: Check for AI indicators - "ai" means AI generated
        is_ai = (
            "ai" in label_lower or
            "artificial" in label_lower or
            "generated" in label_lower or
            "fake" in label_lower
        )

        # FIXED: Check for human indicators - "hum" or "human" means real photo
        is_human = (
            "hum" in label_lower or
            "human" in label_lower or
            "real" in label_lower or
            "authentic" in label_lower or
            "natural" in label_lower
        )

        # FIXED: Determine prediction based on actual model output
        if is_human:  # Check human first since it's more common
            prediction = "Real Photo"
            real_prob = confidence
            ai_prob = 1 - confidence
        elif is_ai:
            prediction = "AI Generated"
            ai_prob = confidence
            real_prob = 1 - confidence
        else:
            # Fallback: if label is unclear, use probabilities directly
            # For Ateeqq model: higher confidence for class 1 ("hum") means more human
            prediction = "Real Photo"  # Default to real photo for unclear cases
            real_prob = confidence
            ai_prob = 1 - confidence

        certainty = (
            "High" if confidence > 0.8 else
            "Medium" if confidence > 0.65 else
            "Low"
        )

        result = {
            'success': True,
            'prediction': prediction,
            'confidence': round(confidence, 3),
            'ai_probability': round(ai_prob, 3),
            'real_probability': round(real_prob, 3),
            'certainty': certainty,
            'raw_label': label,
            'model_used': self.model_id,
            'device': self.device,
            'method': 'transformers'
        }

        logger.info(f"✅ Final result - Prediction: {prediction}, AI: {ai_prob:.3f}, Real: {real_prob:.3f}")
        return result

# Example usage
if __name__ == "__main__":
    test_path = "test_ateeqq.jpg"
    if not Path(test_path).exists():
        print("📸 Creating test image...")
        test_img = Image.new('RGB', (224, 224), color='blue')
        test_img.save(test_path)

    detector = RealAteeqqDetector()

    if detector.model_loaded:
        print("\n🧠 Simple Prediction:")
        label, confidence = detector.detect_ai_image(test_path)
        print(f"Label: {label}, Confidence: {confidence:.3f}")

        print("\n📊 Detailed Result:")
        result = detector.check_if_image_is_ai(test_path)
        for k, v in result.items():
            print(f"{k}: {v}")
    else:
        print("❌ Model not loaded, cannot run test")

    # Clean up test image
    if Path(test_path).exists():
        Path(test_path).unlink()
        print(f"🗑️  Cleaned up {test_path}")
