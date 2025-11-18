import { useAuth } from '../hooks/useAuth.jsx';
import { useSong } from '../hooks/useSong.jsx';
import { useState } from 'react';
import { StateBar } from '../components/StateBar.jsx';
import { SongList } from '../components/SongList.jsx';
import '../style/HomePage.css';

export function HomePage() {
  const { userInfo, userSongs, loading, loggedIn, inEditMode, deleteSong } = useAuth();
  const { genres, statuses, selectedSong } = useSong();
  const [showStateBar, setShowStateBar] = useState(false);
  const [showSongList, setShowSongList] = useState(true);

  return (
    <div className="homepage-container">
        <div className="homepage-header">
            <p className="homepage-welcome">Welcome, {userInfo ? userInfo.name : 'Guest'}!</p>
            <div className="homepage-controls">
                <button className="toggle-button" onClick={() => setShowStateBar(!showStateBar)}>
                    {showStateBar ? 'Hide' : 'Show'} State Bar
                </button>
                <button className="toggle-button" onClick={() => setShowSongList(!showSongList)}>
                    {showSongList ? 'Hide' : 'Show'} Song List
                </button>
            </div>
        </div>

        {showStateBar && <StateBar 
          userInfo={userInfo}
          userSongs={userSongs}
          loading={loading}
          loggedIn={loggedIn}
          inEditMode={inEditMode}
          genres={genres}
          statuses={statuses}
          selectedSong={selectedSong}
        />}

        {showSongList && <SongList 
            songs={userSongs || []} 
            deleteSong={deleteSong}
        />}
    </div>
  );
}