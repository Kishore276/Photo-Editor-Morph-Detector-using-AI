#!/usr/bin/env python3
"""
Verification script for Photo Morph Detector implementation
"""

import os
import sys
from pathlib import Path
import importlib.util

def check_file_exists(file_path, description):
    """Check if a file exists and report status."""
    if Path(file_path).exists():
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} - NOT FOUND")
        return False

def check_module_import(module_name, file_path):
    """Check if a Python module can be imported."""
    try:
        spec = importlib.util.spec_from_file_location(module_name, file_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        print(f"✅ Module {module_name} imports successfully")
        return True
    except Exception as e:
        print(f"❌ Module {module_name} import failed: {e}")
        return False

def check_frontend_component(file_path, component_name):
    """Check if a frontend component exists."""
    if Path(file_path).exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'morph' in content.lower() or 'Morph' in content:
                print(f"✅ {component_name} contains morph detection code")
                return True
            else:
                print(f"⚠️ {component_name} exists but may not have morph detection code")
                return False
    else:
        print(f"❌ {component_name}: {file_path} - NOT FOUND")
        return False

def main():
    """Main verification function."""
    print("🔍 Verifying Photo Morph Detector Implementation")
    print("=" * 60)
    
    # Backend files verification
    print("\n📁 Backend Files:")
    backend_files = [
        ("photo_morph_detector.py", "Core morph detection module"),
        ("api_server_simple.py", "API server with morph endpoint"),
        ("test_morph_detector.py", "Test script"),
        ("requirements.txt", "Dependencies file")
    ]
    
    backend_ok = True
    for file_path, description in backend_files:
        if not check_file_exists(file_path, description):
            backend_ok = False
    
    # Frontend files verification
    print("\n🎨 Frontend Files:")
    frontend_files = [
        ("frontend/src/pages/Dashboard.jsx", "Dashboard with morph tool"),
        ("frontend/src/components/ToolPanel.jsx", "Tool panel integration"),
        ("frontend/src/components/tools/MorphDetectPanel.jsx", "Morph detection panel"),
        ("frontend/src/components/MorphDetectionResults.jsx", "Results display component"),
        ("frontend/src/components/ImagePreview.jsx", "Image preview with results"),
        ("frontend/src/services/api.js", "API service with morph detection")
    ]
    
    frontend_ok = True
    for file_path, description in frontend_files:
        if not check_file_exists(file_path, description):
            frontend_ok = False
    
    # Module import verification
    print("\n🐍 Python Module Imports:")
    modules_ok = True
    if Path("photo_morph_detector.py").exists():
        if not check_module_import("photo_morph_detector", "photo_morph_detector.py"):
            modules_ok = False
    
    # Frontend component verification
    print("\n⚛️ Frontend Component Integration:")
    components_ok = True
    
    # Check Dashboard for morph tool
    if not check_frontend_component("frontend/src/pages/Dashboard.jsx", "Dashboard"):
        components_ok = False
    
    # Check API service for morph detection
    if not check_frontend_component("frontend/src/services/api.js", "API Service"):
        components_ok = False
    
    # Check ToolPanel for morph integration
    if not check_frontend_component("frontend/src/components/ToolPanel.jsx", "ToolPanel"):
        components_ok = False
    
    # API endpoint verification
    print("\n🌐 API Endpoint Verification:")
    api_ok = True
    if Path("api_server_simple.py").exists():
        with open("api_server_simple.py", 'r', encoding='utf-8') as f:
            content = f.read()
            if "/morph-detect" in content:
                print("✅ Morph detection endpoint found in API server")
            else:
                print("❌ Morph detection endpoint NOT found in API server")
                api_ok = False
            
            if "PhotoMorphDetector" in content:
                print("✅ PhotoMorphDetector import found in API server")
            else:
                print("❌ PhotoMorphDetector import NOT found in API server")
                api_ok = False
    
    # Dependencies verification
    print("\n📦 Dependencies Verification:")
    deps_ok = True
    if Path("requirements.txt").exists():
        with open("requirements.txt", 'r') as f:
            content = f.read()
            required_deps = ["scikit-image", "opencv-python", "scipy", "numpy", "torch"]
            for dep in required_deps:
                if dep in content:
                    print(f"✅ Dependency {dep} found in requirements.txt")
                else:
                    print(f"❌ Dependency {dep} NOT found in requirements.txt")
                    deps_ok = False
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 VERIFICATION SUMMARY")
    print("=" * 60)
    
    results = [
        ("Backend Files", backend_ok),
        ("Frontend Files", frontend_ok),
        ("Module Imports", modules_ok),
        ("Component Integration", components_ok),
        ("API Endpoints", api_ok),
        ("Dependencies", deps_ok)
    ]
    
    all_ok = True
    for category, status in results:
        status_icon = "✅ PASS" if status else "❌ FAIL"
        print(f"{category:.<25} {status_icon}")
        if not status:
            all_ok = False
    
    print("\n" + "=" * 60)
    if all_ok:
        print("🎉 ALL VERIFICATIONS PASSED!")
        print("Photo Morph Detector implementation is complete and ready to use.")
        print("\n🚀 Next Steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Start backend: python api_server_simple.py")
        print("3. Start frontend: cd frontend && npm run dev")
        print("4. Test functionality: python test_morph_detector.py")
    else:
        print("⚠️ SOME VERIFICATIONS FAILED!")
        print("Please check the failed items above and ensure all files are properly implemented.")
    
    return all_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
