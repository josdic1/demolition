import { SongItem } from "./SongItem";
import '../style/SongList.css';

export function SongList({ songs, deleteSong }) {
    if (!songs || songs.length === 0) {
        return <p className="no-songs-message">No songs yet!</p>;
    }

    return (
        <div className="songlist-container">
            <table className="songlist-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Genre</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>View</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song) => (
                        <SongItem 
                            key={song.id} 
                            song={song}
                            deleteSong={deleteSong}
                        />
                    ))}
                </tbody>        
            </table>
        </div>
    )
}