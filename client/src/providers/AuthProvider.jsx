import { AuthContext } from "../contexts/AuthContext";
import { useState, useEffect, useMemo } from "react";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [inEditMode, setInEditMode] = useState(false);

    const loggedIn = Boolean(user);
    const API_URL = "http://localhost:5555";



    useEffect(() => {
        checkSession();
    }, []);

const checkSession = async () => {
    try {
        const response = await fetch(`${API_URL}/check_session`, {
            credentials: 'include'
        });
        if (response.ok) {
            const userData = await response.json();
            
            if (userData.logged_in) {
                setUser(userData.user); 
            } else {
                setUser(null); 
            }
        }
    } catch (error) {
        console.error("Error checking session:", error);
    } finally {
        setLoading(false);
    }
}
    
async function login(credentials) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)  
    });
    
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return { success: true };
    } else {
      const error = await res.json();
      console.error('Login failed:', error);
      return { success: false, error: error.error };  
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Network error' };  
  }
}

const logout = async () => {
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);  // Clear user from context
    } catch (error) {
        console.error('Logout error:', error);
    }
};
  const value = useMemo(() => ({ 
        loading,
        loggedIn,
        login,
        logout,
        user,
        setUser,
        inEditMode, 
        setInEditMode
    }), 
    [user, loading, loggedIn, inEditMode]);

  return (
    <>
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
    </>
  )
}