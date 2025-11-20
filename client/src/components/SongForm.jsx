import { useAuth } from "../hooks/useAuth";
import { useSong } from "../hooks/useSong";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GENRE_OPTIONS, STATUS_OPTIONS } from "../static/options";
import { LinkForm } from "../components/LinkForm"; // Adjusted path assuming components folder
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
        
        // 1. Create the song first (without links in payload)
        const payload = buildPayload();
        // Ensure we don't accidentally send links array in the song body
        
        const newSong = await createSong(payload);
        
        // 2. Then create all the links associated with the new song ID
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
        
        // Create new links
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
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem'}}>
                            <label style={{margin: 0}}>Links</label>
                            <button type="button" onClick={() => setShowLinkForm(!showLinkForm)} className="secondary-btn">
                                {showLinkForm ? 'Hide Link Form' : '+ Add Link'}
                            </button>
                        </div>

                        {/* 1. Existing Links (DB) */}
                        {inEditMode && originalSong?.links?.length > 0 && (
                            <div className="existing-links" style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                                <small style={{ fontWeight: 'bold', color: '#666' }}>SAVED LINKS</small>
                                {[...originalSong.links]
                                    .sort((a, b) => a.url_type.localeCompare(b.url_type))
                                    .map(link => (
                                        <div key={link.id} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', marginTop: '4px' }}>
                                            <span style={{ fontWeight: 'bold', minWidth: '80px' }}>{link.url_type}:</span>
                                            <a href={link.url_link} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>
                                                {link.url_link}
                                            </a>
                                        </div>
                                ))}
                            </div>
                        )}

                        {/* 2. New Links (Pending Save) */}
                        {newLinks.length > 0 && (
                            <div className="new-links" style={{ marginTop: '10px', padding: '10px', background: '#fff4e5', borderRadius: '4px', border: '1px solid #ffe0b2' }}>
                                <small style={{ fontWeight: 'bold', color: '#e65100' }}>TO BE ADDED (Click Save to confirm)</small>
                                {[...newLinks]
                                    .sort((a, b) => a.url_type.localeCompare(b.url_type))
                                    .map((link, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.9rem' }}>
                                                <strong>{link.url_type}:</strong> {link.url_link}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={() => setNewLinks(prev => prev.filter((_, idx) => idx !== i))}
                                                style={{ padding: '0 5px', marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
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

                    <div className="form-buttons" style={{ marginTop: '2rem' }}>
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