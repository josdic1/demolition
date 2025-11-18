import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import '../style/SongCard.css';

export function SongCard() {
  const { userSongs, deleteSong } = useAuth();
  const { id } = useParams();
    const navigate = useNavigate();

  const song = userSongs.find((s) => s.id === Number(id));

  if (!song) return <div>Song not found</div>;


return (
  <div className="song-card">
    <h3>{song.title}</h3>
    <p>Artist: {song.artist}</p>
    <p>Genre: {song.genre?.name ?? '—'}</p>
    <p>Status: {song.status?.name ?? '—'}</p>
    <p>About: {song.about ?? '—'}</p>
    <p>Key/BPM: {song.key ?? '—'} / {song.bpm ?? '—'}</p>
    <p>Lyrics: {song.lyrics ?? '—'}</p>
    <p>Created: {new Date(song.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })}</p>
    <p>Updated: {new Date(song.updated_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })}</p>

    {/* Links Section */}
    <div className="song-card-buttons">
      {(song.links ?? []).length > 0 ? (
        song.links.map(link => (
          <button
            key={link.id}
            onClick={() => window.open(link.url_link, '_blank', 'noopener,noreferrer')}
            className="link-btn"
          >
            {link.url_type}
          </button>
        ))
      ) : (
        <em style={{ color: '#999', fontSize: '0.9rem' }}>No links added yet</em>
      )}
    </div>

    {/* Edit / Delete Buttons */}
    <div className="song-card-buttons">
      <button onClick={() => navigate(`/songs/${song.id}/edit`)}>Edit</button>
      <button onClick={() => deleteSong(song.id)}>Delete</button>
    </div>
  </div>
);
}