"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { colors, radii } from "../../lib/theme";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [readingDirection, setReadingDirection] = useState("vertical");
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);

  const [activePanel, setActivePanel] = useState(null);
  const [username, setUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setUsername(data.user.user_metadata?.username || "");
      }
    }
    load();

    // Restore preferences
    if (typeof window !== "undefined") {
      setReadingDirection(localStorage.getItem("gv_reading_direction") || "vertical");
      setLanguage(localStorage.getItem("gv_language") || "English");
      setGhostMode(localStorage.getItem("gv_ghost_mode") === "1");
    }
  }, []);

  function savePref(key, value) {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleSaveProfile() {
    const { error } = await supabase.auth.updateUser({ data: { username: username.trim() } });
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
    <main style={{ padding: "20px 16px 40px", maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Settings</h1>

      {/* Preferences */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Preferences</div>

        <div style={styles.row}>
          <div>
            <div style={styles.rowLabel}>Dark Mode</div>
          </div>
          <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>

        <div style={styles.row}>
          <div>
            <div style={styles.rowLabel}>Ghost Mode</div>
            <div style={styles.rowSub}>Immersive reading experience</div>
          </div>
          <Toggle
            checked={ghostMode}
            onChange={() => {
              const next = !ghostMode;
              setGhostMode(next);
              savePref("gv_ghost_mode", next ? "1" : "0");
            }}
          />
        </div>

        <div style={styles.row}>
          <span style={styles.rowLabel}>Reading Direction</span>
          <select
            value={readingDirection}
            onChange={(e) => {
              setReadingDirection(e.target.value);
              savePref("gv_reading_direction", e.target.value);
            }}
            style={styles.select}
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>

        <div style={{ ...styles.row, borderBottom: "none" }}>
          <span style={styles.rowLabel}>Language</span>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              savePref("gv_language", e.target.value);
            }}
            style={styles.select}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Japanese</option>
            <option>Korean</option>
          </select>
        </div>
      </div>

      {/* Account */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Account</div>

        <button
          style={styles.linkRow}
          onClick={() => setActivePanel(activePanel === "profile" ? null : "profile")}
        >
          <span>Edit Profile</span>
          <span style={{ color: colors.textMuted }}>›</span>
        </button>
        {activePanel === "profile" && (
          <div style={styles.panel}>
            <input
              style={styles.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSaveProfile} style={styles.saveBtn}>
              Save
            </button>
            {profileMsg && <p style={styles.msg}>{profileMsg}</p>}
          </div>
        )}

        <button
          style={styles.linkRow}
          onClick={() => setActivePanel(activePanel === "password" ? null : "password")}
        >
          <span>Change Password</span>
          <span style={{ color: colors.textMuted }}>›</span>
        </button>
        {activePanel === "password" && (
          <div style={styles.panel}>
            <input
              style={styles.input}
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword} style={styles.saveBtn}>
              Update Password
            </button>
            {passwordMsg && <p style={styles.msg}>{passwordMsg}</p>}
          </div>
        )}

        <button
          style={{ ...styles.linkRow, borderBottom: "none" }}
          onClick={() => setActivePanel(activePanel === "privacy" ? null : "privacy")}
        >
          <span>Privacy & Security</span>
          <span style={{ color: colors.textMuted }}>›</span>
        </button>
        {activePanel === "privacy" && (
          <div style={styles.panel}>
            <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6, margin: 0 }}>
              Your email is only visible to you. Series and comments you post are public.
              Account data is stored securely with Supabase. Contact support to request account deletion.
            </p>
          </div>
        )}

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log Out
        </button>
      </div>
    </main>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        border: "none",
        background: checked ? colors.primary : "#333",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 22 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "white",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

const styles = {
  section: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: "6px 16px 10px",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    color: colors.textMuted,
    margin: "10px 0 4px",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 600,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: `1px solid ${colors.bgElevated}`,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  rowSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  select: {
    background: colors.bg,
    color: "white",
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    padding: "6px 10px",
    fontSize: 13,
  },
  linkRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    textAlign: "left",
    background: "none",
    border: "none",
    borderBottom: `1px solid ${colors.bgElevated}`,
    color: "white",
    padding: "14px 0",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  panel: {
    padding: "12px 0 16px",
    borderBottom: `1px solid ${colors.bgElevated}`,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: radii.sm,
    border: `1px solid ${colors.border}`,
    background: colors.bg,
    color: "white",
    boxSizing: "border-box",
    marginBottom: 10,
    fontSize: 14,
  },
  saveBtn: {
    padding: "10px 18px",
    borderRadius: radii.sm,
    border: "none",
    background: colors.primary,
    color: "white",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  msg: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
  logoutBtn: {
    width: "100%",
    marginTop: 12,
    padding: 12,
    borderRadius: radii.sm,
    border: `1px solid ${colors.primary}`,
    background: "none",
    color: colors.primary,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
};
