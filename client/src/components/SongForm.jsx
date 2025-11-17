import { useAuth } from "../hooks/useAuth";
import { useSong } from "../hooks/useSong";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './SongForm.css';

export function SongForm() {
    const { userSongs, inEditMode, setInEditMode } = useAuth();
    const { genres, statuses, createSong, updateSong } = useSong();
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        about: '',
        bpm: '',
        key: '',
        lyrics: '',
        genre: '',
        status: '',
        links: []
    });
    const { id } = useParams();
    const navigate = useNavigate();
   

    return (
        <>
        <form onSubmit={handleSubmit} >

        </form>

        </>
    )
}