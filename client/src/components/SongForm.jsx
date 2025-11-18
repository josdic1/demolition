import { useAuth } from "../hooks/useAuth";
import { useSong } from "../hooks/useSong";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../style/SongForm.css';

export function SongForm() {
    const { userInfo, userSongs, inEditMode, setInEditMode, createSong, updateSong } = useAuth();
    const { genres, statuses } = useSong();
    const [originalSong, setOriginalSong] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const initialFormData = {
        title: '', artist: '', about: '', bpm: '', key: '', lyrics: '',
        genre_id: '', status_id: '', links: []
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (inEditMode && id) {
            const song = userSongs.find(s => s.id === Number(id));
            if (song) {
                setOriginalSong(song);
                setFormData({
                    title: song.title || '',
                    artist: song.artist || '',
                    about: song.about || '',
                    bpm: song.bpm || '',
                    key: song.key || '',
                    lyrics: song.lyrics || '',
                    genre_id: song.genre?.id || '',
                    status_id: song.status?.id || '',
                    links: song.links || []
                });
            }
        } else {
            setFormData(initialFormData);
            setOriginalSong(null);
        }
    }, [inEditMode, id, userSongs]);

    const buildPayload = () => ({
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        about: formData.about.trim() || null,
        bpm: formData.bpm ? Number(formData.bpm) : null,
        key: formData.key.trim() || null,
        lyrics: formData.lyrics.trim() || null,
        genre_id: Number(formData.genre_id),
        status_id: Number(formData.status_id),
        user_id: Number(userInfo.id)
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        await createSong(buildPayload());
        navigate('/');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateSong(originalSong.id, buildPayload());
        setInEditMode(false);
        navigate('/');
    };

    return (
        <div className="song-form-page">
            <div className="song-form-card">
                <h2>{inEditMode ? 'Edit Song' : 'Add New Song'}</h2>

                <form onSubmit={inEditMode ? handleUpdate : handleCreate}>
                    <label>
                        <span>Title</span>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </label>

                    <label>
                        <span>Artist</span>
                        <input
                            type="text"
                            value={formData.artist}
                            onChange={e => setFormData({ ...formData, artist: e.target.value })}
                            required
                        />
                    </label>

                    <label>
                        <span>About</span>
                        <textarea
                            value={formData.about}
                            onChange={e => setFormData({ ...formData, about: e.target.value })}
                            rows="3"
                        />
                    </label>

                    <div className="form-row">
                        <label>
                            <span>BPM</span>
                            <input
                                type="number"
                                value={formData.bpm}
                                onChange={e => setFormData({ ...formData, bpm: e.target.value })}
                            />
                        </label>

                        <label>
                            <span>Key</span>
                            <input
                                type="text"
                                value={formData.key}
                                onChange={e => setFormData({ ...formData, key: e.target.value })}
                            />
                        </label>
                    </div>

                    <label>
                        <span>Lyrics</span>
                        <textarea
                            value={formData.lyrics}
                            onChange={e => setFormData({ ...formData, lyrics: e.target.value })}
                            rows="6"
                        />
                    </label>

                    <label>
                        <span>Genre</span>
                        <select
                            value={formData.genre_id}
                            onChange={e => setFormData({ ...formData, genre_id: e.target.value })}
                            required
                        >
                            <option value="">Select Genre</option>
                            {genres.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Status</span>
                        <select
                            value={formData.status_id}
                            onChange={e => setFormData({ ...formData, status_id: e.target.value })}
                            required
                        >
                            <option value="">Select Status</option>
                            {statuses.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </label>

                    <button type="submit">
                        {inEditMode ? 'Update Song' : 'Create Song'}
                    </button>
                </form>
            </div>
        </div>
    );
}