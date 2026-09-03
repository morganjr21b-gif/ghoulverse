"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <main style={wrap}>
      <div style={card}>
        <h1>Log In</h1>
        <input
          style={input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={button} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        {message && (
          <p style={{ color: "#f87171", marginTop: 12, fontSize: 14 }}>{message}</p>
        )}
        <p style={{ marginTop: 16, fontSize: 13, color: "#8a8a99" }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#E63946" }}>Sign up</a>
        </p>
      </div>
    </main>
  );
}

const wrap = { display: "flex", justifyContent: "center", padding: 40 };
const card = { background: "#161616", padding: 30, borderRadius: 12, width: 320 };
const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #262626",
  background: "#0D0D0D",
  color: "white",
  boxSizing: "border-box",
};
const button = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "none",
  background: "#E63946",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};
