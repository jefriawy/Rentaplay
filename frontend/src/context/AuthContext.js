// frontend/src/context/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase'; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Mulai dengan loading: true

  const register = async (email, password, fullName, phoneNumber) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      nama_lengkap: fullName,
      nomor_hp: phoneNumber,
      role: 'user', // Default role di Firestore saat registrasi
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log("User registered and data saved to Firestore:", user);
    return user; 
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true); 
          const userRole = idTokenResult.claims.role || 'user'; 
          
          console.group("DEBUGGING AUTH CONTEXT: onAuthStateChanged");
          console.log("User object from Firebase Auth:", user);
          console.log("ID Token Result (from getIdTokenResult(true)):", idTokenResult);
          console.log("Extracted Claims:", idTokenResult.claims);
          console.log("Determined User Role:", userRole);
          console.groupEnd();

          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Gabungkan data, dan tambahkan fungsi getIdToken ke objek currentUser
            setCurrentUser({ 
              ...user, 
              ...userDocSnap.data(),
              role: userRole,
              getIdToken: () => user.getIdToken(), // Menambahkan metode getIdToken
              // Tambahkan juga properti refresh user jika ingin memperbarui token secara manual
              refreshToken: () => user.getIdToken(true) 
            }); 
          } else {
            setCurrentUser({ 
              ...user, 
              role: userRole,
              getIdToken: () => user.getIdToken(), // Menambahkan metode getIdToken
              refreshToken: () => user.getIdToken(true) 
            });
          }
        } catch (error) {
          console.error("Error fetching user data or claims in AuthContext:", error);
          setCurrentUser(null); // Atur menjadi null atau user dasar jika ada error fatal
          logout(); // Paksa logout jika terjadi error fatal pada autentikasi
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false); 
    });

    return () => {
      unsubscribe(); 
    };
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading 
  };

  return (
    <AuthContext.Provider value={value}>
      {children} 
    </AuthContext.Provider>
  );
};