import { useState, useEffect } from "react"

export function LinkForm({ linkTypes = [] }) {
    const [formData, setFormData] = useState({
        url_link: '',
        url_type: ''
    })


const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: value 
        }));
  };




 return (
    <>

  <div className="link-form">
        <label htmlFor="url_link">URL:</label>
        <input type="text" name="url_link" value={formData.url_link} onChange={onChange} />

        <label htmlFor="url_type">Description:</label>
                <select name="url_type" value={formData.url_type} onChange={onChange}>
                    <option value="" disabled>Select a type</option>
                    {linkTypes.map((l) => (
                        <option key={l} value={l}>
                            {l}
                        </option>
                    ))}
                </select>

        <button type="submit">Submit</button>
</div>
    </>
 )

}
