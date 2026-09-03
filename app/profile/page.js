"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [mySeries, setMySeries] = useState([]);
  const [libraryCount, setLibraryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      setUser(userData.user);

      const { data: seriesData } = await supabase
        .from("series")
        .select("*, chapters(id)")
        .eq("creator_id", userData.user.id)
        .order("created_at", { ascending: false });
      setMySeries(seriesData || []);

      const { count } = await supabase
        .from("library")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userData.user.id);
      setLibraryCount(count || 0);

      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;
  if (!user) return <main style={{ padding: 24 }}>Please <a href="/login" style={{ color: "#E63946" }}>log in</a> to view your profile.</main>;

  const username = user.user_metadata?.username || user.email.split("@")[0];
  const totalChapters = mySeries.reduce((sum, s) => sum + (s.chapters?.length || 0), 0);

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={avatar}>{username[0]?.toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>{username}</div>
          <div style={{ fontSize: 13, color: "#8a8a99" }}>@{username}</div>
        </div>
      </div>

      <div style={badge}>Ghoul Member</div>

      <div style={badgesRow}>
        {mySeries.length > 0 && <span style={badgePill}>🎬 Creator</span>}
        {libraryCount > 0 && <span style={badgePill}>📖 Reader</span>}
        {totalChapters >= 5 && <span style={badgePill}>🔥 Prolific</span>}
        {mySeries.length === 0 && libraryCount === 0 && (
          <span style={{ fontSize: 12, color: "#8a8a99" }}>Read or upload something to earn your first badge!</span>
        )}
      </div>

      <div style={statsRow}>
        <div style={statBox}>
          <div style={statNum}>0</div>
          <div style={statLabel}>Following</div>
        </div>
        <div style={statBox}>
          <div style={statNum}>0</div>
          <div style={statLabel}>Followers</div>
        </div>
        <div style={statBox}>
          <div style={statNum}>{libraryCount}</div>
          <div style={statLabel}>Favorites</div>
        </div>
      </div>

      <div style={menuBox}>
        <div style={menuTitle}>My Achievements</div>
        <p style={{ fontSize: 13, color: "#8a8a99" }}>No achievements yet — start reading and creating to earn some!</p>
      </div>

      <a href="/library" style={menuRow}>
        <span>Reading History</span>
        <span style={{ color: "#8a8a99" }}>›</span>
      </a>
      <a href="/library" style={menuRow}>
        <span>Bookmarks</span>
        <span style={{ color: "#8a8a99" }}>›</span>
      </a>
      <a href="/settings" style={menuRow}>
        <span>Settings</span>
        <span style={{ color: "#8a8a99" }}>›</span>
      </a>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 12px" }}>
        <h3 style={{ margin: 0 }}>My Series</h3>
        <span style={{ fontSize: 12, color: "#8a8a99" }}>{totalChapters} chapters total</span>
      </div>

      {mySeries.length === 0 && (
        <p style={{ color: "#8a8a99" }}>
          You haven't uploaded anything yet.{" "}
          <a href="/upload" style={{ color: "#E63946" }}>Upload your first series</a>
        </p>
      )}
      <div>
        {mySeries.map((s) => (
          <a key={s.id} href={`/series/${s.id}`} style={row}>
            <div style={{ fontWeight: "bold" }}>{s.title}</div>
            <div style={{ fontSize: 12, color: "#8a8a99" }}>{s.chapters?.length || 0} chapters</div>
          </a>
        ))}
      </div>

      <button onClick={handleLogout} style={logoutBtn}>Log Out</button>
    </main>
  );
}

const avatar = { width: 56, height: 56, borderRadius: "50%", background: "#E63946", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: "bold" };
const badge = { display: "inline-block", marginTop: 12, marginBottom: 12, fontSize: 11, fontWeight: "bold", color: "#E63946", border: "1px solid #E63946", borderRadius: 20, padding: "3px 10px" };
const badgesRow = { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 };
const badgePill = { fontSize: 12, background: "#161616", border: "1px solid #262626", borderRadius: 20, padding: "5px 12px" };
const statsRow = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 };
const statBox = { background: "#161616", border: "1px solid #262626", borderRadius: 10, padding: 14, textAlign: "center" };
const statNum = { fontSize: 18, fontWeight: "bold" };
const statLabel = { fontSize: 11, color: "#8a8a99", marginTop: 2 };
const menuBox = { background: "#161616", border: "1px solid #262626", borderRadius: 10, padding: 16, marginBottom: 8 };
const menuTitle = { fontWeight: "bold", fontSize: 14, marginBottom: 6 };
const menuRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#161616", borderRadius: 8, color: "white", textDecoration: "none", marginBottom: 8, border: "1px solid #262626", fontSize: 14 };
const row = { display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#161616", borderRadius: 8, color: "white", textDecoration: "none", marginBottom: 8, border: "1px solid #262626" };
const logoutBtn = { width: "100%", marginTop: 20, padding: 10, borderRadius: 6, border: "1px solid #E63946", background: "none", color: "#E63946", fontWeight: "bold", cursor: "pointer" };
