import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        login({
            email: formData.get('email'),
            password: formData.get('password')
        });
    };

    return (
      <>
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    );
}