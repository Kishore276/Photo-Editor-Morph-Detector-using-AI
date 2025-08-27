# background_remover.py

from rembg import remove
from PIL import Image
import os

def remove_background(image_path: str, output_path: str = "no_background.png") -> str:
    """
    Removes background from the input image using rembg and saves the output image.

    Args:
        image_path (str): Path to the input image.
        output_path (str): Path to save the image with background removed.

    Returns:
        str: Path to the output image.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Input image not found: {image_path}")

    # Load the input image
    input_image = Image.open(image_path).convert("RGBA")

    # Use rembg to remove background
    output_image = remove(input_image)

    # Save the output image
    output_image.save(output_path)
    return output_path
