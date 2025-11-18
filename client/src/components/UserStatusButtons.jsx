import '../style/UserButtons.css';

export function UserStatusButtons({ statuses, onSelect }) {
    if (!statuses || statuses.length === 0) {
        return <p>No statuses available.</p>;
    }

    return (
        <div className="user-status-buttons">
            {statuses.map((status) => (
                <button 
                    key={status.id} 
                    className="status-button" 
                    onClick={() => onSelect(status)}
                >
                    {status.name}
                </button>
            ))}
        </div>
    );
}