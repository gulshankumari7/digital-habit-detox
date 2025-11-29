import { useState } from "react";
import "../App.css";
import API_URL from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    // ✅ FRONTEND VALIDATION
    if (email.trim() === "" || password.trim() === "") {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registered successfully ✅");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>

        {/* ✅ EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ PASSWORD (THIS WAS THE ISSUE) */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="auth-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
