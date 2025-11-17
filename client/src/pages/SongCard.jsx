import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './SongCard.css';

export function SongCard({ onEdit, onDelete }) {
  const { userSongs } = useAuth();
  const { id } = useParams();
    const navigate = useNavigate();

  const song = userSongs.find((s) => s.id === Number(id));
  console.log(song.links)
  if (!song) return <div>Song not found</div>;

  const handleEdit = () => onEdit(song.id);
  const handleDelete = () => onDelete(song.id);
console.log(song.links)
  return (
    <div className="song-card">
      <h3>{song.title}</h3>
      <p>Artist: {song.artist}</p>
      <p>Genre: {song.genre?.name ?? '—'}</p>
      <p>Status: {song.status?.name ?? '—'}</p>
      <p>About: {song.about ?? '—'}</p>
      <p>Key/bpm: {song.key ?? '—'}/{song.bpm ?? '—'}</p>
      <p>Lyrics: {song.lyrics ?? '—'}</p>
      <p>Created: {new Date(song.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}</p>
        <p>Updated: {new Date(song.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}</p>
      <div className="song-card-buttons">
  {(song.links ?? []).map(link => (
    <button
      key={link.id}
      onClick={() => window.open(link.url_link, '_blank', 'noopener,noreferrer')}
      className="link-btn"
    >
      {link.url_type}
    </button>
  ))}
</div>
      <div className="song-card-buttons">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}