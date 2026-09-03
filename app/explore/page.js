"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { colors, radii } from "../../lib/theme";

const GENRES = ["All", "Action", "Fantasy", "Romance", "Horror", "Comedy", "Drama", "Martial Arts"];

export default function Explore() {
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("series")
        .select("*, chapters(id)")
        .order("created_at", { ascending: false });
      setSeries(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = series.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    // Genre filtering is visual for now (no genre column yet)
    return matchesSearch;
  });

  const topRated = [...series]
    .sort((a, b) => (b.chapters?.length || 0) - (a.chapters?.length || 0))
    .slice(0, 6);

  return (
    <main style={{ padding: "20px 16px 40px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Explore</h1>
        <button
          onClick={() => alert("You're all caught up — no new notifications.")}
          style={styles.bellBtn}
          aria-label="Notifications"
        >
          <BellIcon />
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <SearchIcon />
        <input
          style={styles.searchInput}
          placeholder="Search for stories, creators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Genre pills */}
      <div className="hide-scrollbar" style={styles.genreRow}>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            style={{
              ...styles.pill,
              background: activeGenre === g ? colors.primary : colors.bgCard,
              borderColor: activeGenre === g ? colors.primary : colors.border,
              color: activeGenre === g ? "white" : colors.textSecondary,
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: colors.textMuted }}>Loading...</p>}

      {/* Top Rated */}
      {!loading && topRated.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Top Rated</h3>
            <span style={styles.seeAll}>See All</span>
          </div>
          <div>
            {topRated.map((s, i) => (
              <a key={s.id} href={`/series/${s.id}`} style={styles.topRow}>
                <span style={styles.rank}>{i + 1}</span>
                <div style={styles.topThumb}>
                  {s.cover_url ? (
                    <img src={s.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={styles.noCover}>?</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                    {s.chapters?.length || 0} chapters · {s.type}
                  </div>
                </div>
                <div style={styles.ratingBadge}>
                  ★ {(4.2 + (s.chapters?.length || 0) * 0.05).toFixed(1)}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* All Series Grid */}
      <section>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>All Series</h3>
        </div>

        <div style={styles.grid}>
          {filtered.map((s) => (
            <a key={s.id} href={`/series/${s.id}`} style={styles.card}>
              <div style={styles.cardImg}>
                {s.cover_url ? (
                  <img src={s.cover_url} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={styles.noCover}>No cover</div>
                )}
              </div>
              <div style={{ padding: "10px 10px 12px" }}>
                <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: colors.textMuted, textTransform: "capitalize", marginTop: 3 }}>
                  {s.type} · {s.chapters?.length || 0} ch
                </div>
              </div>
            </a>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p style={{ color: colors.textMuted, textAlign: "center", marginTop: 40 }}>
            No series found.
          </p>
        )}
      </section>
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

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8a99" strokeWidth="2" style={{ position: "absolute", left: 14, top: 13 }}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

const styles = {
  bellBtn: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    cursor: "pointer",
  },
  searchWrap: {
    position: "relative",
    marginBottom: 16,
  },
  searchInput: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    borderRadius: radii.md,
    border: `1px solid ${colors.border}`,
    background: colors.bgCard,
    color: "white",
    fontSize: 14,
    outline: "none",
  },
  genreRow: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 4,
    marginBottom: 24,
  },
  pill: {
    padding: "7px 16px",
    borderRadius: 20,
    border: "1px solid",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: 500,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    textDecoration: "none",
    color: "white",
    marginBottom: 8,
  },
  rank: {
    fontWeight: 700,
    color: colors.primary,
    width: 22,
    textAlign: "center",
    fontSize: 15,
  },
  topThumb: {
    width: 42,
    height: 56,
    borderRadius: 6,
    overflow: "hidden",
    background: "#1f1f1f",
    flexShrink: 0,
  },
  ratingBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.gold,
    background: "rgba(255,215,0,0.1)",
    padding: "4px 8px",
    borderRadius: 6,
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
    fontSize: 12,
  },
};
