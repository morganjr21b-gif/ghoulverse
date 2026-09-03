"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { colors, radii } from "../../lib/theme";

const TABS = [
  { key: "reading", label: "Reading" },
  { key: "completed", label: "Completed" },
  { key: "plan_to_read", label: "Plan to Read" },
];

export default function Library() {
  const [tab, setTab] = useState("reading");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(userData.user);

      const { data } = await supabase
        .from("library")
        .select("status, series(*)")
        .eq("user_id", userData.user.id)
        .eq("status", tab);
      setItems(data || []);
      setLoading(false);
    }
    load();
  }, [tab]);

  return (
    <main style={{ padding: "20px 16px 40px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16, fontSize: 22, fontWeight: 700 }}>My Library</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${colors.border}` }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: "none",
              border: "none",
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              color: tab === t.key ? "white" : colors.textMuted,
              borderBottom: tab === t.key ? `2px solid ${colors.primary}` : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: colors.textMuted }}>Loading...</p>}

      {!loading && !user && (
        <p style={{ color: colors.textMuted, textAlign: "center", marginTop: 40 }}>
          Please <a href="/login" style={{ color: colors.primary }}>log in</a> to view your library.
        </p>
      )}

      {!loading && user && items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: colors.textMuted }}>
            Nothing here yet. Add series from their page.
          </p>
          <a href="/explore" style={{ color: colors.primary, fontWeight: 600, fontSize: 14 }}>
            Explore series →
          </a>
        </div>
      )}

      <div>
        {items.map((item, i) => (
          <a key={i} href={`/series/${item.series?.id}`} style={styles.row}>
            <div style={styles.thumb}>
              {item.series?.cover_url ? (
                <img
                  src={item.series.cover_url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555", fontSize: 11 }}>
                  ?
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.series?.title}</div>
              <div style={{ fontSize: 12, color: colors.textMuted, textTransform: "capitalize", marginTop: 3 }}>
                {item.series?.type}
              </div>
            </div>
            <span style={{ color: colors.textMuted }}>›</span>
          </a>
        ))}
      </div>
    </main>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 14px",
    background: colors.bgCard,
    borderRadius: radii.md,
    color: "white",
    textDecoration: "none",
    marginBottom: 8,
    border: `1px solid ${colors.border}`,
  },
  thumb: {
    width: 48,
    height: 64,
    borderRadius: 6,
    overflow: "hidden",
    background: "#1f1f1f",
    flexShrink: 0,
  },
};
