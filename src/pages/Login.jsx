import { useState } from "react";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    // ✅ TEMP AUTH (backend later)
    localStorage.setItem("token", "demo_token");

    // redirect to dashboard
    window.location.href = "/";
  }

  return (
 <div className="auth-wrapper">
  <div className="auth-card">
    <h2>Digital Detox</h2>
    <p>Sign in to track your digital habits</p>

    <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>Login</button>

    <div className="auth-footer">
      New user? <a href="/register">Register</a>
    </div>
  </div>
</div>
  
  );
}
