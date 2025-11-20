import { useAuth } from "../hooks/useAuth";
import { useSong } from "../hooks/useSong";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ARTIST_OPTIONS, GENRE_OPTIONS, STATUS_OPTIONS } from "../static/options";
import { LinkForm } from "../components/LinkForm"; 
import '../style/SongForm.css';

export function SongForm() {
    const { userInfo, userSongs, inEditMode, setInEditMode, createSong, updateSong, createLink } = useAuth();
    const { linkTypes, songKeys, fetchFormData } = useSong();
    const [originalSong, setOriginalSong] = useState(null);
    const [showLinkForm, setShowLinkForm] = useState(true);
    const [newLinks, setNewLinks] = useState([]); 
    const [artistMatch, setArtistMatch] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const initialFormData = {
        title: '', artist: '', about: '', bpm: '', key: '', lyrics: '',
        genre_id: '', status_id: 1  
    };

    const [formData, setFormData] = useState(initialFormData);
    const artists = ARTIST_OPTIONS // artists is a static array of ARTIST_OPTIONS

    // 1. Set Edit Mode based on URL param
    useEffect(() => {
        if (id) {
            setInEditMode(true);
        }
    }, [id, setInEditMode]);

    // 2. Fetch Link Types / Keys on mount
    useEffect(() => {
        fetchFormData();
    }, []);

    // 3. Populate Form Data if in Edit Mode
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
                setNewLinks([]); 
            }
        } else {
            setFormData(initialFormData);
            setOriginalSong(null);
            setNewLinks([]); 
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
        
        const payload = buildPayload();
        const newSong = await createSong(payload);
        
        if (newLinks.length > 0) {
            await Promise.all(
                newLinks.map(link => createLink(newSong.id, link))
            );
        }
        
        navigate('/');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateSong(originalSong.id, buildPayload());
        
        if (newLinks.length > 0) {
            await Promise.all(
                newLinks.map(link => createLink(originalSong.id, link))
            );
        }
        
        navigate('/');
        setInEditMode(false);
    };

    const handleCancel = () => {
        navigate('/');
        setInEditMode(false);
        setNewLinks([]); 
    };

    const handleAddLink = (link) => {
        setNewLinks(prev => [...prev, link]);
    };

    const onArtistInput = (e) => {
        const value = e.target.value;

        setFormData(prev => ({ ...prev, artist: value }));

        if (!value.trim()) {
            setArtistMatch([]);
            return;
        }

        const filtered = ARTIST_OPTIONS.filter(artist =>
            artist.label.toLowerCase().includes(value.toLowerCase())
        );

        setArtistMatch(filtered);
    };

    return (
        <div className="song-form-page">
            <div className="song-form-card">
                <button onClick={() => navigate('/')} className="back-btn">
                    ← Back to Songs
                </button>
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
                            onChange={onArtistInput}
                            required
                        />
                        {artistMatch && artistMatch.length > 0 && (
                            <div className="artist-suggestions">
                                {artistMatch.map(artist => (
                                    <div 
                                        key={artist.value}
                                        className="artist-suggestion-item"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, artist: artist.label }));
                                            setArtistMatch([]);
                                        }}
                                    >
                                        {artist.label}
                                    </div>
                                ))}
                            </div>
                        )}
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
                                <option value="" disabled>Choose key...</option>
                                {songKeys.map(key => (
                                    <option key={key} value={key}>{key}</option>
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
                            <option value="" disabled>Choose genre...</option>
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

                    {/* Links Section */}
                    <div className="links-section">
                        <div className="links-header">
                            <label>Links</label>
                            <button type="button" onClick={() => setShowLinkForm(!showLinkForm)} className="secondary-btn">
                                {showLinkForm ? 'Hide Link Form' : '+ Add Link'}
                            </button>
                        </div>

                        {/* 1. Existing Links (DB) */}
                        {inEditMode && originalSong?.links?.length > 0 && (
                            <div className="saved-links-container">
                                <small className="links-label">SAVED LINKS</small>
                                {[...originalSong.links]
                                    .sort((a, b) => a.url_type.localeCompare(b.url_type))
                                    .map(link => (
                                        <div key={link.id} className="link-item">
                                            <span className="link-type">{link.url_type}:</span>
                                            <a href={link.url_link} target="_blank" rel="noreferrer" className="link-url">
                                                {link.url_link}
                                            </a>
                                        </div>
                                ))}
                            </div>
                        )}

                        {/* 2. New Links (Pending Save) */}
                        {newLinks.length > 0 && (
                            <div className="pending-links-container">
                                <small className="links-label">TO BE ADDED (Click Save to confirm)</small>
                                {[...newLinks]
                                    .sort((a, b) => a.url_type.localeCompare(b.url_type))
                                    .map((link, i) => (
                                        <div key={i} className="pending-link-item">
                                            <span className="pending-link-text">
                                                <strong>{link.url_type}:</strong> {link.url_link}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={() => setNewLinks(prev => prev.filter((_, idx) => idx !== i))}
                                                className="remove-link-btn"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                ))}
                            </div>
                        )}

                        {/* 3. The Form Component */}
                        {showLinkForm && (
                            <LinkForm
                                linkTypes={linkTypes}
                                onAddLink={handleAddLink}
                            />
                        )}
                    </div>

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