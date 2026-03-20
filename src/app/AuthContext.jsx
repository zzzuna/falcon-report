import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If Firebase is configured, use it:
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, user => {
                setCurrentUser(user);
                setLoading(false);
            });
            return unsubscribe;
        } else {
            // MOCK AUTHENTICATION FALLBACK
            // Allows immediate local testing of Admin Panel without API keys
            const userRole = localStorage.getItem('fi_mock_auth');
            if (userRole) {
                setCurrentUser({ email: 'admin@falconisland.com', uid: 'admin-123' });
            }
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        if (auth) {
            return signInWithEmailAndPassword(auth, email, password);
        }
        // Mock login logic
        if (email && password) {
            localStorage.setItem('fi_mock_auth', 'admin');
            setCurrentUser({ email, uid: 'admin-123' });
            return Promise.resolve();
        }
        return Promise.reject(new Error("Invalid credentials"));
    };

    const logout = async () => {
        if (auth) {
            return signOut(auth);
        }
        localStorage.removeItem('fi_mock_auth');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
