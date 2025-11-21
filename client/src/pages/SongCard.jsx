import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';


export function SongCard() {
  const { userSongs, deleteSong, setInEditMode } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const song = userSongs.find((s) => s.id === Number(id));

  if (!song) return <div>Song not found</div>;

  const onEditClick = () => {
    setInEditMode(true);
    navigate(`/songs/${song.id}/edit`);
  };

  const handleDeleteSong = async () => {
    if (!confirm(`Delete "${song.title}"?`)) return;

    try {
      await deleteSong(song.id);
      navigate('/');
    } catch (error) {
      alert('Failed to delete song');
    }
  };

  return (
    <div className="song-card">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Songs
      </button>
      
      <h3>{song.title}</h3>
      <p>Artist: {song.artist}</p>
      <p>Genre: {song.genre?.name ?? '—'}</p>
      <p>Status: {song.status?.name ?? '—'}</p>
      <p>About: {song.about ?? '—'}</p>
      <p>Key/BPM: {song.key ?? '—'} / {song.bpm ?? '—'}</p>
      <p>Lyrics: {song.lyrics ?? '—'}</p>
      <p>
        Created:{' '}
        {new Date(song.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
      <p>
        Updated:{' '}
        {new Date(song.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>

      {/* Links */}
      <div className="song-card-buttons">
        {(song.links ?? []).length > 0 ? (
          song.links.map((link) => (
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

      {/* Edit / Delete */}
      <div className="song-card-buttons">
        <button onClick={onEditClick}>Edit</button>
        <button onClick={handleDeleteSong}>Delete</button>
      </div>
    </div>
  );
}