import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);


   const onFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        const result = await login(formData); 
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <input name="email" type="email" onChange={onFormChange} value={formData.email} placeholder="Email" required />
                <input name="password" type="password" onChange={onFormChange} value={formData.password} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}