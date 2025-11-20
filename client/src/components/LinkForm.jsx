import { useState } from "react";

export function LinkForm({ linkTypes = [], onAddLink }) {
    const [formData, setFormData] = useState({
        url_link: '',
        url_type: ''
    });

    // Helper: Auto-detect platform based on URL string
    const detectType = (url) => {
        const lowerUrl = url.toLowerCase();
        let detectedLabel = null;

        if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) detectedLabel = "YouTube";
        else if (lowerUrl.includes("spotify")) detectedLabel = "Spotify";
        else if (lowerUrl.includes("soundcloud")) detectedLabel = "SoundCloud";
        else if (lowerUrl.includes("apple.com")) detectedLabel = "Apple Music";
        else if (lowerUrl.includes("drive.google")) detectedLabel = "Google Drive";
        else if (lowerUrl.includes("dropbox")) detectedLabel = "Dropbox";

        // Verify the detected label actually exists in the linkTypes prop
        if (detectedLabel && linkTypes.length > 0) {
            // Find case-insensitive match in your available types
            return linkTypes.find(t => t.toLowerCase() === detectedLabel.toLowerCase()) || "";
        }
        return "";
    };

    const handleUrlChange = (e) => {
        const val = e.target.value;
        
        // 1. Update URL
        setFormData(prev => ({ ...prev, url_link: val }));

        // 2. Try to auto-detect type
        const detected = detectType(val);
        if (detected) {
            setFormData(prev => ({ ...prev, url_type: detected }));
        }
    };

    const handleTypeChange = (e) => {
        setFormData(prev => ({ ...prev, url_type: e.target.value }));
    };

    const handleAddLink = () => {
        // Validation: Ensure both fields have data
        if (!formData.url_link || !formData.url_type) return;

        onAddLink({
            url_link: formData.url_link,
            url_type: formData.url_type
        });
        
        // Reset form
        setFormData({ url_link: '', url_type: '' });
    };

    // Check if user has started typing for UI feedback
    const hasUnsavedInput = formData.url_link !== '' || formData.url_type !== '';

    return (
        <div className="link-form" style={{ marginTop: '1rem', padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <label style={{ flex: 3 }}>
                    <span>URL:</span>
                    <input 
                        type="text" 
                        name="url_link" 
                        value={formData.url_link} 
                        onChange={handleUrlChange} 
                        placeholder="https://..."
                        style={{ width: '100%' }}
                    />
                </label>

                <label style={{ flex: 1 }}>
                    <span>Type:</span>
                    <select 
                        name="url_type" 
                        value={formData.url_type} 
                        onChange={handleTypeChange}
                        style={{ width: '100%' }}
                    >
                        <option value="" disabled>Select type</option>
                        {linkTypes.map((l) => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </label>

                <button 
                    type="button" 
                    onClick={handleAddLink}
                    disabled={!formData.url_link || !formData.url_type}
                    style={{ 
                        backgroundColor: hasUnsavedInput && formData.url_link && formData.url_type ? '#2ecc71' : undefined,
                        color: hasUnsavedInput ? 'white' : undefined
                    }}
                >
                    Add
                </button>
            </div>
        </div>
    );
}