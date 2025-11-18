
import '../style/UserButtons.css';

export function UserGenreButtons({ genres, onSelect }) {
    if (!genres || genres.length === 0) {
        return <p>No genres available.</p>;
    }

    return (
        <div className="user-genre-buttons">
            {genres.map((genre) => (
                <button 
                    key={genre.id} 
                    className="genre-button" 
                    onClick={() => onSelect(genre)}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
}