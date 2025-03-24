import React, { useState } from "react";
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = ({ onLogin }) => {
    const [action, setAction] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});

    //  Validate user input fields
    const validateForm = () => {
        let formErrors = {};
        let showToast = false;

        if (!email) {
            formErrors.email = "Email is required";
            showToast = true;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = "Email is invalid";
            showToast = true;
        }
        if (!password) {
            formErrors.password = "Password is required";
            showToast = true;
        } else if (password.length < 6) {
            formErrors.password = "Password must be at least 6 characters";
            showToast = true;
        }
        if (action === "Sign Up" && !name) {
            formErrors.name = "Name is required";
            showToast = true;
        }

        if (showToast) {
            toast.error("Please fill in all required fields or correct the errors.");
        }

        return formErrors;
    };

    //  Handle user sign-up
    const handleSignUp = async () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //  Send email verification
            await sendEmailVerification(user);
            toast.success("Sign up successful! Please verify your email before logging in.");

            setAction("Login");  // Switch to login after sign-up
            setErrors({});
        } catch (error) {
            toast.error(error.message);
        }
    };

    //  Handle user sign-in
    const handleSignIn = async () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //  Check if email is verified before allowing login
            if (!user.emailVerified) {
                toast.error("Please verify your email before logging in.");
                return;
            }

            toast.success("Login successful!");
            onLogin();  // Call the onLogin prop to navigate to the home page
            setErrors({});
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleAction = () => {
        setAction((prevAction) => (prevAction === "Sign Up" ? "Login" : "Sign Up"));
        setErrors({});
    };

    return (
        <>
            <ToastContainer />
            <div className='container'>
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {action === "Login" ? null : (
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <div className="error">{errors.name}</div>}
                        </div>
                    )}
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    {action === "Sign Up" ? null : (
                        <div className="forgot-password">
                            Forgot Password? <span>Click Here!</span>
                        </div>
                    )}
                    <div className="submit-container">
                        {action === "Sign Up" ? (
                            <div className="submit" onClick={handleSignUp}>Sign Up</div>
                        ) : (
                            <div className="submit" onClick={handleSignIn}>Sign In</div>
                        )}
                    </div>
                </div>
                <div className="toggle-action">
                    {action === "Sign Up" ? (
                        <p>Already have an account? <span onClick={toggleAction}>Sign In</span></p>
                    ) : (
                        <p>Don't have an account? <span onClick={toggleAction}>Sign Up</span></p>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginSignup;
