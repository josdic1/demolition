import { useAuth } from '../hooks/useAuth.jsx';
import { useSong } from '../hooks/useSong.jsx';
import { useState, useMemo} from 'react';
import { StateBar } from '../components/StateBar.jsx';
import { SongList } from '../components/SongList.jsx';
import { SongSearchBar } from '../components/SongSearchBar.jsx';
import { UserGenreButtons } from '../components/UserGenreButtons.jsx';
import { UserStatusButtons } from '../components/UserStatusButtons.jsx';
import '../style/HomePage.css';

export function HomePage() {
  const { userInfo, userSongs, loading, deleteSong, loggedIn } = useAuth();
  const { genres, statuses, selectedSong } = useSong();
  const [showStateBar, setShowStateBar] = useState(false);
  const [buttonValue, setButtonValue] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  

  // Clean unique extraction using Map
  const uniqueGenres = useMemo(() => {
    if (!userSongs) return [];
    const map = new Map(userSongs
      .filter(s => s.genre?.id)
      .map(s => [s.genre.id, s.genre])
    );
    return [...map.values()];
  }, [userSongs]);



  const uniqueStatuses = useMemo(() => {
    if (!userSongs) return [];
    const map = new Map(userSongs
      .filter(s => s.status?.id)
      .map(s => [s.status.id, s.status])
    );
    return [...map.values()];
  }, [userSongs]);

  const finalSongs = useMemo(() => {
    let result = userSongs || [];
    
    // Step 1: Button filter
    if (buttonValue) {
        // Check if it's a genre or status by seeing which array it's in
        const isGenre = uniqueGenres.some(g => g.id === buttonValue.id);
        const isStatus = uniqueStatuses.some(st => st.id === buttonValue.id);
        
        if (isGenre) {
            result = result.filter(s => s.genre?.id === buttonValue.id);
        } else if (isStatus) {
            result = result.filter(s => s.status?.id === buttonValue.id);
        }
    }
    
    // Step 2: Search filter
    if (searchValue) {
        result = result.filter(s =>
            s.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
            s.artist?.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
    
    // Step 3: Sort
    if (sortOrder === 'asc') {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'desc') {
        result.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    return result;
}, [userSongs, buttonValue, searchValue, sortOrder, uniqueGenres, uniqueStatuses]);

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <p className="homepage-welcome">Welcome, {userInfo?.name || 'Guest'}!</p>
        <button className="toggle-button" onClick={() => setShowStateBar(v => !v)}>
          {showStateBar ? 'Hide' : 'Show'} State Bar
        </button>
      </div>

      {showStateBar && (
        <StateBar 
          userInfo={userInfo}
          userSongs={userSongs}
          loading={loading}
          loggedIn={loggedIn}
          genres={genres}
          statuses={statuses}
          selectedSong={selectedSong}
          buttonValue={buttonValue}
          searchValue={searchValue}
          sortOrder={sortOrder}
        />
      )}

      <UserGenreButtons 
        genres={uniqueGenres}
        onSelect={setButtonValue}
        activeFilter={buttonValue}
      />

      <UserStatusButtons 
        statuses={uniqueStatuses}
        onSelect={setButtonValue}
        activeFilter={buttonValue}
      />

      {buttonValue && (
        <>
          <div className="active-filter">
            Filtering by: <strong>{buttonValue.name}</strong>
            <button onClick={() => setButtonValue(null)}>✕</button>
          </div>

          <div className="song-search-bar">
            <SongSearchBar 
              searchValue={searchValue}
              onSearch={setSearchValue}
            />
          </div>
          
          <button 
            className="sort-button"
            onClick={() => {
              if (sortOrder === '') setSortOrder('asc');
              else if (sortOrder === 'asc') setSortOrder('desc');
              else setSortOrder('');
            }}
          >
            Sort: {sortOrder === 'asc' ? '↑ A-Z' : sortOrder === 'desc' ? '↓ Z-A' : '—'}
          </button>

          <SongList songs={finalSongs} deleteSong={deleteSong} />
        </>
      )}
    </div>
  );
}