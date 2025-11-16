import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const result = await login({
            email: formData.get('email'),
            password: formData.get('password')
        });
        
        if (result.success) {
            console.log("Login successful");
            navigate('/');  // Redirect to wherever
        } else {
            console.error("Login failed:", result.error);
            // Show error to user
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}