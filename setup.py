#!/usr/bin/env python3
"""
Setup script for Smart Image Preparation Tool
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README for long description
readme_path = Path(__file__).parent / "README.md"
long_description = readme_path.read_text(encoding="utf-8") if readme_path.exists() else ""

# Read requirements
requirements_path = Path(__file__).parent / "requirements.txt"
requirements = []
if requirements_path.exists():
    requirements = requirements_path.read_text().strip().split('\n')
    requirements = [req.strip() for req in requirements if req.strip() and not req.startswith('#')]

setup(
    name="smart-image-prep",
    version="1.0.0",
    description="AI-powered image preparation toolkit for social media",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Smart Image Prep Team",
    author_email="contact@smartimageprep.com",
    url="https://github.com/yourusername/smart-image-prep",
    packages=find_packages(),
    py_modules=[
        "smart_crop",
        "outpaint_image", 
        "add_text_overlay",
        "ai_image_check",
        "utils",
        "download_models",
        "main"
    ],
    install_requires=requirements,
    python_requires=">=3.9",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Multimedia :: Graphics :: Graphics Conversion",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Scientific/Engineering :: Image Processing",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Operating System :: OS Independent",
    ],
    keywords="image processing, ai, social media, cropping, outpainting, text overlay, computer vision",
    entry_points={
        "console_scripts": [
            "smart-image-prep=main:main",
            "download-models=download_models:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.md", "*.txt", "*.yml", "*.yaml"],
    },
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "black>=22.0.0",
            "flake8>=4.0.0",
            "mypy>=0.950",
        ],
        "gpu": [
            "torch[cuda]",
        ],
    },
    project_urls={
        "Bug Reports": "https://github.com/yourusername/smart-image-prep/issues",
        "Source": "https://github.com/yourusername/smart-image-prep",
        "Documentation": "https://github.com/yourusername/smart-image-prep/blob/main/README.md",
    },
)
