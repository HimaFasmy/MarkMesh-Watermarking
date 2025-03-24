from flask import Flask, request, send_file, jsonify
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Directory setup
extracted_DIR = "extracted/"
os.makedirs(extracted_DIR, exist_ok=True)

channel = 0  # 0: blue/y, 1: green/cg, 2: red/co

# Allowed criteria
ALLOWED_COVER_DIMENSIONS = [(512, 512, 3)]  # Example: Only allow 512x512 RGB images
ALLOWED_WATERMARK_DIMENSIONS = [(32, 32, 3)]  # Example: Only allow 32x32 RGB watermarks


def is_valid_image(image_array, allowed_dimensions):
    return image_array.shape in allowed_dimensions


def rgb_to_ycbcr_lossless(img_bgr):
    matrix = np.array([[0.299, 0.587, 0.114],
                       [-0.168736, -0.331264, 0.5],
                       [0.5, -0.418688, -0.081312]], dtype=np.float64)
    img_ycbcr = np.dot(img_bgr, matrix.T)
    return img_ycbcr


def ycbcr_to_rgb_lossless(img_ycrcb):
    matrix = np.array([[1.0, 0.0, 1.402],
                       [1.0, -0.344136, -0.714136],
                       [1.0, 1.772, 0.0]], dtype=np.float64)
    img_bgr = np.dot(img_ycrcb, matrix.T)
    return img_bgr


def recover_watermark(y_channel, alpha=0.1):
    # Split the Y channel into even and odd rows
    even = y_channel[::2, :]
    odd = y_channel[1::2, :]

    # Debugging: Check the values in even and odd matrices
    print("Even matrix (min, max, mean):", np.min(even), np.max(even), np.mean(even))
    print("Odd matrix (min, max, mean):", np.min(odd), np.max(odd), np.mean(odd))

    # Extract watermark using the even-odd difference method
    watermark = (even - odd) / (2 * alpha)

    # Debugging: Check if the watermark values are reasonable
    print("Extracted Watermark (min, max, mean):", np.min(watermark), np.max(watermark), np.mean(watermark))

    return watermark


@app.route('/')
def home():
    return "Flask server is running!"


@app.route('/extract', methods=['POST'])
def extract_watermark():
    try:
        # Log request initiation
        print("/extract endpoint triggered")

        # Get uploaded file
        image_file = request.files['image']
        print("Received image file:", image_file.filename)

        # Read and process the image
        image = Image.open(image_file).convert('RGB')
        image_np = np.array(image)

        # Validate image dimensions
        if not is_valid_image(image_np, ALLOWED_COVER_DIMENSIONS):
            return "Invalid cover image dimensions. Only 512x512 RGB images are allowed.", 400

        # Convert to YCbCr color space
        ycbcr_image = rgb_to_ycbcr_lossless(image_np)
        print("Converted image to YCbCr color space")

        # Extract watermark from the Y channel
        y_channel = ycbcr_image[:, :, 0]
        print("Y-channel shape:", y_channel.shape)
        watermark = recover_watermark(y_channel)

        # Log extraction completion
        print("Watermark extraction completed")

        # Debugging: Check if watermark is within expected range
        print(f"Extracted watermark: min = {np.min(watermark)}, max = {np.max(watermark)}")

        # Convert watermark to image and save it to memory
        watermark_image = np.clip(watermark, 0, 255).astype(np.uint8)
        watermark_pil = Image.fromarray(watermark_image)
        byte_io = BytesIO()
        watermark_pil.save(byte_io, 'PNG')
        byte_io.seek(0)

        print("Extracted watermark ready to be sent")
        return send_file(byte_io, mimetype='image/png')

    except Exception as e:
        import traceback
        print("Error occurred:")
        print(traceback.format_exc())
        return str(e), 400


if __name__ == '__main__':
    app.run(debug=True)
