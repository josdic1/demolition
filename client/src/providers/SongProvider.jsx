import { SongContext } from "../contexts/SongContext";
import { useState, useEffect, useMemo, useCallback } from "react"; 

export function SongProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [songKeys, setSongKeys] = useState([]);
  const [linkTypes, setLinkTypes] = useState([]);

  const API_URL = "http://localhost:5555";


  // ================= Fetch Data ===================//
  const fetchFormData = async () => {
    // If already loaded, skip
    if (genres.length > 0 && statuses.length > 0 && songKeys.length > 0 && linkTypes.length > 0) {
      return;
    }
    
    try {
      // Fetch all in parallel
      const [genresRes, statusesRes, keysRes, linkTypesRes] = await Promise.all([
        fetch(`${API_URL}/genres`),
        fetch(`${API_URL}/statuses`),
        fetch(`${API_URL}/song-keys`),
        fetch(`${API_URL}/link-types`)
      ]);
      
      const [genresData, statusesData, keysData, linkTypesData] = await Promise.all([
        genresRes.json(),
        statusesRes.json(),
        keysRes.json(),
        linkTypesRes.json()
      ]);
      
      setGenres(genresData);
      setStatuses(statusesData);
      setSongKeys(keysData);
      setLinkTypes(linkTypesData);
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };



  const value = useMemo(() => ({ 
    genres,
    linkTypes,
    statuses,
    songKeys,
    fetchFormData  
  }), 
  [genres, statuses, linkTypes, songKeys]);

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  );
}