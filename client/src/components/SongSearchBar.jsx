import { useState, useEffect } from 'react';
import '../style/SongSearchBar.css';

export function SongSearchBar({ searchValue, onSearch }) {

    const onChange = (e) => {
        onSearch(e.target.value);
    };

   

  return (
    <div className="song-search-bar">
      <input
        type="text"
        placeholder="Search by title, artist, BPM, key, lyrics..."
        value={searchValue}
        onChange={onChange}
      />
      {searchValue && (
        <button 
          className="clear-search" 
          onClick={() => onSearch('')}
        >
          ×
        </button>
      )}

    </div>
  );
}