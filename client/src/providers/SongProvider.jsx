import { SongContext } from "../contexts/SongContext";
import { useState, useEffect, useMemo, useCallback } from "react"; 

export function SongProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [songKeys, setSongKeys] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [linkTypes, setLinkTypes] = useState([]);

  const API_URL = "http://localhost:5555";

  useEffect(() => {
    fetchGenres();
    fetchStatuses();
    fetchKeys();
    fetchLinkTypes();
  }, []);

  // ================= Fetch Data ===================//
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

    const fetchKeys = async () => {
    try {
      const response = await fetch(`${API_URL}/song-keys`);
      if (response.ok) {
        const data = await response.json();
        setSongKeys(data);
      }
    } catch (error) {
      console.error("Error fetching keys:", error);
    }
  }

const fetchLinkTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/link-types`);
      if (response.ok) {
        const data = await response.json();
        setLinkTypes(data);
      }
    } catch (error) {
      console.error("Error fetching link types:", error);
    }
  }

  // ================= Create Link ===================//
  const createLink = async (songId, linkData) => {
    try {
      const response = await fetch(`${API_URL}/songs/${songId}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(linkData)
      });
      if (!response.ok) throw new Error('Failed to create link');
      const newLink = await response.json();
      return newLink;
    } catch (error) {
      console.error("Error creating link:", error);
      throw error;
    }
  }


  const value = useMemo(() => ({ 
        genres,
        linkTypes,
        statuses,
        songKeys,
        selectedSong,
        setSelectedSong,
        createLink

    }), 
    [genres, statuses, selectedSong, linkTypes]);

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  )
}