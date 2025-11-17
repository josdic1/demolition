import { useNavigate } from "react-router-dom";
import './SongItem.css';

export function SongItem({ song, deleteSong }) {
    const navigate = useNavigate();

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
            <td>{song.genre.name}</td>
            <td>{song.status.name}</td>
            <td className="song-item-date">
                {new Date(song.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </td>
            <td className="song-item-date">
                {new Date(song.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </td>
            <td className="song-item-actions"><button onClick={() => navigate(`/songs/${song.id}`)}>View</button></td>
            <td className="song-item-actions"><button onClick={() => navigate(`/songs/${song.id}/edit`)}>Edit</button></td>
            <td className="song-item-actions"><button onClick={handleDeleteSong}>Delete</button></td>
        </tr>
    )
}