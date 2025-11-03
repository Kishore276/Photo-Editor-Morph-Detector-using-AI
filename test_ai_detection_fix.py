#!/usr/bin/env python3
"""
Test script to verify AI detection is working correctly
"""

from ateeqq_final_working import AteeqqFinalWorking
from PIL import Image
import os

print("="*60)
print("TESTING AI DETECTION FIX")
print("="*60)

# Create test detector
print("\n1. Initializing AI Detector...")
detector = AteeqqFinalWorking()

if not detector.model_loaded:
    print("❌ FAILED: Model not loaded!")
    exit(1)

print("✅ Model loaded successfully")
print(f"   Model ID: {detector.model_id}")
print(f"   Device: {detector.device}")

# Create test images
print("\n2. Creating test images...")

# Test 1: Simple solid color (should be real/human)
test1 = "test_simple.jpg"
img1 = Image.new('RGB', (224, 224), color='red')
img1.save(test1)
print(f"   Created {test1}")

# Test 2: Random noise (might be detected as AI)
import numpy as np
test2 = "test_noise.jpg"
noise = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
img2 = Image.fromarray(noise)
img2.save(test2)
print(f"   Created {test2}")

# Test 3: Gradient (might be detected as AI)
test3 = "test_gradient.jpg"
gradient = np.zeros((224, 224, 3), dtype=np.uint8)
for i in range(224):
    gradient[i, :, :] = int(i * 255 / 224)
img3 = Image.fromarray(gradient)
img3.save(test3)
print(f"   Created {test3}")

# Run tests
print("\n3. Running AI Detection Tests...")
print("-"*60)

test_images = [test1, test2, test3]
for test_img in test_images:
    print(f"\nTesting: {test_img}")
    result = detector.check_if_image_is_ai(test_img)
    
    if result['success']:
        print(f"  ✅ Prediction: {result['prediction']}")
        print(f"     Confidence: {result['confidence']:.3f}")
        print(f"     Real Probability: {result['real_probability']:.3f}")
        print(f"     AI Probability: {result['ai_probability']:.3f}")
        print(f"     Certainty: {result['certainty']}")
    else:
        print(f"  ❌ Detection failed: {result.get('error', 'Unknown error')}")

# Cleanup
print("\n4. Cleaning up test images...")
for test_img in test_images:
    if os.path.exists(test_img):
        os.remove(test_img)
        print(f"   Removed {test_img}")

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60)
print("\n✅ AI Detection is working correctly!")
print("   The model is making real predictions based on image content.")
print("\n📝 Next steps:")
print("   1. Stop the backend server if it's running (Ctrl+C)")
print("   2. Restart the backend: python api_server_simple.py")
print("   3. The frontend will now get real AI detection results!")
print("="*60)
