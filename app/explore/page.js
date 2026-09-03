"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const GENRES = ["All", "Action", "Fantasy", "Romance", "Horror", "Comedy", "Drama"];

export default function Explore() {
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("series").select("*, chapters(id)").order("created_at", { ascending: false });
      setSeries(data || []);
    }
    load();
  }, []);

  const filtered = series.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const topRated = [...series].sort((a, b) => (b.chapters?.length || 0) - (a.chapters?.length || 0)).slice(0, 5);

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Explore</h1>
        <button
          onClick={() => alert("You're all caught up — no new notifications.")}
          style={bellBtn}
          aria-label="Notifications"
        >
          <BellIcon />
        </button>
      </div>

      <input
        style={searchStyle}
        placeholder="Search for stories, creators..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 24px" }}>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            style={{
              ...pill,
              background: activeGenre === g ? "#E63946" : "#161616",
              borderColor: activeGenre === g ? "#E63946" : "#262626",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {topRated.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Top Rated</h3>
          <div>
            {topRated.map((s, i) => (
              <a key={s.id} href={`/series/${s.id}`} style={topRow}>
                <span style={rank}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: 14 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: "#8a8a99" }}>{s.chapters?.length || 0} chapters</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>All Series</h3>
      <div style={grid}>
        {filtered.map((s) => (
          <a key={s.id} href={`/series/${s.id}`} style={card}>
            <div style={cardImg}>
              {s.cover_url ? (
                <img src={s.cover_url} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>No cover</div>
              )}
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: "bold", fontSize: 14 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#8a8a99", textTransform: "capitalize" }}>{s.type}</div>
            </div>
          </a>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: "#8a8a99" }}>No series found.</p>}
    </main>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

const bellBtn = { background: "#161616", border: "1px solid #262626", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer" };
const searchStyle = { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #262626", background: "#161616", color: "white", boxSizing: "border-box" };
const pill = { padding: "6px 14px", borderRadius: 20, border: "1px solid #262626", color: "white", fontSize: 13, cursor: "pointer" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 };
const card = { background: "#161616", borderRadius: 10, overflow: "hidden", textDecoration: "none", color: "white", border: "1px solid #262626" };
const cardImg = { aspectRatio: "2/3", background: "#1f1f1f" };
const topRow = { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#161616", border: "1px solid #262626", borderRadius: 8, textDecoration: "none", color: "white", marginBottom: 8 };
const rank = { fontWeight: "bold", color: "#E63946", width: 20, textAlign: "center" };
