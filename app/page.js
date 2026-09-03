"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { colors, radii } from "../lib/theme";

export default function Home() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeries() {
      const { data, error } = await supabase
        .from("series")
        .select("*, chapters(id)")
        .order("created_at", { ascending: false });
      if (!error) setSeries(data || []);
      setLoading(false);
    }
    loadSeries();
  }, []);

  const trending = series.slice(0, 8);
  const popular = [...series]
    .sort((a, b) => (b.chapters?.length || 0) - (a.chapters?.length || 0))
    .slice(0, 8);

  return (
    <main style={{ padding: "20px 16px 40px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <img src="/mascot.png" alt="GhoulVerse mascot" style={styles.mascot} />
        <h1 style={styles.title}>
          GHOUL<span style={{ color: colors.primary }}>VERSE</span>
        </h1>
        <p style={styles.tagline}>READ BEYOND REALITY</p>
      </div>

      {loading && <p style={{ color: colors.textMuted, textAlign: "center" }}>Loading...</p>}

      {!loading && series.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: colors.textMuted, marginBottom: 16 }}>
            No series yet. Be the first to upload one!
          </p>
          <a href="/upload" style={styles.ctaBtn}>
            Upload Series
          </a>
        </div>
      )}

      {!loading && series.length > 0 && (
        <>
          <Row title="Trending Now" items={trending} />
          <Row title="Popular This Week" items={popular} />

          <div style={{ marginTop: 32, marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Browse All Series</h2>
            <p style={{ color: colors.textMuted, fontSize: 13, margin: "6px 0 0" }}>
              Original manga, manhwa, manhua, and novels from independent creators.
            </p>
          </div>

          <div style={styles.grid}>
            {series.map((s) => (
              <SeriesCard key={s.id} s={s} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function Row({ title, items }) {
  if (items.length === 0) return null;
  return (
    <section style={{ marginTop: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h3>
        <a href="/explore" style={{ fontSize: 13, color: colors.primary, fontWeight: 500, textDecoration: "none" }}>
          See All
        </a>
      </div>
      <div className="hide-scrollbar" style={styles.scrollRow}>
        {items.map((s) => (
          <div key={s.id} style={{ flex: "0 0 130px" }}>
            <SeriesCard s={s} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SeriesCard({ s }) {
  return (
    <a href={`/series/${s.id}`} style={styles.card}>
      <div style={styles.cardImg}>
        {s.cover_url ? (
          <img
            src={s.cover_url}
            alt={s.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={styles.noCover}>No cover</div>
        )}
      </div>
      <div style={{ padding: "10px 10px 12px" }}>
        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{s.title}</div>
        <div style={{ fontSize: 11, color: colors.textMuted, textTransform: "capitalize", marginTop: 3 }}>
          {s.type}
        </div>
      </div>
    </a>
  );
}

const styles = {
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "28px 0 20px",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(230,57,70,0.25) 0%, transparent 70%)",
    top: 10,
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "none",
  },
  mascot: {
    width: 110,
    height: 110,
    borderRadius: 22,
    objectFit: "cover",
    marginBottom: 14,
    boxShadow: "0 0 0 3px #E63946, 0 0 30px rgba(230,57,70,0.3)",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1.5,
    margin: 0,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 3.5,
    color: colors.textMuted,
    marginTop: 6,
    fontWeight: 500,
  },
  ctaBtn: {
    display: "inline-block",
    background: colors.primary,
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    padding: "12px 28px",
    borderRadius: radii.md,
  },
  scrollRow: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 8,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 14,
  },
  card: {
    background: colors.bgCard,
    borderRadius: radii.md,
    overflow: "hidden",
    textDecoration: "none",
    color: "white",
    border: `1px solid ${colors.border}`,
    display: "block",
  },
  cardImg: {
    aspectRatio: "2/3",
    background: "#1f1f1f",
  },
  noCover: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#555",
    fontSize: 11,
  },
};
