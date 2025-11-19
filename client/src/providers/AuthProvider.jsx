import { AuthContext } from "../contexts/AuthContext";
import { useState, useEffect, useMemo } from "react";

export function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);  // Just { id, name, email }
    const [userSongs, setUserSongs] = useState([]);  // Just songs array
    const [loading, setLoading] = useState(true); 
    const [inEditMode, setInEditMode] = useState(false);

    const loggedIn = Boolean(userInfo);
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
                    const { songs, ...info } = userData.user; // { destructure user object }
                    setUserInfo(info);  // { id, name, email }
                    setUserSongs(songs || []);  // songs array
                } else {
                    setUserInfo(null);
                    setUserSongs([]);
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
                const { songs, ...info } = data;
                setUserInfo(info);
                setUserSongs(songs || []);
                return { success: true };
            } else {
                const error = await res.json();
                return { success: false, error: error.error };  
            }
        } catch (err) {
            return { success: false, error: 'Network error' };  
        }
    }

    const logout = async () => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUserInfo(null);
            setUserSongs([]);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    //================= Create Song =================//
    const createSong = async (songData) => {
        try {
            const response = await fetch(`${API_URL}/songs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(songData)
            });
            if (!response.ok) throw new Error('Failed to create song');
            const newSong = await response.json();
            setUserSongs([...userSongs, newSong]);
            return newSong;
        } catch (error) {
            console.error("Error creating song:", error);
            throw error;
        }       
    }


        //================= Update Song =================//
    const updateSong = async (id, songData) => {
        try {
            console.log('Updating song:', id, songData);
            const response = await fetch(`${API_URL}/songs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(songData)
            });
            if (!response.ok) throw new Error('Failed to update song');
            const updatedSong = await response.json();
            const updatedSongs = userSongs.map((song) =>
                song.id === updatedSong.id ? updatedSong : song
            );
            setUserSongs(updatedSongs);
            return updatedSong;
        } catch (error) {
            console.error("Error updating song:", error);
            throw error;
        }
    }

      //================= Delete Song =================//
  const deleteSong = async (id) => {
    const updatedSongs = userSongs.filter((song) => song.id !== id);
    try {
      const response = await fetch(`${API_URL}/songs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete song');
      setUserSongs(updatedSongs);
      return await response.json();
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  }

    const value = useMemo(() => ({ 
        loading,
        loggedIn,
        login,
        logout,
        checkSession,
        userInfo,
        userSongs,
        setUserSongs,
        createSong,
        updateSong,
        deleteSong,
        inEditMode, 
        setInEditMode
    }), 
    [userInfo, userSongs, loading, loggedIn, inEditMode]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}