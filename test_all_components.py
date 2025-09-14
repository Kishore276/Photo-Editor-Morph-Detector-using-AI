#!/usr/bin/env python3
"""
Comprehensive test for all fixed components
"""

import logging
from PIL import Image
from pathlib import Path
import json

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_ai_detector():
    """Test the fixed AI detector."""
    try:
        logger.info("🧪 Testing AI Detector...")
        from ai_detector import RealAteeqqDetector
        
        detector = RealAteeqqDetector()
        if not detector.model_loaded:
            raise Exception("AI detector failed to load")
        
        # Create test image
        test_path = "test_ai_real.jpg"
        test_img = Image.new('RGB', (224, 224), color='green')
        test_img.save(test_path)
        
        # Test detection
        result = detector.check_if_image_is_ai(test_path)
        logger.info(f"AI Detection result: {result['prediction']} ({result['confidence']:.3f})")
        
        # Cleanup
        Path(test_path).unlink()
        
        assert result['success'], "AI detection failed"
        assert result['prediction'] in ['Real Photo', 'AI Generated'], "Invalid prediction"
        logger.info("✅ AI Detector test passed!")
        return True
        
    except Exception as e:
        logger.error(f"❌ AI Detector test failed: {e}")
        return False

def test_ateeqq_detector():
    """Test the fixed Ateeqq detector."""
    try:
        logger.info("🧪 Testing Ateeqq Detector...")
        from ateeqq_final_working import AteeqqFinalWorking
        
        detector = AteeqqFinalWorking()
        if not detector.model_loaded:
            raise Exception("Ateeqq detector failed to load")
        
        # Create test image
        test_path = "test_ateeqq_real.jpg"
        test_img = Image.new('RGB', (224, 224), color='red')
        test_img.save(test_path)
        
        # Test detection
        result = detector.check_if_image_is_ai(test_path)
        logger.info(f"Ateeqq Detection result: {result['prediction']} ({result['confidence']:.3f})")
        
        # Cleanup
        Path(test_path).unlink()
        
        assert result['success'], "Ateeqq detection failed"
        assert result['prediction'] in ['Real Photo', 'AI Generated'], "Invalid prediction"
        logger.info("✅ Ateeqq Detector test passed!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Ateeqq Detector test failed: {e}")
        return False

def test_morph_detector():
    """Test the fixed morph detector."""
    try:
        logger.info("🧪 Testing Morph Detector...")
        from photo_morph_detector import PhotoMorphDetector
        
        detector = PhotoMorphDetector()
        
        # Create test image
        test_path = "test_morph_real.jpg"
        test_img = Image.new('RGB', (512, 512), color='blue')
        test_img.save(test_path)
        
        # Test detection
        result = detector.detect_morph(test_path)
        logger.info(f"Morph Detection result: {result['prediction']} ({result['morph_percentage']:.1f}% morphed)")
        
        # Cleanup
        Path(test_path).unlink()
        
        assert result['success'], "Morph detection failed"
        assert 'component_scores' in result, "Missing component scores"
        logger.info("✅ Morph Detector test passed!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Morph Detector test failed: {e}")
        return False

def test_background_remover():
    """Test the fixed background remover."""
    try:
        logger.info("🧪 Testing Background Remover...")
        from background_remover import remove_background
        
        # Create test image
        test_input = "test_bg_input.jpg"
        test_output = "test_bg_output.png"
        test_img = Image.new('RGB', (256, 256), color='yellow')
        test_img.save(test_input)
        
        # Test background removal
        result_path = remove_background(test_input, test_output)
        
        # Check if output exists
        assert Path(result_path).exists(), "Output image not created"
        
        # Check if output is PNG with transparency
        output_img = Image.open(result_path)
        assert output_img.mode == 'RGBA', "Output should have transparency"
        output_img.close()  # Close the image before cleanup
        
        # Cleanup
        for file in [test_input, test_output]:
            if Path(file).exists():
                Path(file).unlink()
        
        logger.info("✅ Background Remover test passed!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Background Remover test failed: {e}")
        return False

def main():
    """Run all component tests."""
    logger.info("🚀 Running comprehensive component tests...")
    
    tests = [
        ("AI Detector", test_ai_detector),
        ("Ateeqq Detector", test_ateeqq_detector),
        ("Morph Detector", test_morph_detector),
        ("Background Remover", test_background_remover)
    ]
    
    results = {}
    for test_name, test_func in tests:
        logger.info(f"\n{'='*50}")
        logger.info(f"Testing {test_name}")
        logger.info('='*50)
        results[test_name] = test_func()
    
    logger.info(f"\n{'='*50}")
    logger.info("TEST SUMMARY")
    logger.info('='*50)
    
    passed = 0
    total = len(tests)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        logger.info(f"{test_name}: {status}")
        if result:
            passed += 1
    
    logger.info(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("🎉 ALL TESTS PASSED! The project is now working correctly.")
    else:
        logger.error(f"❌ {total - passed} tests failed. Please check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
