import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../style/SongItem.css';


export function SongItem({ song, deleteSong }) {
    const { setInEditMode } = useAuth();
    const [showLinks, setShowLinks] = useState({});
    const navigate = useNavigate();


    function onEditClick() {
        setInEditMode(true);
        navigate(`/songs/${song.id}/edit`)
    } 
    async function handleDeleteSong() {
        if (!confirm(`Delete "${song.title}"?`)) return;
        
        try {
            await deleteSong(song.id);
        } catch (error) {
            alert('Failed to delete song');
        }
    }

    return (
<tr className="song-item-row" id={song.id}>
    <td>{song.title}</td>
    <td>{song.artist}</td>
    <td>{song.genre?.name || 'Unknown'}</td>
    <td>{song.status?.name || 'Unknown'}</td>
    <td className="song-item-actions">
        {song.links.length > 0 && (
            <>
                <button onClick={() => setShowLinks(prev => ({ ...prev, [song.id]: !prev[song.id] }))} className="links-toggle">
                    🔗 {song.links.length}
                </button>
                {showLinks[song.id] && (
                    <div className="links-bubble">
                        {song.links.map(link => (
                            <a key={link.id} href={link.url_link.startsWith('http') ? link.url_link : `https://${link.url_link}`} target="_blank" rel="noopener noreferrer" className="link-button">
                                {link.url_type}
                            </a>
                        ))}
                    </div>
                )}
            </>
        )}
    </td>
    <td className="song-item-actions"><button onClick={() => navigate(`/songs/${song.id}`)}>View</button></td>
    <td className="song-item-actions"><button onClick={onEditClick}>Edit</button></td>
    <td className="song-item-actions"><button onClick={handleDeleteSong}>Delete</button></td>
        <td className="song-item-date">
        {new Date(song.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
    </td>
   <td className="song-item-date">
    {song.updated_at 
        ? new Date(song.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
        : '-'} 
</td>
</tr>
    )
}