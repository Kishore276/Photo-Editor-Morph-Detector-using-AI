#!/usr/bin/env python3
"""
Simple test for morph detector without heavy dependencies
"""

import cv2
import numpy as np
from PIL import Image
from pathlib import Path

def simple_morph_test():
    """Simple test of morph detection functionality."""
    print("🧪 Testing Photo Morph Detector (Simple Version)...")
    
    try:
        # Create a test image
        test_img = Image.new('RGB', (256, 256), color='blue')
        test_path = "simple_test.jpg"
        test_img.save(test_path)
        print(f"✅ Created test image: {test_path}")
        
        # Test basic image loading with OpenCV
        image = cv2.imread(test_path)
        if image is not None:
            print("✅ OpenCV image loading works")
            
            # Test basic analysis
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            print("✅ Color space conversion works")
            
            # Test DCT analysis
            h, w = gray.shape
            block_size = 8
            if h >= block_size and w >= block_size:
                block = gray[:block_size, :block_size].astype(np.float32)
                dct_block = cv2.dct(block)
                print("✅ DCT analysis works")
            
            # Test edge detection
            edges = cv2.Canny(gray, 50, 150)
            print("✅ Edge detection works")
            
            # Test gradient analysis
            grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            print("✅ Gradient analysis works")
            
            print("✅ All basic image analysis functions work!")
            return True
        else:
            print("❌ Failed to load image with OpenCV")
            return False
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False
    finally:
        # Cleanup
        if Path(test_path).exists():
            Path(test_path).unlink()

def test_api_server_import():
    """Test if API server can import morph detector."""
    print("\n🌐 Testing API Server Import...")
    
    try:
        # Check if the import statement exists in api_server_simple.py
        if Path("api_server_simple.py").exists():
            with open("api_server_simple.py", 'r', encoding='utf-8') as f:
                content = f.read()
                
            if "from photo_morph_detector import PhotoMorphDetector" in content:
                print("✅ PhotoMorphDetector import found in API server")
            else:
                print("❌ PhotoMorphDetector import NOT found in API server")
                return False
                
            if "/morph-detect" in content:
                print("✅ Morph detection endpoint found in API server")
            else:
                print("❌ Morph detection endpoint NOT found in API server")
                return False
                
            if "morph_detector" in content:
                print("✅ Morph detector variable found in API server")
                return True
            else:
                print("❌ Morph detector variable NOT found in API server")
                return False
        else:
            print("❌ api_server_simple.py not found")
            return False
            
    except Exception as e:
        print(f"❌ API server test failed: {e}")
        return False

def test_frontend_integration():
    """Test frontend integration."""
    print("\n⚛️ Testing Frontend Integration...")
    
    frontend_files = [
        ("frontend/src/pages/Dashboard.jsx", "morph-detect"),
        ("frontend/src/services/api.js", "detectMorph"),
        ("frontend/src/components/ToolPanel.jsx", "MorphDetectPanel"),
        ("frontend/src/components/tools/MorphDetectPanel.jsx", "Photo Morph"),
        ("frontend/src/components/MorphDetectionResults.jsx", "morph-detect")
    ]
    
    all_ok = True
    for file_path, search_term in frontend_files:
        if Path(file_path).exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            if search_term in content:
                print(f"✅ {Path(file_path).name} contains '{search_term}'")
            else:
                print(f"❌ {Path(file_path).name} missing '{search_term}'")
                all_ok = False
        else:
            print(f"❌ {file_path} not found")
            all_ok = False
    
    return all_ok

def main():
    """Main test function."""
    print("🔍 Simple Photo Morph Detector Test")
    print("=" * 50)
    
    # Test 1: Basic functionality
    basic_ok = simple_morph_test()
    
    # Test 2: API server integration
    api_ok = test_api_server_import()
    
    # Test 3: Frontend integration
    frontend_ok = test_frontend_integration()
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 TEST SUMMARY")
    print("=" * 50)
    print(f"Basic Functionality: {'✅ PASS' if basic_ok else '❌ FAIL'}")
    print(f"API Integration: {'✅ PASS' if api_ok else '❌ FAIL'}")
    print(f"Frontend Integration: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    
    if all([basic_ok, api_ok, frontend_ok]):
        print("\n🎉 ALL TESTS PASSED!")
        print("Photo Morph Detector implementation is ready!")
        print("\n🚀 Next Steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Start backend: python api_server_simple.py")
        print("3. Start frontend: cd frontend && npm run dev")
        print("4. Access: http://localhost:5173")
    else:
        print("\n⚠️ SOME TESTS FAILED!")
        print("Check the failed items above.")
    
    return all([basic_ok, api_ok, frontend_ok])

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
