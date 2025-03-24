import React, { useState } from 'react';
import './FAQ.css'; // Include your CSS file for styling

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What is watermark embedding?",
            answer: "Watermark embedding is the process of adding an invisible watermark to an image to protect it from unauthorized use."
        },
        {
            question: "How do I embed a watermark to my image?",
            answer: "You can upload an image and a watermark, then click the 'Embed' button. The watermark will be embedded in the image and you can download the result."
        },
        {
            question: "Can I extract the watermark from an image?",
            answer: "Yes, you can upload an image that has a watermark embedded and use our extraction tool to recover the watermark."
        },
        {
            question: "Is my image safe after embedding the watermark?",
            answer: "Yes, the watermarking process does not affect the quality of the image, and the image is safe to use after embedding."
        }
    ];

    return (
        <div className="faq">
            <div className="faq-content">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div 
                                className="faq-question"
                                onClick={() => toggleAnswer(index)}
                            >
                                <h4>{faq.question}</h4>
                                <span>{activeIndex === index ? '▲' : '▼'}</span>
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
