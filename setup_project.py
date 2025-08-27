#!/usr/bin/env python3
"""
Smart Image Preparation Tool - Complete Setup Script
Automates the setup process for both backend and frontend.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def print_header(text):
    """Print a formatted header."""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def print_step(step, description):
    """Print a formatted step."""
    print(f"\n🔧 Step {step}: {description}")
    print("-" * 40)

def run_command(command, cwd=None, check=True):
    """Run a command and handle errors."""
    try:
        print(f"Running: {command}")
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd, 
            check=check,
            capture_output=True,
            text=True
        )
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stderr:
            print(f"Error details: {e.stderr}")
        return False

def check_requirements():
    """Check if required software is installed."""
    print_step(1, "Checking Requirements")
    
    requirements = {
        'python': 'python --version',
        'node': 'node --version',
        'npm': 'npm --version'
    }
    
    missing = []
    
    for name, command in requirements.items():
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                version = result.stdout.strip()
                print(f"✅ {name}: {version}")
            else:
                missing.append(name)
        except:
            missing.append(name)
    
    if missing:
        print(f"\n❌ Missing requirements: {', '.join(missing)}")
        print("\nPlease install the following:")
        for req in missing:
            if req == 'python':
                print("  - Python 3.9+ from https://python.org")
            elif req == 'node':
                print("  - Node.js 16+ from https://nodejs.org")
            elif req == 'npm':
                print("  - npm (comes with Node.js)")
        return False
    
    print("\n✅ All requirements satisfied!")
    return True

def setup_backend():
    """Setup the Python backend."""
    print_step(2, "Setting up Python Backend")
    
    # Create virtual environment
    print("Creating virtual environment...")
    if not run_command("python -m venv venv"):
        return False
    
    # Activate virtual environment
    if platform.system() == "Windows":
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
    else:
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    # Install requirements
    print("Installing Python dependencies...")
    if not run_command(f"{pip_cmd} install -r requirements.txt"):
        print("⚠️  Some packages might have failed to install.")
        print("You may need to install them manually or check your Python environment.")
    
    print("✅ Backend setup complete!")
    return True

def setup_frontend():
    """Setup the React frontend."""
    print_step(3, "Setting up React Frontend")
    
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    # Install npm dependencies
    print("Installing Node.js dependencies...")
    if not run_command("npm install", cwd=frontend_dir):
        print("❌ Failed to install frontend dependencies")
        return False
    
    print("✅ Frontend setup complete!")
    return True

def download_models():
    """Download AI models."""
    print_step(4, "Downloading AI Models")
    
    print("This will download ~3-5GB of AI models...")
    response = input("Continue? (y/N): ").lower().strip()
    
    if response != 'y':
        print("⚠️  Skipping model download. You can run this later with:")
        print("   python download_models.py")
        return True
    
    # Use the appropriate Python executable
    if platform.system() == "Windows":
        python_cmd = "venv\\Scripts\\python"
    else:
        python_cmd = "venv/bin/python"
    
    print("Downloading models... This may take several minutes.")
    if not run_command(f"{python_cmd} download_models.py"):
        print("❌ Model download failed")
        print("You can try again later with: python download_models.py")
        return False
    
    print("✅ Models downloaded successfully!")
    return True

def create_startup_scripts():
    """Create convenient startup scripts."""
    print_step(5, "Creating Startup Scripts")
    
    # Backend startup script
    if platform.system() == "Windows":
        backend_script = """@echo off
echo Starting Smart Image Prep Backend...
call venv\\Scripts\\activate
python api_server.py
pause
"""
        with open("start_backend.bat", "w") as f:
            f.write(backend_script)
        
        frontend_script = """@echo off
echo Starting Smart Image Prep Frontend...
cd frontend
npm run dev
pause
"""
        with open("start_frontend.bat", "w") as f:
            f.write(frontend_script)
        
        print("✅ Created start_backend.bat and start_frontend.bat")
        
    else:
        backend_script = """#!/bin/bash
echo "Starting Smart Image Prep Backend..."
source venv/bin/activate
python api_server.py
"""
        with open("start_backend.sh", "w") as f:
            f.write(backend_script)
        os.chmod("start_backend.sh", 0o755)
        
        frontend_script = """#!/bin/bash
echo "Starting Smart Image Prep Frontend..."
cd frontend
npm run dev
"""
        with open("start_frontend.sh", "w") as f:
            f.write(frontend_script)
        os.chmod("start_frontend.sh", 0o755)
        
        print("✅ Created start_backend.sh and start_frontend.sh")

def run_tests():
    """Run basic tests to verify setup."""
    print_step(6, "Running Tests")
    
    # Test backend
    print("Testing backend setup...")
    if platform.system() == "Windows":
        python_cmd = "venv\\Scripts\\python"
    else:
        python_cmd = "venv/bin/python"
    
    if run_command(f"{python_cmd} test_example.py", check=False):
        print("✅ Backend test passed!")
    else:
        print("⚠️  Backend test failed - check the logs above")
    
    # Test frontend build
    print("Testing frontend build...")
    if run_command("npm run build", cwd="frontend", check=False):
        print("✅ Frontend build test passed!")
    else:
        print("⚠️  Frontend build test failed - check the logs above")

def print_final_instructions():
    """Print final setup instructions."""
    print_header("🎉 Setup Complete!")
    
    print("""
Your Smart Image Preparation Tool is ready to use!

🚀 To start the application:

1. Start the backend (in one terminal):
   """)
    
    if platform.system() == "Windows":
        print("   • Double-click start_backend.bat")
        print("   • Or run: venv\\Scripts\\activate && python api_server.py")
    else:
        print("   • Run: ./start_backend.sh")
        print("   • Or run: source venv/bin/activate && python api_server.py")
    
    print("""
2. Start the frontend (in another terminal):""")
    
    if platform.system() == "Windows":
        print("   • Double-click start_frontend.bat")
        print("   • Or run: cd frontend && npm run dev")
    else:
        print("   • Run: ./start_frontend.sh")
        print("   • Or run: cd frontend && npm run dev")
    
    print("""
3. Open your browser to: http://localhost:3000

📚 Documentation:
   • Backend: README.md
   • Frontend: frontend/README.md
   • API Docs: http://localhost:8000/docs (when backend is running)

🔧 Troubleshooting:
   • Check that both servers are running
   • Ensure ports 3000 and 8000 are available
   • See README.md for common issues

🎨 Happy creating!
""")

def main():
    """Main setup function."""
    print_header("Smart Image Preparation Tool - Setup")
    print("This script will set up both the backend and frontend for you.")
    
    # Check if we're in the right directory
    if not Path("requirements.txt").exists():
        print("❌ Please run this script from the project root directory")
        print("   (where requirements.txt is located)")
        sys.exit(1)
    
    # Run setup steps
    steps = [
        check_requirements,
        setup_backend,
        setup_frontend,
        download_models,
        create_startup_scripts,
        run_tests
    ]
    
    for step_func in steps:
        if not step_func():
            print(f"\n❌ Setup failed at: {step_func.__name__}")
            print("Please check the error messages above and try again.")
            sys.exit(1)
    
    print_final_instructions()

if __name__ == "__main__":
    main()
