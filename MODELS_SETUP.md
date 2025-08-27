# Model Setup Guide 🤖

Since AI models are too large for GitHub, you'll need to download them separately after cloning the repository.

## Automatic Model Download (Recommended)

The `setup_project.py` script will automatically download all required models:

```bash
python setup_project.py
```

This will download:
- Ateeqq/ai-vs-human-image-detector model
- Any additional models required for the application

## Manual Model Setup

If automatic download fails, you can manually set up the models:

### 1. AI Detection Model

```bash
# Install huggingface-hub if not already installed
pip install huggingface-hub

# Download the model
python -c "
from huggingface_hub import snapshot_download
snapshot_download(
    repo_id='Ateeqq/ai-vs-human-image-detector',
    local_dir='models/ai-vs-human-image-detector',
    token=None
)
print('✅ AI detection model downloaded successfully!')
"
```

### 2. Verify Model Installation

Run the test script to verify models are working:

```bash
python test_real_ateeqq.py
```

## Model Directory Structure

After setup, your `models/` directory should look like:

```
models/
├── ai-vs-human-image-detector/
│   ├── config.json
│   ├── model.safetensors
│   ├── preprocessor_config.json
│   └── README.md
├── ateeqq_cache/
│   └── models--Ateeqq--ai-vs-human-image-detector/
└── ateeqq_final/
    └── models--Ateeqq--ai-vs-human-image-detector/
```

## Troubleshooting

### Model Download Issues
- Ensure you have a stable internet connection
- Check if you have enough disk space (models require ~2GB)
- Try running the download script with administrator privileges

### Permission Errors
```bash
# On Windows, run PowerShell as Administrator
# On Linux/Mac, use sudo if necessary
sudo python setup_project.py
```

### Model Loading Errors
- Verify the model files are not corrupted
- Re-download the models if necessary
- Check Python dependencies are correctly installed

## Note on Model Licensing

The models used in this project are subject to their respective licenses:
- **Ateeqq/ai-vs-human-image-detector**: Check the model card on Hugging Face for licensing terms
- Always comply with model licensing when using in production or commercial applications

---

For more help, see the main [README.md](README.md) or open an issue in the repository.
