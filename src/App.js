import React, { useState, useEffect } from 'react';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
import Embed from './Components/Embed/Embed';
import Extract from './Components/Extract/Extract';
import FAQ from './Components/FAQ/FAQ';
import Contact from './Components/Contact/Contact';
import Navbar from './Components/Navbar/Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Listen for changes in authentication state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true); // User is logged in
                setCurrentPage('home'); // Redirect to home page after login
            } else {
                setIsAuthenticated(false); // User is not logged in
                setCurrentPage('login'); // Redirect to login page
            }
        });
    }, []);

    const handleSignOut = () => {
        // Handle sign-out with Firebase
        auth.signOut()
            .then(() => {
                setIsAuthenticated(false); // Set authenticated state to false
                setCurrentPage('login'); // Redirect to login page
            })
            .catch((error) => {
                console.error('Sign Out Error', error);
            });
    };

    // Function to render the appropriate page based on the currentPage state
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home setCurrentPage={setCurrentPage} />;
            case 'embed':
                return <Embed />;
            case 'extract':
                return <Extract />;
            case 'faq':
                return <FAQ />;
            case 'contact':
                return <Contact />;
            case 'signup':
                return <LoginSignup onLogin={() => setCurrentPage('home')} />;
            case 'login':
            default:
                return <LoginSignup onLogin={() => setCurrentPage('home')} />;
        }
    };

    return (
        <div>
            {/* Render Navbar component only if not on login or signup page */}
            {(currentPage !== 'login' && currentPage !== 'signup') && (
                <Navbar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isAuthenticated={isAuthenticated}
                    handleSignOut={handleSignOut}  // Pass the handleSignOut function
                />
            )}
            {/* Render the page based on currentPage state */}
            {renderPage()}
        </div>
    );
};

export default App;
