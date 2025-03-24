from flask import Flask, request, send_file
import cv2
import numpy as np
import pywt
import os
from io import BytesIO
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Directory setup
embedded_DIR = "embedded/"
os.makedirs(embedded_DIR, exist_ok=True)

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


def embedd_matrix(COVER, WATERMARK, alpha=0.1):
    alpha = np.float64(alpha)
    two = np.float64(2.0)

    print("COVER shape:", COVER.shape)
    print("WATERMARK shape before resizing:", WATERMARK.shape)

    # Split COVER into even and odd rows
    even, odd = COVER[::2], COVER[1::2]

    # Ensure WATERMARK matches the shape of even/odd matrices
    if even.shape != WATERMARK.shape:
        WATERMARK = cv2.resize(WATERMARK, (even.shape[1], even.shape[0]))
        print("WATERMARK shape after resizing:", WATERMARK.shape)

    WATERMARK = np.float64(WATERMARK) * alpha

    # Process embedding
    Aeven = (even + odd) / two
    Aodd = (even + odd) / two

    Aeven += WATERMARK
    Aodd -= WATERMARK

    # Combine modified even and odd rows back
    COVER[::2] = Aeven
    COVER[1::2] = Aodd
    return COVER


@app.route('/')
def home():
    return "Flask server is running!"


@app.route('/embed', methods=['POST'])
def embed_watermark():
    try:
        # Log request initiation
        print("/embed endpoint triggered")

        # Get uploaded files
        image_file = request.files['image']
        watermark_file = request.files['watermark']

        # Log received files
        print("Received image file:", image_file.filename)
        print("Received watermark file:", watermark_file.filename)

        # Read and process the image
        image = Image.open(image_file).convert('RGB')
        watermark = Image.open(watermark_file).convert('RGB')

        image_np = np.array(image)
        watermark_np = np.array(watermark)

        # Validate image dimensions
        if not is_valid_image(image_np, ALLOWED_COVER_DIMENSIONS):
            return "Invalid cover image dimensions. Only 512x512 RGB images are allowed.", 400

        if not is_valid_image(watermark_np, ALLOWED_WATERMARK_DIMENSIONS):
            return "Invalid watermark dimensions. Only 32x32 RGB watermarks are allowed.", 400

        # Log valid inputs
        print("Valid image and watermark received")

        # Resize watermark to match cover dimensions
        watermark_resized = cv2.resize(watermark_np, (image_np.shape[1], image_np.shape[0]))

        # Log resized watermark
        print("Watermark shape after resizing:", watermark_resized.shape)

        # Convert to YCbCr color space
        ycbcr_image = rgb_to_ycbcr_lossless(image_np)
        print("Converted image to YCbCr color space")

        # Embed watermark into the Y channel
        y_channel = ycbcr_image[:, :, 0]
        print("Y-channel shape:", y_channel.shape)
        watermarked_y = embedd_matrix(y_channel.copy(), watermark_resized[:, :, 0])

        # Log embedding completion
        print("Watermark embedding completed")

        ycbcr_image[:, :, 0] = watermarked_y

        # Convert back to RGB
        embedded_image = ycbcr_to_rgb_lossless(ycbcr_image)
        embedded_image = np.clip(embedded_image, 0, 255).astype(np.uint8)
        print("Converted back to RGB color space")

        # Save the embedded image to memory
        embedded_pil = Image.fromarray(embedded_image)
        byte_io = BytesIO()
        embedded_pil.save(byte_io, 'PNG')
        byte_io.seek(0)

        print("Embedded image ready to be sent")
        return send_file(byte_io, mimetype='image/png')

    except Exception as e:
        import traceback
        print("Error occurred:")
        print(traceback.format_exc())
        return str(e), 400


if __name__ == '__main__':
    app.run(debug=True)