#!/usr/bin/env python3
"""
Test with realistic photo vs AI-like images
"""

from ateeqq_final_working import AteeqqFinalWorking
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os

print("="*60)
print("TESTING REAL vs AI DETECTION")
print("="*60)

detector = AteeqqFinalWorking()

# Test 1: Photo-like image with natural texture
print("\n1. Creating realistic photo-like image (with noise/texture)...")
test1 = "test_photo_realistic.jpg"
img = Image.new('RGB', (512, 512), color=(135, 206, 235))  # Sky blue
pixels = np.array(img)
# Add camera noise
noise = np.random.normal(0, 5, pixels.shape)
pixels = np.clip(pixels + noise, 0, 255).astype(np.uint8)
img = Image.fromarray(pixels)
# Add some texture
draw = ImageDraw.Draw(img)
for i in range(100):
    x, y = np.random.randint(0, 512, 2)
    color = tuple(np.random.randint(100, 200, 3).tolist())
    draw.ellipse([x, y, x+20, y+20], fill=color)
img = img.filter(ImageFilter.GaussianBlur(2))
img.save(test1, quality=85)  # Save with realistic JPEG quality

# Test 2: Very smooth AI-like image
print("2. Creating AI-like smooth image (perfect gradients)...")
test2 = "test_ai_like.jpg"
img2 = Image.new('RGB', (512, 512))
pixels = np.zeros((512, 512, 3), dtype=np.uint8)
for i in range(512):
    for j in range(512):
        pixels[i, j] = [int(i*255/512), int(j*255/512), 128]
img2 = Image.fromarray(pixels)
img2.save(test2, quality=100)  # Perfect quality

# Test 3: Natural photo simulation
print("3. Creating natural scene simulation...")
test3 = "test_natural.jpg"
img3 = Image.new('RGB', (512, 512))
draw = ImageDraw.Draw(img3)
# Sky
draw.rectangle([0, 0, 512, 256], fill=(135, 206, 250))
# Ground
draw.rectangle([0, 256, 512, 512], fill=(34, 139, 34))
# Add some random elements
for i in range(50):
    x = np.random.randint(0, 512)
    y = np.random.randint(256, 512)
    size = np.random.randint(10, 30)
    draw.ellipse([x, y, x+size, y+size], fill=(139, 69, 19))
# Add camera artifacts
pixels = np.array(img3)
noise = np.random.normal(0, 3, pixels.shape)
pixels = np.clip(pixels + noise, 0, 255).astype(np.uint8)
img3 = Image.fromarray(pixels)
img3.save(test3, quality=92)

# Run tests
print("\n" + "="*60)
print("DETECTION RESULTS")
print("="*60)

tests = [
    (test1, "Photo-realistic with texture"),
    (test2, "AI-like smooth gradient"),
    (test3, "Natural scene simulation")
]

for test_img, description in tests:
    print(f"\n{description} ({test_img}):")
    print("-"*60)
    result = detector.check_if_image_is_ai(test_img)
    
    if result['success']:
        print(f"  Prediction: {result['prediction']}")
        print(f"  AI Probability: {result['ai_probability']:.1%}")
        print(f"  Real Probability: {result['real_probability']:.1%}")
        print(f"  Confidence: {result['confidence']:.3f}")
        print(f"  Certainty: {result['certainty']}")
        
        # Interpretation
        if result['ai_probability'] > 0.85:
            print(f"  ⚠️  STRONG AI SIGNAL - Very likely AI-generated")
        elif result['ai_probability'] > 0.5:
            print(f"  ⚠️  MODERATE AI SIGNAL - Possibly AI-enhanced")
        else:
            print(f"  ✅ AUTHENTIC - Appears to be real photo")
    
    # Clean up
    os.remove(test_img)

print("\n" + "="*60)
print("✅ All tests complete!")
print("="*60)
