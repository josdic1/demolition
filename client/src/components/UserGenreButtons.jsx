
export function UserGenreButtons({ genres, onSelect, activeFilter }) {
  return (
    <div className="user-genre-buttons"> 
      <button
        className={`genre-button ${activeFilter === 'all' ? 'active' : ''}`} 
        onClick={() => onSelect('all')}
      >
        All Genres
      </button>
      {genres.map(genre => (
        <button
          key={genre.id}
          className={`genre-button ${activeFilter === genre.id ? 'active' : ''}`}  
          onClick={() => onSelect(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}