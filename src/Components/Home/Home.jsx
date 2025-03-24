import React, { useState, useEffect } from 'react';
import './Home.css';

const testimonials = [
    { text: "This tool helped me protect my digital artwork effortlessly!", author: "Sarah K." },
    { text: "A must-have for photographers who want to prevent image theft!", author: "James L." },
    { text: "Super easy to use and the watermarking is seamless.", author: "Emily R." }
];

const Home = ({ setCurrentPage }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Auto-slide effect every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Manual navigation
    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <header className="hero">
                <h1>Watermark Protect</h1>
                <p>Secure your images with advanced watermark embedding & extraction.</p>
                <div className="hero-buttons">
                    <button onClick={() => setCurrentPage('embed')}>Embed Watermark</button>
                    <button onClick={() => setCurrentPage('extract')}>Extract Watermark</button>
                </div>
            </header>

            {/* Features Section (Cards) */}
            <section className="features">
                <h2>Why Choose Watermark Protect?</h2>
                <div className="features-container">
                    <div className="feature">
                        <span>🛡️</span>
                        <h3>Secure Embedding</h3>
                        <p>Invisible digital watermarks prevent image theft and tampering.</p>
                    </div>
                    <div className="feature">
                        <span>🔍</span>
                        <h3>Smart Extraction</h3>
                        <p>Easily detect and extract hidden watermarks to verify authenticity.</p>
                    </div>
                    <div className="feature center-feature">
                        <span>🎨</span>
                        <h3>Preserves Quality</h3>
                        <p>Watermarking without visible loss of image resolution.</p>
                    </div>
                    <div className="feature">
                        <span>🚀</span>
                        <h3>Lightning Fast</h3>
                        <p>Process images quickly with our AI-powered algorithms.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section (Cards) */}
            <section className="steps">
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <span>📤</span>
                        <h4>Upload Your Image</h4>
                        <p>Select the image you want to watermark.</p>
                    </div>
                    <div className="step">
                        <span>⚙️</span>
                        <h4>Customize Settings</h4>
                        <p>Adjust transparency & position for best results.</p>
                    </div>
                    <div className="step">
                        <span>📥</span>
                        <h4>Download & Secure</h4>
                        <p>Save your protected image or verify authenticity.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section (Carousel) */}
            <section className="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial-slider">
                    <button className="prev" onClick={prevTestimonial}>❮</button>
                    <div className="testimonial-card fade-in">
                        <p>{testimonials[currentTestimonial].text}</p>
                        <h4>— {testimonials[currentTestimonial].author}</h4>
                    </div>
                    <button className="next" onClick={nextTestimonial}>❯</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>Contact us at <a href="mailto:support@example.com">support@example.com</a></p>
                <p>© 2024 Watermark Protect</p>
            </footer>
        </div>
    );
};

export default Home;
