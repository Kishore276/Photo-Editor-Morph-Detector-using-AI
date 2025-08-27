#!/usr/bin/env python3
"""
Test script for Photo Morph Detector
"""

import requests
import json
from pathlib import Path
from PIL import Image
import numpy as np

def create_test_image():
    """Create a test image for morph detection."""
    # Create a simple test image
    test_img = Image.new('RGB', (512, 512), color='lightblue')
    
    # Add some patterns to make it more realistic
    pixels = np.array(test_img)
    
    # Add some noise
    noise = np.random.randint(0, 50, pixels.shape)
    pixels = np.clip(pixels + noise, 0, 255)
    
    # Add some geometric patterns
    for i in range(0, 512, 50):
        pixels[i:i+5, :] = [100, 150, 200]  # Horizontal lines
        pixels[:, i:i+5] = [150, 100, 200]  # Vertical lines
    
    test_img = Image.fromarray(pixels.astype(np.uint8))
    test_path = "test_morph_image.jpg"
    test_img.save(test_path, quality=85)
    return test_path

def test_morph_detection_api():
    """Test the morph detection API endpoint."""
    print("🧪 Testing Photo Morph Detection API...")
    
    try:
        # Create test image
        test_image_path = create_test_image()
        print(f"✅ Created test image: {test_image_path}")
        
        # Test upload
        with open(test_image_path, 'rb') as f:
            files = {'file': ('test_morph.jpg', f, 'image/jpeg')}
            upload_response = requests.post('http://localhost:8000/upload', files=files)
        
        if upload_response.status_code == 200:
            image_id = upload_response.json()['image_id']
            print(f'✅ Upload successful, image_id: {image_id}')
            
            # Test morph detection
            morph_response = requests.post(
                'http://localhost:8000/morph-detect', 
                data={'image_id': image_id}
            )
            
            print(f'Morph Detection Status: {morph_response.status_code}')
            
            if morph_response.status_code == 200:
                result = morph_response.json()
                print('\n🎯 PHOTO MORPH DETECTION RESULT:')
                print(f'   Prediction: {result["prediction"]}')
                print(f'   Morph Percentage: {result["morph_percentage"]}%')
                print(f'   Real Percentage: {result["real_percentage"]}%')
                print(f'   Certainty: {result["certainty"]}')
                print(f'   Model: {result["model_used"]}')
                print(f'   Method: {result["method"]}')
                print(f'   Detection Type: {result["detection_type"]}')
                
                # Display component scores
                if 'component_scores' in result:
                    print('\n📊 Component Analysis Scores:')
                    for component, score in result['component_scores'].items():
                        print(f'   {component.replace("_", " ").title()}: {score:.1f}%')
                
                # Display detailed analysis if available
                if 'detailed_analysis' in result and result['detection_type'] == 'real':
                    print('\n🔬 Detailed Technical Analysis:')
                    for analysis_type, data in result['detailed_analysis'].items():
                        print(f'   {analysis_type.title()}:')
                        for key, value in data.items():
                            print(f'     {key}: {value:.4f}')
                
                return True
            else:
                print(f'❌ Morph Detection Error: {morph_response.text}')
                return False
        else:
            print(f'❌ Upload failed: {upload_response.text}')
            return False
            
    except Exception as e:
        print(f'❌ Test failed: {e}')
        return False
    finally:
        # Cleanup
        if Path(test_image_path).exists():
            Path(test_image_path).unlink()

def test_morph_detector_directly():
    """Test the morph detector module directly."""
    print("\n🧪 Testing Photo Morph Detector Module Directly...")
    
    try:
        from photo_morph_detector import PhotoMorphDetector
        
        # Create test image
        test_image_path = create_test_image()
        print(f"✅ Created test image: {test_image_path}")
        
        # Initialize detector
        detector = PhotoMorphDetector()
        print("✅ Photo Morph Detector initialized")
        
        # Run detection
        result = detector.detect_morph(test_image_path)
        
        if result['success']:
            print('\n🎯 DIRECT MORPH DETECTION RESULT:')
            print(f'   Prediction: {result["prediction"]}')
            print(f'   Morph Percentage: {result["morph_percentage"]}%')
            print(f'   Real Percentage: {result["real_percentage"]}%')
            print(f'   Certainty: {result["certainty"]}')
            print(f'   Model: {result["model_used"]}')
            print(f'   Method: {result["method"]}')
            
            # Display component scores
            if 'component_scores' in result:
                print('\n📊 Component Analysis Scores:')
                for component, score in result['component_scores'].items():
                    print(f'   {component.replace("_", " ").title()}: {score:.1f}%')
            
            return True
        else:
            print(f'❌ Direct detection failed: {result["error"]}')
            return False
            
    except Exception as e:
        print(f'❌ Direct test failed: {e}')
        return False
    finally:
        # Cleanup
        if Path(test_image_path).exists():
            Path(test_image_path).unlink()

def test_backend_health():
    """Test if backend is running and morph detector is available."""
    print("🏥 Testing Backend Health...")
    
    try:
        response = requests.get('http://localhost:8000/health')
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Backend is healthy")
            print(f"   Morph Detector Available: {health_data['components'].get('morph_detector', False)}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Photo Morph Detector Tests...")
    
    # Test 1: Backend Health
    health_ok = test_backend_health()
    
    # Test 2: Direct Module Test
    direct_ok = test_morph_detector_directly()
    
    # Test 3: API Test (only if backend is healthy)
    api_ok = False
    if health_ok:
        api_ok = test_morph_detection_api()
    else:
        print("⚠️ Skipping API test - backend not available")
    
    # Summary
    print("\n" + "="*50)
    print("📋 TEST SUMMARY")
    print("="*50)
    print(f"Backend Health: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Direct Module: {'✅ PASS' if direct_ok else '❌ FAIL'}")
    print(f"API Endpoint: {'✅ PASS' if api_ok else '❌ FAIL'}")
    
    if all([health_ok, direct_ok, api_ok]):
        print("\n🎉 All tests passed! Photo Morph Detector is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the logs above for details.")
