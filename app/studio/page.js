"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Studio() {
  const [user, setUser] = useState(null);
  const [mySeries, setMySeries] = useState([]);
  const [stats, setStats] = useState({ chapters: 0, comments: 0 });
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

      const totalChapters = (seriesData || []).reduce((sum, s) => sum + (s.chapters?.length || 0), 0);

      let totalComments = 0;
      if (seriesData && seriesData.length > 0) {
        const chapterIds = seriesData.flatMap((s) => s.chapters?.map((c) => c.id) || []);
        if (chapterIds.length > 0) {
          const { count } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .in("chapter_id", chapterIds);
          totalComments = count || 0;
        }
      }

      setStats({ chapters: totalChapters, comments: totalComments });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;
  if (!user) return <main style={{ padding: 24 }}>Please <a href="/login" style={{ color: "#E63946" }}>log in</a> to view your Creator Studio.</main>;

  // Earnings/views/likes are illustrative placeholders — no real payment processing is wired up yet.
  const mockEarnings = (stats.chapters * 12.4 + stats.comments * 0.8).toFixed(2);
  const mockViews = stats.chapters * 187;
  const mockLikes = Math.round(mockViews * 0.09);

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Creator Studio</h1>

      <div style={earningsCard}>
        <div style={{ fontSize: 12, color: "#f3c9cc" }}>Total Earnings (estimated)</div>
        <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 4 }}>${mockEarnings}</div>
        <div style={{ fontSize: 11, color: "#f3c9cc", marginTop: 4 }}>
          Illustrative only — payment processing isn't connected yet.
        </div>
      </div>

      <div style={statsRow}>
        <div style={statBox}>
          <div style={statNum}>{mockViews.toLocaleString()}</div>
          <div style={statLabel}>Views</div>
        </div>
        <div style={statBox}>
          <div style={statNum}>{mockLikes.toLocaleString()}</div>
          <div style={statLabel}>Likes</div>
        </div>
        <div style={statBox}>
          <div style={statNum}>{stats.comments}</div>
          <div style={statLabel}>Comments</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 12px" }}>
        <h3 style={{ margin: 0 }}>My Series</h3>
        <a href="/upload" style={uploadBtn}>+ Upload Chapter</a>
      </div>

      {mySeries.length === 0 && (
        <p style={{ color: "#8a8a99" }}>You haven't uploaded any series yet.</p>
      )}
      <div>
        {mySeries.map((s) => (
          <a key={s.id} href={`/series/${s.id}`} style={row}>
            <div style={{ fontWeight: "bold" }}>{s.title}</div>
            <div style={{ fontSize: 12, color: "#8a8a99" }}>{s.chapters?.length || 0} chapters</div>
          </a>
        ))}
      </div>
    </main>
  );
}

const earningsCard = {
  background: "linear-gradient(135deg, #E63946, #8a1620)",
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
};
const statsRow = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 };
const statBox = { background: "#161616", border: "1px solid #262626", borderRadius: 10, padding: 16, textAlign: "center" };
const statNum = { fontSize: 20, fontWeight: "bold" };
const statLabel = { fontSize: 12, color: "#8a8a99", marginTop: 4 };
const uploadBtn = { background: "#E63946", color: "white", textDecoration: "none", fontSize: 13, fontWeight: "bold", padding: "8px 14px", borderRadius: 6 };
const row = { display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#161616", borderRadius: 8, color: "white", textDecoration: "none", marginBottom: 8, border: "1px solid #262626" };
