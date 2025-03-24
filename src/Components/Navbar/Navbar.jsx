// src/Components/Navbar/Navbar.js
import React from "react";
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">MarkMesh</div>
            <ul className="navbar-links">
                <li 
                    className={currentPage === 'home' ? 'active' : ''} 
                    onClick={() => setCurrentPage('home')}
                >
                    Home
                </li>
                <li 
                    className={currentPage === 'embed' ? 'active' : ''} 
                    onClick={() => setCurrentPage('embed')}
                >
                    Embed
                </li>
                <li 
                    className={currentPage === 'extract' ? 'active' : ''} 
                    onClick={() => setCurrentPage('extract')}
                >
                    Extract
                </li>
                <li 
                    className={currentPage === 'faq' ? 'active' : ''} 
                    onClick={() => setCurrentPage('faq')}
                >
                    FAQ
                </li>
                <li 
                    className={currentPage === 'contact' ? 'active' : ''} 
                    onClick={() => setCurrentPage('contact')}
                >
                    Contact
                </li>
            </ul>
            <div className="navbar-buttons">
                <button className={currentPage === 'login' ? 'gray' : ''} onClick={() => setCurrentPage('login')}>Login</button>
                <button className={currentPage === 'signup' ? 'gray' : ''} onClick={() => setCurrentPage('signup')}>Sign Up</button>
            </div>
        </nav>
    );
};

export default Navbar;
