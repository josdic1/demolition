import '../style/UserButtons.css';

export function UserStatusButtons({ statuses, onSelect, activeFilter }) {
  return (
    <div className="user-status-buttons">  
      <button
        className={`status-button ${activeFilter === 'all' ? 'active' : ''}`}  
        onClick={() => onSelect('all')}
      >
        All Statuses
      </button>
      {statuses.map(status => (
        <button
          key={status.id}
          className={`status-button ${activeFilter === status.id ? 'active' : ''}`} 
          onClick={() => onSelect(status.id)}
        >
          {status.name}
        </button>
      ))}
    </div>
  );
}