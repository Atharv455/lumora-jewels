import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { createUserProfile, getUserProfile } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register({ name, email, password }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    const profile = await createUserProfile(credential.user.uid, { name, email });
    setUserProfile(profile);
    return profile;
  }

  async function login({ email, password }) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);
    setUserProfile(profile);
    return profile;
  }

  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    isAdmin: userProfile?.role === "admin",
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
