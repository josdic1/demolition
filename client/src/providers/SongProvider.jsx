import { SongContext } from "../contexts/SongContext";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect, useMemo } from "react"; 

export function SongProvider({ children }) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  const API_URL = "http://localhost:5555";

  useEffect(() => {
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/check_session`);
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  const value = useMemo(() => ({ 
        userInfo,
        genres,
        setGenres,
        selectedSong,
        setSelectedSong
    }), 
    [genres, selectedSong]);

  return (
    <>
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
    </>
  )
}