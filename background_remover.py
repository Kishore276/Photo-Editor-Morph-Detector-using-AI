# background_remover.py

from rembg import remove
from PIL import Image
import os
import logging

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def remove_background(image_path: str, output_path: str = "no_background.png") -> str:
    """
    Removes background from the input image using rembg and saves the output image.

    Args:
        image_path (str): Path to the input image.
        output_path (str): Path to save the image with background removed.

    Returns:
        str: Path to the output image.
    """
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Input image not found: {image_path}")

        logger.info(f"🔄 Removing background from: {image_path}")

        # Load the input image and ensure it's in RGBA format
        input_image = Image.open(image_path)
        
        # Convert to RGB first if needed, then to RGBA for transparency
        if input_image.mode != 'RGBA':
            if input_image.mode == 'CMYK':
                input_image = input_image.convert('RGB')
            input_image = input_image.convert('RGBA')

        logger.info(f"📐 Input image size: {input_image.size}, mode: {input_image.mode}")

        # Use rembg to remove background
        logger.info("🎯 Processing with rembg...")
        output_image = remove(input_image)

        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)

        # Save the output image as PNG to preserve transparency
        if not output_path.lower().endswith('.png'):
            output_path = os.path.splitext(output_path)[0] + '.png'
            
        output_image.save(output_path, 'PNG')
        
        logger.info(f"✅ Background removed successfully: {output_path}")
        logger.info(f"📐 Output image size: {output_image.size}, mode: {output_image.mode}")
        
        return output_path

    except Exception as e:
        logger.error(f"❌ Background removal failed: {e}")
        raise Exception(f"Background removal error: {str(e)}")

# Test function
def test_background_remover():
    """Test the background remover with a sample image."""
    try:
        logger.info("🧪 Testing background remover...")
        
        # Create a test image
        test_input = "test_bg_input.jpg"
        test_output = "test_bg_output.png"
        
        # Create a simple test image
        test_img = Image.new('RGB', (300, 300), color='blue')
        test_img.save(test_input)
        
        # Test background removal
        result = remove_background(test_input, test_output)
        
        if os.path.exists(result):
            logger.info("✅ Background remover test passed!")
        else:
            logger.error("❌ Background remover test failed - output not created")
            
        # Cleanup
        for file in [test_input, test_output]:
            if os.path.exists(file):
                os.remove(file)
                
    except Exception as e:
        logger.error(f"❌ Background remover test failed: {e}")

if __name__ == "__main__":
    test_background_remover()
