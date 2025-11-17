import { SongContext } from "../contexts/SongContext";
import { useState, useEffect, useMemo } from "react"; 

export function SongProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  const API_URL = "http://localhost:5555";

  useEffect(() => {
    fetchGenres();
    fetchStatuses();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_URL}/genres`);
      if (response.ok) {
        const data = await response.json();
        setGenres(data);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }
  
  const fetchStatuses = async () => { 
    try {
      const response = await fetch(`${API_URL}/statuses`);
      if (response.ok) {
        const data = await response.json();
        setStatuses(data);
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  }



  const value = useMemo(() => ({ 
        genres,
        statuses,
        selectedSong,
        setSelectedSong,

    }), 
    [genres, statuses, selectedSong]);

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  )
}