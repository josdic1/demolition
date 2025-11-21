import { useAuth } from '../hooks/useAuth.jsx';
import { useSong } from '../hooks/useSong.jsx';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SongList } from '../components/SongList.jsx';
import { SongSearchBar } from '../components/SongSearchBar.jsx';
import { UserGenreButtons } from '../components/UserGenreButtons.jsx';
import { UserStatusButtons } from '../components/UserStatusButtons.jsx';
import { Plus } from 'lucide-react';



export function HomePage() {
  const { userInfo, userSongs, loading, deleteSong, loggedIn } = useAuth();
  const { genres, statuses } = useSong();
  const [selectedGenre, setSelectedGenre] = useState('all');  
  const [selectedStatus, setSelectedStatus] = useState('all'); 
  const [searchValue, setSearchValue] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();
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
    
    // Filter by both genre AND status
    result = result.filter(song => {
      const matchesGenre = selectedGenre === 'all' || song.genre?.id === selectedGenre;
      const matchesStatus = selectedStatus === 'all' || song.status?.id === selectedStatus;
      return matchesGenre && matchesStatus;  // ← Both must match!
    });
    
    // Search filter
    if (searchValue) {
      result = result.filter(s =>
        s.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.artist?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    // Sort
    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title));
    }
    
    return result;
  }, [userSongs, selectedGenre, selectedStatus, searchValue, sortOrder]);



  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <p className="homepage-welcome">Welcome, {userInfo?.name || 'Guest'}!</p>

      </div>

 

      <UserGenreButtons 
        genres={uniqueGenres}
        onSelect={setSelectedGenre}      
        activeFilter={selectedGenre}     
      />

      <UserStatusButtons 
        statuses={uniqueStatuses}
        onSelect={setSelectedStatus}   
        activeFilter={selectedStatus}    
      />

      {/* Show active filters */}
      {(selectedGenre !== 'all' || selectedStatus !== 'all') && (
        <div className="active-filters">
          <span>Filtering by:</span>
          {selectedGenre !== 'all' && (
            <div className="filter-tag">
              <strong>{uniqueGenres.find(g => g.id === selectedGenre)?.name}</strong>
              <button onClick={() => setSelectedGenre('all')}>✕</button>
            </div>
          )}
          {selectedStatus !== 'all' && (
            <div className="filter-tag">
              <strong>{uniqueStatuses.find(s => s.id === selectedStatus)?.name}</strong>
              <button onClick={() => setSelectedStatus('all')}>✕</button>
            </div>
          )}
        </div>
      )}

      <div className="song-search-bar">
        <SongSearchBar 
          searchValue={searchValue}
          onSearch={setSearchValue}
        />
      </div>
      <div className="controls-header">
      <button type="button" className='add-button' onClick={() => navigate('/songs')}> <Plus size={18} strokeWidth={3} /> 
        <span>Add New</span></button>
       
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
</div>
      <SongList songs={finalSongs} deleteSong={deleteSong} />

      {finalSongs.length === 0 && (
        <p className="no-songs">No songs match your filters.</p>
      )}
    </div>
  );
}