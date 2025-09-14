#!/usr/bin/env python3
"""
Smart Image Preparation Tool - Main Demo Script
Demonstrates all features of the image preparation toolkit.
"""

import logging
import argparse
from pathlib import Path
from typing import Optional

from utils import setup_logging, create_output_directory
from smart_crop import SmartCropper
from outpaint_image import ImageOutpainter
from add_text_overlay import TextOverlayEngine
from ai_image_check import AIImageDetector

logger = logging.getLogger(__name__)

class ImagePreparationTool:
    """Main class that combines all image preparation features."""
    
    def __init__(self):
        """Initialize all components."""
        logger.info("Initializing Smart Image Preparation Tool...")
        
        try:
            self.cropper = SmartCropper()
            self.outpainter = ImageOutpainter()
            self.text_engine = TextOverlayEngine(self.cropper)
            self.ai_detector = AIImageDetector()
            
            logger.info("✅ All components initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Initialization failed: {e}")
            raise
    
    def process_image_complete(self, image_path: str, 
                             target_aspect_ratio: str = "1:1",
                             text_overlay: Optional[str] = None,
                             output_dir: str = "outputs") -> dict:
        """
        Complete image processing pipeline.
        
        Args:
            image_path: Path to input image
            target_aspect_ratio: Target aspect ratio
            text_overlay: Optional text to overlay
            output_dir: Output directory
            
        Returns:
            Dictionary with all results
        """
        try:
            output_path = Path(output_dir)
            output_path.mkdir(parents=True, exist_ok=True)
            
            image_name = Path(image_path).stem
            results = {'input_image': image_path}
            
            # Step 1: AI Detection
            logger.info("🔍 Step 1: Checking if image is AI-generated...")
            ai_result = self.ai_detector.check_if_image_is_ai(image_path)
            results['ai_detection'] = ai_result
            
            if ai_result['success']:
                logger.info(f"   Result: {ai_result['prediction']} (confidence: {ai_result['confidence']:.3f})")
            
            # Step 2: Smart Cropping
            logger.info(f"🎯 Step 2: Smart cropping to {target_aspect_ratio}...")
            crop_output = output_path / f"{image_name}_cropped.jpg"
            crop_result = self.cropper.smart_crop(
                image_path, target_aspect_ratio, str(crop_output)
            )
            results['smart_crop'] = crop_result
            
            if crop_result['success']:
                logger.info(f"   Cropped: {crop_result['original_size']} -> {crop_result['cropped_size']}")
                current_image = str(crop_output)
            else:
                logger.warning("   Cropping failed, using original image")
                current_image = image_path
            
            # Step 3: Outpainting (if needed)
            logger.info("🎨 Step 3: Outpainting for better composition...")
            outpaint_output = output_path / f"{image_name}_outpainted.jpg"
            outpaint_result = self.outpainter.outpaint_image(
                current_image, extension_factor=1.3, output_path=str(outpaint_output)
            )
            results['outpainting'] = outpaint_result
            
            if outpaint_result['success']:
                logger.info(f"   Outpainted: {outpaint_result['original_size']} -> {outpaint_result['extended_size']}")
                current_image = str(outpaint_output)
            
            # Step 4: Text Overlay (if requested)
            if text_overlay:
                logger.info(f"✍️  Step 4: Adding text overlay: '{text_overlay}'...")
                text_output = output_path / f"{image_name}_final.jpg"
                text_result = self.text_engine.add_text_overlay(
                    current_image, text_overlay, 
                    style_options={'placement': 'auto', 'auto_contrast': True},
                    output_path=str(text_output)
                )
                results['text_overlay'] = text_result
                
                if text_result['success']:
                    logger.info(f"   Text added at position: {text_result['text_position']}")
                    current_image = str(text_output)
            
            results['final_image'] = current_image
            results['success'] = True
            
            logger.info(f"🎉 Processing complete! Final image: {current_image}")
            return results
            
        except Exception as e:
            logger.error(f"❌ Complete processing failed: {e}")
            return {'success': False, 'error': str(e)}
    
    def demo_all_features(self, test_image: str):
        """Demonstrate all features with a test image."""
        if not Path(test_image).exists():
            logger.error(f"Test image not found: {test_image}")
            return
        
        logger.info(f"🚀 Starting comprehensive demo with: {test_image}")
        
        # Create output directory
        output_dir = create_output_directory("demo_outputs")
        
        # Demo 1: Smart Cropping
        logger.info("\n" + "="*50)
        logger.info("DEMO 1: Smart Cropping")
        logger.info("="*50)
        
        for ratio in ["1:1", "16:9", "9:16"]:
            output_path = output_dir / f"demo_crop_{ratio.replace(':', '_')}.jpg"
            result = self.cropper.smart_crop(test_image, ratio, str(output_path))
            
            if result['success']:
                logger.info(f"✅ {ratio}: {result['original_size']} -> {result['cropped_size']}")
                if result['main_subject']:
                    logger.info(f"   Main subject: {result['main_subject']['class_name']}")
            else:
                logger.error(f"❌ {ratio}: {result['error']}")
        
        # Demo 2: Outpainting
        logger.info("\n" + "="*50)
        logger.info("DEMO 2: Outpainting")
        logger.info("="*50)
        
        outpaint_tests = [
            {"factor": 1.5, "name": "extend_1.5x"},
            {"aspect": "16:9", "name": "extend_16_9"}
        ]
        
        for test in outpaint_tests:
            output_path = output_dir / f"demo_{test['name']}.jpg"
            
            if "factor" in test:
                result = self.outpainter.outpaint_image(
                    test_image, extension_factor=test["factor"], output_path=str(output_path)
                )
            else:
                result = self.outpainter.extend_to_aspect_ratio(
                    test_image, test["aspect"], output_path=str(output_path)
                )
            
            if result['success']:
                logger.info(f"✅ {test['name']}: {result['original_size']} -> {result['extended_size']}")
            else:
                logger.error(f"❌ {test['name']}: {result['error']}")
        
        # Demo 3: Text Overlay
        logger.info("\n" + "="*50)
        logger.info("DEMO 3: Text Overlay")
        logger.info("="*50)
        
        text_tests = [
            {"text": "Hello World!", "style": {"placement": "center"}, "name": "center"},
            {"text": "Smart Text", "style": {"placement": "auto", "auto_contrast": True}, "name": "auto"},
            {"text": "Behind Subject", "style": {"behind_subject": True, "opacity": 128}, "name": "behind"}
        ]
        
        for test in text_tests:
            output_path = output_dir / f"demo_text_{test['name']}.jpg"
            result = self.text_engine.add_text_overlay(
                test_image, test["text"], test["style"], str(output_path)
            )
            
            if result['success']:
                logger.info(f"✅ {test['name']}: Text '{test['text']}' at {result['text_position']}")
            else:
                logger.error(f"❌ {test['name']}: {result['error']}")
        
        # Demo 4: AI Detection
        logger.info("\n" + "="*50)
        logger.info("DEMO 4: AI Detection")
        logger.info("="*50)
        
        result = self.ai_detector.check_if_image_is_ai(test_image)
        
        if result['success']:
            logger.info(f"✅ Prediction: {result['prediction']}")
            logger.info(f"   Confidence: {result['confidence']:.3f}")
            logger.info(f"   Real probability: {result['real_probability']:.3f}")
            logger.info(f"   AI probability: {result['ai_probability']:.3f}")
        else:
            logger.error(f"❌ AI detection failed: {result['error']}")
        
        # Demo 5: Complete Pipeline
        logger.info("\n" + "="*50)
        logger.info("DEMO 5: Complete Pipeline")
        logger.info("="*50)
        
        pipeline_result = self.process_image_complete(
            test_image, 
            target_aspect_ratio="16:9",
            text_overlay="Social Media Ready!",
            output_dir=str(output_dir / "pipeline")
        )
        
        if pipeline_result['success']:
            logger.info(f"✅ Complete pipeline successful!")
            logger.info(f"   Final image: {pipeline_result['final_image']}")
        else:
            logger.error(f"❌ Pipeline failed: {pipeline_result['error']}")
        
        logger.info(f"\n🎉 Demo complete! Check outputs in: {output_dir}")

def main():
    """Main function with command line interface."""
    parser = argparse.ArgumentParser(description="Smart Image Preparation Tool")
    parser.add_argument("--image", "-i", type=str, help="Input image path")
    parser.add_argument("--aspect", "-a", type=str, default="1:1", help="Target aspect ratio")
    parser.add_argument("--text", "-t", type=str, help="Text overlay")
    parser.add_argument("--output", "-o", type=str, default="outputs", help="Output directory")
    parser.add_argument("--demo", action="store_true", help="Run comprehensive demo")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose logging")
    
    args = parser.parse_args()
    
    # Setup logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    setup_logging(log_level)
    
    try:
        # Initialize tool
        tool = ImagePreparationTool()
        
        if args.demo:
            # Run demo
            test_image = args.image or "test_image.jpg"
            tool.demo_all_features(test_image)
        
        elif args.image:
            # Process single image
            result = tool.process_image_complete(
                args.image, 
                args.aspect, 
                args.text, 
                args.output
            )
            
            if result['success']:
                logger.info(f"✅ Processing successful: {result['final_image']}")
            else:
                logger.error(f"❌ Processing failed: {result['error']}")
        
        else:
            # Show help
            parser.print_help()
            logger.info("\nExample usage:")
            logger.info("  python main.py --demo")
            logger.info("  python main.py -i image.jpg -a 16:9 -t 'Hello World!'")
    
    except KeyboardInterrupt:
        logger.info("Process interrupted by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()
