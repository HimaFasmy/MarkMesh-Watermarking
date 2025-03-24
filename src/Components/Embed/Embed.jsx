import React, { useState } from 'react';
import './Embed.css'; // Include your CSS file for styling

const Embed = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedWatermark, setSelectedWatermark] = useState(null);
    const [embeddedImage, setEmbeddedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleWatermarkChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedWatermark(file);
        }
    };

    const handleEmbed = async () => {
        if (!selectedImage || !selectedWatermark) {
            setErrorMessage('Please select both an image and a watermark.');
            return;
        }

        setErrorMessage(null);
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('watermark', selectedWatermark);

        try {
            const response = await fetch('http://localhost:5000/embed', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrorMessage(errorText);
                throw new Error(errorText || 'Failed to embed watermark.');
            }

            const blob = await response.blob();
            const embeddedImageUrl = URL.createObjectURL(blob);
            setEmbeddedImage(embeddedImageUrl);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="embed">
            <div className="embed-content">
                <h2>Embed Watermark</h2>
                <p>Select an image and a watermark to embed.</p>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="upload-button">Select Image</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleWatermarkChange}
                    id="watermark-upload"
                    style={{ display: 'none' }}
                />
                <label htmlFor="watermark-upload" className="upload-button">Select Watermark</label>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="preview-container">
                    {selectedImage && (
                        <div className="preview">
                            <h4>Selected Image</h4>
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                        </div>
                    )}
                    {selectedWatermark && (
                        <div className="preview">
                            <h4>Selected Watermark</h4>
                            <img src={URL.createObjectURL(selectedWatermark)} alt="Watermark" />
                        </div>
                    )}
                    {embeddedImage && (
                        <div className="preview">
                            <h4>Embedded Image</h4>
                            <img src={embeddedImage} alt="Embedded" />
                            <a href={embeddedImage} download="embedded_image.png" className="download-link">
                                Download Embedded Image
                            </a>
                        </div>
                    )}
                </div>

                <button className="embed-button" onClick={handleEmbed}>Embed</button>
            </div>
        </div>
    );
};

export default Embed;
