import { useState, useEffect } from 'react';
import { db } from '../lib/firebase/firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

// A powerful 2-way binding hook syncing seamlessly between React, LocalStorage (offline), and Firestore Realtime Database
export function useDatabaseReport(reportId, initialData) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);

    // Load initial data (Firestore preferred, LocalStorage fallback)
    useEffect(() => {
        let unsubscribe = null;

        const connectToDatabase = async () => {
            if (!db) {
                // FALLBACK: Offline LocalStorage Mode
                try {
                    const cached = window.localStorage.getItem(reportId);
                    if (cached) setData(JSON.parse(cached));
                } catch (e) {
                    console.error("Local load failed", e);
                }
                setLoading(false);
                return;
            }

            // PRODUCTION: Firestore Mode (Real-time connection)
            const docRef = doc(db, 'reports', reportId);

            try {
                // Fetch baseline to ensure it exists
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    // Seed the database with initial mockup data so the schema isn't empty
                    await setDoc(docRef, initialData);
                    setData(initialData);
                } else {
                    setData(docSnap.data());
                }
            } catch (e) {
                console.warn("Firestore connection blocked by rules or network. Falling back to local.", e);
                const cached = window.localStorage.getItem(reportId);
                if (cached) setData(JSON.parse(cached));
            }

            // Bind real-time listener
            unsubscribe = onSnapshot(docRef, (snap) => {
                if (snap.exists()) {
                    const remoteData = snap.data();
                    setData(remoteData);
                    // Sync backup to local storage silently
                    window.localStorage.setItem(reportId, JSON.stringify(remoteData));
                }
            }, (error) => {
                console.error("Firestore sync subscription error:", error);
            });

            setLoading(false);
        };

        connectToDatabase();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [reportId]); // deliberately exclude initialData to prevent bouncing

    // Write function pushes to Firestore securely
    const updateData = async (newData) => {
        // Optimistic UI update
        setData(newData);

        // Sync local cache
        try {
            window.localStorage.setItem(reportId, JSON.stringify(newData));
        } catch (e) { }

        // Push to server
        if (db) {
            try {
                await setDoc(doc(db, 'reports', reportId), newData);
            } catch (error) {
                console.error('Failed to sync to Firestore: ', error);
            }
        }
    };

    return [data, updateData, loading];
}
