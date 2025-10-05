import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      // If no user and no guest mode set, check localStorage
      if (!session?.user) {
        const guestMode = localStorage.getItem('guestMode') === 'true';
        setIsGuest(guestMode);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        // Clear guest mode when user logs in
        if (session?.user) {
          setIsGuest(false);
          localStorage.removeItem('guestMode');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Immediately clear user state
    setIsGuest(false);
    localStorage.removeItem('guestMode');
  };

  const continueAsGuest = () => {
    setUser(null); // Ensure user is cleared
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
  };

  const value = {
    user,
    loading,
    isGuest,
    signOut,
    continueAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};