
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(){

  const [error,setError] = useState("");
  const navigate = useNavigate();

  const login = () => {
    const token = "mock_token";
    localStorage.setItem("token", token);
    navigate("/admin");
  }

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <p>{error}</p>}
      <input placeholder="username" />
      <input placeholder="password" type="password"/>
      <button onClick={login}>Daxil ol</button>
    </div>
  )
}
