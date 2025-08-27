#!/usr/bin/env python3
"""Test Real Ateeqq AI Detection"""

import requests

def test_real_ateeqq():
    """Test the real Ateeqq AI detection."""
    
    # Test upload and AI detection with real Ateeqq model
    try:
        with open('test_upload.jpg', 'rb') as f:
            files = {'file': ('test.jpg', f, 'image/jpeg')}
            upload_response = requests.post('http://localhost:8000/upload', files=files)
            
        if upload_response.status_code == 200:
            image_id = upload_response.json()['image_id']
            print(f'✅ Upload successful, image_id: {image_id}')
            
            # Test AI detection with real Ateeqq model
            ai_response = requests.post('http://localhost:8000/ai-detect', data={'image_id': image_id})
            print(f'AI Detection Status: {ai_response.status_code}')
            if ai_response.status_code == 200:
                result = ai_response.json()
                print('🎯 REAL ATEEQQ AI Detection Result:')
                print(f'   Prediction: {result["prediction"]}')
                print(f'   Confidence: {result["confidence"]}')
                print(f'   AI Probability: {result["ai_probability"]}')
                print(f'   Real Probability: {result["real_probability"]}')
                print(f'   Certainty: {result["certainty"]}')
                print(f'   Model: {result["model_used"]}')
                print(f'   Method: {result["method"]}')
                print(f'   Raw Label: {result["raw_label"]}')
                return True
            else:
                print(f'AI Detection Error: {ai_response.text}')
                return False
        else:
            print(f'Upload failed: {upload_response.text}')
            return False
            
    except Exception as e:
        print(f'Test failed: {e}')
        return False

if __name__ == "__main__":
    print("🧪 Testing Real Ateeqq AI Detection...")
    success = test_real_ateeqq()
    if success:
        print("✅ Real Ateeqq AI Detection test passed!")
    else:
        print("❌ Real Ateeqq AI Detection test failed!")
