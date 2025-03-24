import React, { useState } from "react";
import "./Extract.css"; // Ensure CSS styles are properly imported

const Extract = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedWatermark, setExtractedWatermark] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Handle Image Selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrorMessage("Please upload a valid image file.");
                return;
            }
            setSelectedImage(file);
            setErrorMessage(null);
            console.log("Selected Image:", file);
        }
    };

    // Handle Watermark Extraction
    const handleExtract = async () => {
        if (!selectedImage) {
            setErrorMessage("Please select an embedded image.");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        const formData = new FormData();
        formData.append("image", selectedImage); // Key must match Flask backend

        try {
            const response = await fetch("http://127.0.0.1:5000/extract", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to extract watermark: ${response.statusText}`);
            }

            const blob = await response.blob();
            const extractedImageUrl = URL.createObjectURL(blob);
            setExtractedWatermark(extractedImageUrl);
        } catch (error) {
            console.error("Error extracting watermark:", error);
            setErrorMessage(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="extract">
            <div className="extract-content">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    style={{ display: "none" }}
                />
                <label htmlFor="image-upload" className="upload-button">
                    Select Image
                </label>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                {loading && <div className="loading">Processing...</div>}

                <div className="preview-container">
                    {selectedImage && (
                        <div className="preview">
                            <h4>Selected Image</h4>
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                        </div>
                    )}
                    {extractedWatermark && (
                        <div className="preview">
                            <h4>Extracted Watermark</h4>
                            <img src={extractedWatermark} alt="Extracted Watermark" />
                            <a
                                href={extractedWatermark}
                                download="extracted_watermark.png"
                                className="download-link"
                            >
                                Download Extracted Watermark
                            </a>
                        </div>
                    )}
                </div>

                <button className="extract-button" onClick={handleExtract} disabled={loading}>
                    {loading ? "Extracting..." : "Extract"}
                </button>
            </div>
        </div>
    );
};

export default Extract;
