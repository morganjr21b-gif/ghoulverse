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
      const { data } = await supabase.from("series").select("*").order("created_at", { ascending: false });
      setSeries(data || []);
    }
    load();
  }, []);

  const filtered = series.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Explore</h1>

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

const searchStyle = { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #262626", background: "#161616", color: "white", boxSizing: "border-box" };
const pill = { padding: "6px 14px", borderRadius: 20, border: "1px solid #262626", color: "white", fontSize: 13, cursor: "pointer" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 };
const card = { background: "#161616", borderRadius: 10, overflow: "hidden", textDecoration: "none", color: "white", border: "1px solid #262626" };
const cardImg = { aspectRatio: "2/3", background: "#1f1f1f" };
