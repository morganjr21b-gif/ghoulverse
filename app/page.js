"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeries() {
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setSeries(data || []);
      setLoading(false);
    }
    loadSeries();
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <div style={hero.wrap}>
        <img src="/mascot.png" alt="GhoulVerse mascot" style={hero.mascot} />
        <h1 style={hero.title}>GHOUL<span style={{ color: "#E63946" }}>VERSE</span></h1>
        <p style={hero.tagline}>READ BEYOND REALITY</p>
      </div>

      <h2 style={{ marginBottom: 4, fontSize: 20 }}>Browse Series</h2>
      <p style={{ color: "#8a8a99", marginBottom: 24 }}>
        Original manga, manhwa, manhua, and novels from independent creators.
      </p>

      {loading && <p>Loading...</p>}
      {!loading && series.length === 0 && (
        <p style={{ color: "#8a8a99" }}>
          No series yet. Be the first to{" "}
          <a href="/upload" style={{ color: "#8b5cf6" }}>upload one</a>!
        </p>
      )}

      <div style={grid}>
        {series.map((s) => (
          <a key={s.id} href={`/series/${s.id}`} style={card}>
            <div style={cardImg}>
              {s.cover_url ? (
                <img src={s.cover_url} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>
                  No cover
                </div>
              )}
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: "bold", fontSize: 14 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#8a8a99", textTransform: "capitalize" }}>{s.type}</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

const hero = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "20px 0 36px",
  },
  mascot: {
    width: 110,
    height: 110,
    borderRadius: 20,
    objectFit: "cover",
    marginBottom: 14,
    boxShadow: "0 0 0 2px #E63946",
  },
  title: {
    fontSize: 26,
    letterSpacing: 1,
    margin: 0,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 3,
    color: "#8a8a99",
    marginTop: 4,
  },
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: 16,
};

const card = {
  background: "#161616",
  borderRadius: 10,
  overflow: "hidden",
  textDecoration: "none",
  color: "white",
  border: "1px solid #262626",
};

const cardImg = {
  aspectRatio: "2/3",
  background: "#1f1f1f",
};
