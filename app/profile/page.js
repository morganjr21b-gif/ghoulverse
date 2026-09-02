"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [mySeries, setMySeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      setUser(userData.user);
      const { data } = await supabase
        .from("series")
        .select("*")
        .eq("creator_id", userData.user.id)
        .order("created_at", { ascending: false });
      setMySeries(data || []);
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

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={avatar}>{user.email?.[0]?.toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>{user.email}</div>
          <button onClick={handleLogout} style={logoutBtn}>Log Out</button>
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>My Series</h3>
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
            <div style={{ fontSize: 12, color: "#8a8a99", textTransform: "capitalize" }}>{s.type}</div>
          </a>
        ))}
      </div>
    </main>
  );
}

const avatar = { width: 56, height: 56, borderRadius: "50%", background: "#E63946", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: "bold" };
const logoutBtn = { marginTop: 6, background: "none", border: "1px solid #262626", color: "#c9c9d6", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" };
const row = { display: "block", padding: "12px 16px", background: "#161616", borderRadius: 8, color: "white", textDecoration: "none", marginBottom: 8, border: "1px solid #262626" };
