"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created! Check your email to confirm, then log in.");
    }
  }

  return (
    <main style={wrap}>
      <div style={card}>
        <h1>Sign Up</h1>
        <input style={input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button style={button} onClick={handleSignup}>Create Account</button>
        {message && <p style={{ color: "#c9c9d6", marginTop: 12, fontSize: 14 }}>{message}</p>}
      </div>
    </main>
  );
}

const wrap = { display: "flex", justifyContent: "center", padding: 40 };
const card = { background: "#161616", padding: 30, borderRadius: 12, width: 320 };
const input = { width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #262626", background: "#0D0D0D", color: "white", boxSizing: "border-box" };
const button = { width: "100%", padding: 10, borderRadius: 6, border: "none", background: "#E63946", color: "white", fontWeight: "bold", cursor: "pointer" };
