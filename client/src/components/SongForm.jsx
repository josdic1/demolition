import { useAuth } from "../hooks/useAuth";
import { useSong } from "../hooks/useSong";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GENRE_OPTIONS, STATUS_OPTIONS } from "../static/options";
import { LinkForm } from "./LinkForm";
import '../style/SongForm.css';

export function SongForm() {
    const { userInfo, userSongs, inEditMode, setInEditMode, createSong, updateSong, createLink } = useAuth();
    const { linkTypes, songKeys, fetchFormData } = useSong();
    const [originalSong, setOriginalSong] = useState(null);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [newLinks, setNewLinks] = useState([]); 
    const { id } = useParams();
    const navigate = useNavigate();

    const initialFormData = {
        title: '', artist: '', about: '', bpm: '', key: '', lyrics: '',
        genre_id: '', status_id: 1  
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {

    if (id) {
        setInEditMode(true);
    }
}, [id, setInEditMode]);

  useEffect(() => {
    fetchFormData();
  }, []);

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
                    status_id: song.status?.id || 1
                });
                setNewLinks([]);  // ✅ Add this
            }
        } else {
            setFormData(initialFormData);
            setOriginalSong(null);
            setNewLinks([]);  // ✅ Add this
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
    
    // 1. Create the song first (without links in payload)
    const payload = buildPayload();
    delete payload.links;  // Remove links from payload
    
    const newSong = await createSong(payload);
    
    // 2. Then create all the links
    await Promise.all(
        newLinks.map(link => createLink(newSong.id, link))
    );
    
    navigate('/');
};

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateSong(originalSong.id, buildPayload());
        
        // ✅ Create new links
        await Promise.all(
            newLinks.map(link => createLink(originalSong.id, link))
        );
        
        navigate('/');
        setInEditMode(false);
    };

    const handleCancel = () => {
        navigate('/');
        setInEditMode(false);
        setNewLinks([]);  // ✅ Add this
    };

    // ✅ Add this function
    const handleAddLink = (link) => {
        setNewLinks(prev => [...prev, link]);
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
                            <select
                                value={formData.key}
                                onChange={e => setFormData({ ...formData, key: e.target.value })}
                            >
                                <option value="" disabled>
                                    Choose key...
                                </option>
                                {songKeys.map(key => (
                                    <option key={key} value={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
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
                            onChange={e => setFormData({ ...formData, genre_id: Number(e.target.value) })}
                        >
                            <option value="" disabled>
                                Choose genre...
                            </option>
                            {GENRE_OPTIONS.sort((a, b) => a.label.localeCompare(b.label)).map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Status</span>
                        <select
                            value={formData.status_id}
                            onChange={e => setFormData({ ...formData, status_id: Number(e.target.value) })}
                        >
                            {STATUS_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Links</span>
                        <button type="button" onClick={() => setShowLinkForm(!showLinkForm)}>
                            {showLinkForm ? 'Hide' : 'Add'} Link
                        </button>
                    </label>

                    {/* ✅ Show existing links in edit mode */}
                  {inEditMode && originalSong?.links?.length > 0 && (
    <div className="existing-links">
        <strong>Existing Links:</strong>
        {[...originalSong.links]
            .sort((a, b) => a.url_type.localeCompare(b.url_type)) // Sort by Type
            .map(link => (
                <div key={link.id}>
                    {link.url_type}: {link.url_link}
                </div>
        ))}
    </div>
)}

                    

                    {/* ✅ Show new unsaved links */}
                   {newLinks.length > 0 && (
    <div className="new-links">
        <strong>New Links (unsaved):</strong>
        {[...newLinks]
            .sort((a, b) => a.url_type.localeCompare(b.url_type)) // Sort by Type
            .map((link, i) => (
                <div key={i}>
                                    {link.url_type}: {link.url_link}
                                    <button 
                                        type="button" 
                                        onClick={() => setNewLinks(prev => prev.filter((_, idx) => idx !== i))}
                                    >
                                        ✕
                                    </button>
                                </div>
        ))}
    </div>
)}

                    {/* ✅ Updated LinkForm props */}
                    {showLinkForm && (
                        <LinkForm
                            linkTypes={linkTypes}
                            onAddLink={handleAddLink}
                        />
                    )}

                    <div className="form-buttons">
                        <button type="button" onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit">
                            {inEditMode ? 'Update Song' : 'Create Song'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}