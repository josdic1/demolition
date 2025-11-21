


export function StateBar({ userInfo, userSongs,loading, loggedIn, inEditMode, genres, statuses, selectedSong, buttonValue, searchValue, sortOrder }) {

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
                    <th className="section-header">SONG DATA</th>
                    <th>Genres</th>
                    <th>Statuses</th>
                    <th>Links</th>
                    <th>Selected</th>
                    <th className="section-header"> SEARCH FILTERS </th>
                    <th>Button Value</th>
                    <th>Search Value</th>
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
                    
                    <td>{genres?.length || 0}</td>
                    <td>{statuses?.length || 0}</td>
                    <td>{userSongs.links?.length || 0}</td> 
                    <td>{selectedSong?.title || '—'}</td>
                      <td className="section-divider">{sortOrder || '—'}</td>
                        <td>{buttonValue?.name || '—'}</td>
                        <td>{searchValue || '—'}</td> 
                </tr>
            </tbody>
        </table>
    </div>
  );
}