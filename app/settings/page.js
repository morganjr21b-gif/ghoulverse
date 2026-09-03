"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Settings() {
  const [readingDirection, setReadingDirection] = useState("vertical");
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);

  const [activePanel, setActivePanel] = useState(null); // "profile" | "password" | "privacy" | null

  const [username, setUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleSaveProfile() {
    const { error } = await supabase.auth.updateUser({ data: { username } });
    setProfileMsg(error ? "Error: " + error.message : "Profile updated!");
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordMsg(error ? "Error: " + error.message : "Password changed!");
    if (!error) setNewPassword("");
  }

  return (
    <main style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Settings</h1>

      <div style={section}>
        <div style={sectionTitle}>Preferences</div>

        <div style={row}>
          <span>Dark Mode</span>
          <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>

        <div style={{ ...row, alignItems: "flex-start" }}>
          <div>
            <div>Ghost Mode</div>
            <div style={{ fontSize: 11, color: "#8a8a99", marginTop: 2 }}>Immersive reading experience</div>
          </div>
          <Toggle checked={ghostMode} onChange={() => setGhostMode(!ghostMode)} />
        </div>

        <div style={row}>
          <span>Reading Direction</span>
          <select value={readingDirection} onChange={(e) => setReadingDirection(e.target.value)} style={select}>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>

        <div style={row}>
          <span>Language</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={select}>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Japanese</option>
            <option>Korean</option>
          </select>
        </div>
      </div>

      <div style={section}>
        <div style={sectionTitle}>Account</div>

        <button style={linkRow} onClick={() => setActivePanel(activePanel === "profile" ? null : "profile")}>
          Edit Profile
        </button>
        {activePanel === "profile" && (
          <div style={panel}>
            <input
              style={input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSaveProfile} style={saveBtn}>Save</button>
            {profileMsg && <p style={msgText}>{profileMsg}</p>}
          </div>
        )}

        <button style={linkRow} onClick={() => setActivePanel(activePanel === "password" ? null : "password")}>
          Change Password
        </button>
        {activePanel === "password" && (
          <div style={panel}>
            <input
              style={input}
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword} style={saveBtn}>Update Password</button>
            {passwordMsg && <p style={msgText}>{passwordMsg}</p>}
          </div>
        )}

        <button style={linkRow} onClick={() => setActivePanel(activePanel === "privacy" ? null : "privacy")}>
          Privacy & Security
        </button>
        {activePanel === "privacy" && (
          <div style={panel}>
            <p style={{ fontSize: 13, color: "#c9c9d6", lineHeight: 1.6 }}>
              Your email is only visible to you. Series and comments you post are public.
              Account data is stored securely with Supabase. Contact support to request account deletion.
            </p>
          </div>
        )}

        <button onClick={handleLogout} style={logoutBtn}>Log Out</button>
      </div>
    </main>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: checked ? "#E63946" : "#333",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          transition: "left 0.15s",
        }}
      />
    </button>
  );
}

const section = { background: "#161616", border: "1px solid #262626", borderRadius: 10, padding: 16, marginBottom: 16 };
const sectionTitle = { fontSize: 12, color: "#8a8a99", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 };
const row = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1f1f1f" };
const select = { background: "#0D0D0D", color: "white", border: "1px solid #262626", borderRadius: 6, padding: "6px 10px" };
const linkRow = { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #1f1f1f", color: "white", padding: "12px 0", fontSize: 14, cursor: "pointer" };
const panel = { padding: "12px 0", borderBottom: "1px solid #1f1f1f" };
const input = { width: "100%", padding: 10, borderRadius: 6, border: "1px solid #262626", background: "#0D0D0D", color: "white", boxSizing: "border-box", marginBottom: 8 };
const saveBtn = { padding: "8px 16px", borderRadius: 6, border: "none", background: "#E63946", color: "white", fontWeight: "bold", fontSize: 13, cursor: "pointer" };
const msgText = { fontSize: 12, color: "#8a8a99", marginTop: 8 };
const logoutBtn = { width: "100%", marginTop: 16, padding: 10, borderRadius: 6, border: "1px solid #E63946", background: "none", color: "#E63946", fontWeight: "bold", cursor: "pointer" };
