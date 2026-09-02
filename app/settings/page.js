"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Settings() {
  const [readingDirection, setReadingDirection] = useState("vertical");

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Settings</h1>

      <div style={section}>
        <div style={sectionTitle}>Preferences</div>
        <div style={row}>
          <span>Reading Direction</span>
          <select
            value={readingDirection}
            onChange={(e) => setReadingDirection(e.target.value)}
            style={select}
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
      </div>

      <div style={section}>
        <div style={sectionTitle}>Account</div>
        <button onClick={handleLogout} style={logoutBtn}>Log Out</button>
      </div>
    </main>
  );
}

const section = { background: "#161616", border: "1px solid #262626", borderRadius: 10, padding: 16, marginBottom: 16 };
const sectionTitle = { fontSize: 12, color: "#8a8a99", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 };
const row = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" };
const select = { background: "#0D0D0D", color: "white", border: "1px solid #262626", borderRadius: 6, padding: "6px 10px" };
const logoutBtn = { width: "100%", padding: 10, borderRadius: 6, border: "1px solid #E63946", background: "none", color: "#E63946", fontWeight: "bold", cursor: "pointer" };
