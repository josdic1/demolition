
import { useAuth } from '../hooks/useAuth.jsx';
import { useSong } from '../hooks/useSong.jsx';


export function Overview() {
  const { userInfo, userSongs, loading, loggedIn, inEditMode } = useAuth();
  const { genres, statuses, selectedSong } = useSong();



const userGenres = new Set(userSongs.map(u => u.genre.name))
    const userGenreData = [...userGenres]

const userStauses = new Set(userSongs.map(u => u.status.name))
    const userStatusData = [...userStauses]

let totalLinkCount = 0;
    userSongs.forEach(song => {if (song.links) {totalLinkCount += song.links.length;}});


  return (
    <div className="statebar-container">
        <table className="statebar-table">
            <thead>
                <tr>
                    <th className="section-header">AUTH</th>
                    <th>UserInfo</th>
                    <th>Loading</th>
                    <th>Logged In</th>
                    <th>Edit Mode</th>
                    <th className="section-header">SONG TOT.</th>
                    <th>Genres</th>
                    <th>Statuses</th>
                    <th>Links</th>
                    <th>Local Storage</th>
                    {/* <th className="section-header"> SEARCH FILTERS </th>
                    <th>Button Value</th>
                    <th>Search Value</th> */}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="section-divider"></td>
                    <td>
                        {userInfo?.name || '—'} 
                        <span className="id-badge">#{userInfo?.id || '—'}</span>
                    </td>
                    <td className={loading ? 'status-true' : 'status-false'}>
                        {loading ? '●' : '○'}
                    </td>
                    <td className={loggedIn ? 'status-true' : 'status-false'}>
                        {loggedIn ? '✓' : '✗'}
                    </td>
                    <td className={inEditMode ? 'status-true' : 'status-false'}>
                        {inEditMode ? '✓' : '✗'}
                    </td>
                    <td className="section-divider">{userSongs?.length || 0}</td>
                    
                    <td>{userGenreData?.length || 0}</td>
                    <td>{userStatusData?.length || 0}</td>
                    <td>{totalLinkCount || 0}</td> 
                   <td>{window.localStorage.length}</td>
                     
                </tr>
            </tbody>
        </table>
    </div>
  );
}
