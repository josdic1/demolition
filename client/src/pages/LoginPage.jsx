import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import '../style/LoginPage.css';

export function LoginPage() {
    const { login, loggedIn, signup, inSignupMode, setInSignupMode } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);

useEffect(() => {
        if (loggedIn) {
            navigate('/');
        }
    }, [loggedIn, navigate]);


 const onSignUpClick = (e) => {
  e.preventDefault();  
  setInSignupMode(true);
}
console.log(inSignupMode)
   const onFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        let result;
        if (inSignupMode) {
            result = await signup(formData);
        } else {
            result = await login(formData);
        }
    
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };


   return (
  <div className="login-page-container">
    <div className="login-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}
        
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={onFormChange}
          required
        />
        
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={onFormChange}
          required
        />
        
        <button type="submit">{inSignupMode ? 'Sign up' : 'Login'}</button>
        
        {inSignupMode ? "" :<p>Don't have an account? <button type="button" onClick={onSignUpClick}>Sign up</button></p>}
      </form>
    </div>
  </div>
);
}