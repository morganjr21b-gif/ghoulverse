"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const TABS = [
  { key: "reading", label: "Reading" },
  { key: "completed", label: "Completed" },
  { key: "plan_to_read", label: "Plan to Read" },
];

export default function Library() {
  const [tab, setTab] = useState("reading");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
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
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>My Library</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              ...tabStyle,
              borderBottom: tab === t.key ? "2px solid #E63946" : "2px solid transparent",
              color: tab === t.key ? "white" : "#8a8a99",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#8a8a99" }}>Loading...</p>}
      {!loading && items.length === 0 && (
        <p style={{ color: "#8a8a99" }}>Nothing here yet. Log in and add series from their page.</p>
      )}

      <div>
        {items.map((item, i) => (
          <a key={i} href={`/series/${item.series?.id}`} style={row}>
            <div style={{ fontWeight: "bold" }}>{item.series?.title}</div>
            <div style={{ fontSize: 12, color: "#8a8a99", textTransform: "capitalize" }}>{item.series?.type}</div>
          </a>
        ))}
      </div>
    </main>
  );
}

const tabStyle = { background: "none", border: "none", padding: "8px 4px", fontSize: 14, cursor: "pointer" };
const row = { display: "block", padding: "12px 16px", background: "#161616", borderRadius: 8, color: "white", textDecoration: "none", marginBottom: 8, border: "1px solid #262626" };
