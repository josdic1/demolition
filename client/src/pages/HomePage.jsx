import { useAuth } from '../hooks/useAuth.jsx';
import { useSong } from '../hooks/useSong.jsx';

export function HomePage() {
  const { user } = useAuth();
  const { selectedSong } = useSong();

  return (
    <>
    <div>
      <ul>
        <li>Welcome, {user ? user.name : 'Guest'}!</li>
        <li>Selected Song: {selectedSong ? selectedSong.title : 'No song selected'}</li>  
      </ul>
      <ol>
      {user?.songs?.length > 0 ? (
  user.songs.map((song) => (
    <li key={song.id}>{song.title}</li>
  ))
) : (
  <li>No songs available.</li>
)}
      </ol>
    </div>
    </>
  );
}       