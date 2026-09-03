"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { colors, radii } from "../../lib/theme";

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

      const totalChapters = (seriesData || []).reduce(
        (sum, s) => sum + (s.chapters?.length || 0),
        0
      );

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
  if (!user)
    return (
      <main style={{ padding: 24, textAlign: "center" }}>
        <p style={{ color: colors.textMuted }}>
          Please <a href="/login" style={{ color: colors.primary }}>log in</a> to view your Creator Studio.
        </p>
      </main>
    );

  // Mock analytics (real tracking comes later)
  const mockEarnings = (stats.chapters * 12.4 + stats.comments * 0.8).toFixed(2);
  const mockViews = stats.chapters * 187;
  const mockLikes = Math.round(mockViews * 0.09);

  return (
    <main style={{ padding: "20px 16px 40px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Creator Studio</h1>

      {/* Earnings card */}
      <div style={styles.earningsCard}>
        <div style={{ fontSize: 12, color: "#f3c9cc", fontWeight: 500 }}>Total Earnings (estimated)</div>
        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>${mockEarnings}</div>
        <div style={{ fontSize: 11, color: "#f3c9cc", marginTop: 6 }}>
          Illustrative only — payment processing isn't connected yet.
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{mockViews.toLocaleString()}</div>
          <div style={styles.statLabel}>Views</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{mockLikes.toLocaleString()}</div>
          <div style={styles.statLabel}>Likes</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{stats.comments}</div>
          <div style={styles.statLabel}>Comments</div>
        </div>
      </div>

      {/* My Series header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "28px 0 12px" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>My Series</h3>
        <a href="/upload" style={styles.uploadBtn}>
          + Upload Chapter
        </a>
      </div>

      {mySeries.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <p style={{ color: colors.textMuted, marginBottom: 16 }}>You haven't uploaded any series yet.</p>
          <a href="/upload" style={styles.uploadBtn}>
            Create your first series
          </a>
        </div>
      )}

      <div>
        {mySeries.map((s) => (
          <a key={s.id} href={`/series/${s.id}`} style={styles.seriesRow}>
            <div>
              <div style={{ fontWeight: 600 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                {s.type} · {s.chapters?.length || 0} chapters
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
  earningsCard: {
    background: "linear-gradient(135deg, #E63946, #8a1620)",
    borderRadius: radii.lg,
    padding: 22,
    marginBottom: 16,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  statBox: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: 16,
    textAlign: "center",
  },
  statNum: {
    fontSize: 20,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  uploadBtn: {
    background: colors.primary,
    color: "white",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    padding: "8px 14px",
    borderRadius: radii.sm,
  },
  seriesRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: colors.bgCard,
    borderRadius: radii.md,
    color: "white",
    textDecoration: "none",
    marginBottom: 8,
    border: `1px solid ${colors.border}`,
  },
};
