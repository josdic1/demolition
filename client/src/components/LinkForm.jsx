import { useState } from "react";

export function LinkForm({ linkTypes = [], onAddLink }) {
    const [formData, setFormData] = useState({
        url_link: '',
        url_type: ''
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLink = () => {
        // Prevent adding empty links if you want (Optional)
        if (!formData.url_link && !formData.url_type) return;

        onAddLink({
            url_link: formData.url_link,
            url_type: formData.url_type
        });
        setFormData({ url_link: '', url_type: '' });
    };

    // Check if user has started typing
    const hasUnsavedInput = formData.url_link !== '' || formData.url_type !== '';

    return (
        <div className="link-form">
            <label htmlFor="url_link">URL:</label>
            <input 
                type="text" 
                name="url_link" 
                value={formData.url_link} 
                onChange={onChange} 
            />

            <label htmlFor="url_type">Type:</label>
            <select 
                name="url_type" 
                value={formData.url_type} 
                onChange={onChange}
            >
                <option value="" disabled>Select a type</option>
                {linkTypes.map((l) => (
                    <option key={l} value={l}>{l}</option>
                ))}
            </select>

            <button 
                type="button" 
                onClick={handleAddLink}
                // Optional: add a specific class style when it needs confirmation
                style={{ backgroundColor: hasUnsavedInput ? '#e69e00' : undefined }}
            >
                {hasUnsavedInput ? 'Confirm Link' : 'Add Link'}
            </button>
        </div>
    );
}