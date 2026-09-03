"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { ADMIN_EMAIL } from "../../lib/config";
import { colors, radii } from "../../lib/theme";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [mySeries, setMySeries] = useState([]);
  const [libraryCount, setLibraryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

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

      const { count } = await supabase
        .from("library")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userData.user.id);
      setLibraryCount(count || 0);

      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleUpgrade() {
    setUpgrading(true);
    const { data, error } = await supabase.auth.updateUser({ data: { is_vip: true } });
    if (!error && data?.user) setUser(data.user);
    setUpgrading(false);
  }

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;
  if (!user)
    return (
      <main style={{ padding: 24, textAlign: "center" }}>
        <p style={{ color: colors.textMuted }}>
          Please <a href="/login" style={{ color: colors.primary }}>log in</a> to view your profile.
        </p>
      </main>
    );

  const username = user.user_metadata?.username || user.email.split("@")[0];
  const totalChapters = mySeries.reduce((sum, s) => sum + (s.chapters?.length || 0), 0);
  const isAdmin = user.email === ADMIN_EMAIL;
  const isVip = isAdmin || user.user_metadata?.is_vip === true;

  // Badge logic
  const badges = [];
  if (mySeries.length > 0) badges.push({ label: "Creator", icon: "🎬", color: "#E63946" });
  if (libraryCount > 0) badges.push({ label: "Reader", icon: "📖", color: "#3D5DFF" });
  if (totalChapters >= 5) badges.push({ label: "Prolific", icon: "🔥", color: "#f59e0b" });
  if (isVip) badges.push({ label: "VIP", icon: "👑", color: "#FFD700" });
  if (libraryCount >= 10) badges.push({ label: "Early Reader", icon: "⚡", color: "#22c55e" });
  if (mySeries.length >= 3) badges.push({ label: "Top Supporter", icon: "💎", color: "#a855f7" });

  return (
    <main style={{ padding: "20px 16px 40px", maxWidth: 600, margin: "0 auto" }}>
      {/* Avatar + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <div
          style={{
            ...styles.avatar,
            boxShadow: isVip ? "0 0 0 3px #FFD700" : "none",
          }}
        >
          {username[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 6 }}>
            {username} {isVip && <span title="VIP">👑</span>}
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>@{username}</div>
        </div>
      </div>

      {/* VIP / Member badge */}
      {isVip ? (
        <div style={styles.vipBadge}>
          👑 {isAdmin ? "Creator (Free VIP)" : "VIP Member"}
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <div style={styles.memberBadge}>Ghoul Member</div>
          <button onClick={handleUpgrade} disabled={upgrading} style={styles.upgradeBtn}>
            {upgrading ? "Upgrading..." : "👑 Become VIP"}
          </button>
          <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 6 }}>
            No payment is collected yet — this just previews VIP status.
          </p>
        </div>
      )}

      {/* Badges */}
      <div style={styles.badgesRow}>
        {badges.length > 0 ? (
          badges.map((b) => (
            <span key={b.label} style={{ ...styles.badgePill, borderColor: b.color + "44" }}>
              {b.icon} {b.label}
            </span>
          ))
        ) : (
          <span style={{ fontSize: 12, color: colors.textMuted }}>
            Read or upload something to earn your first badge!
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statNum}>0</div>
          <div style={styles.statLabel}>Following</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNum}>0</div>
          <div style={styles.statLabel}>Followers</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{libraryCount}</div>
          <div style={styles.statLabel}>Favorites</div>
        </div>
      </div>

      {/* Achievements */}
      <div style={styles.menuBox}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>My Achievements</div>
        <p style={{ fontSize: 13, color: colors.textMuted, margin: 0 }}>
          {badges.length > 0
            ? `You've unlocked ${badges.length} badge${badges.length === 1 ? "" : "s"}. Keep going!`
            : "No achievements yet — start reading and creating to earn some!"}
        </p>
      </div>

      {/* Menu links */}
      <a href="/library" style={styles.menuRow}>
        <span>Reading History</span>
        <span style={{ color: colors.textMuted }}>›</span>
      </a>
      <a href="/library" style={styles.menuRow}>
        <span>Bookmarks</span>
        <span style={{ color: colors.textMuted }}>›</span>
      </a>
      <a href="/settings" style={styles.menuRow}>
        <span>Settings</span>
        <span style={{ color: colors.textMuted }}>›</span>
      </a>

      {/* My Series */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 12px" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>My Series</h3>
        <span style={{ fontSize: 12, color: colors.textMuted }}>{totalChapters} chapters total</span>
      </div>

      {mySeries.length === 0 && (
        <p style={{ color: colors.textMuted }}>
          You haven't uploaded anything yet.{" "}
          <a href="/upload" style={{ color: colors.primary }}>Upload your first series</a>
        </p>
      )}

      <div>
        {mySeries.map((s) => (
          <a key={s.id} href={`/series/${s.id}`} style={styles.seriesRow}>
            <div style={{ fontWeight: 600 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              {s.chapters?.length || 0} chapters
            </div>
          </a>
        ))}
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Log Out
      </button>
    </main>
  );
}

const styles = {
  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 700,
  },
  memberBadge: {
    display: "inline-block",
    marginBottom: 8,
    fontSize: 11,
    fontWeight: 700,
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
    borderRadius: 20,
    padding: "4px 12px",
  },
  vipBadge: {
    display: "inline-block",
    marginBottom: 16,
    fontSize: 12,
    fontWeight: 700,
    color: "#0D0D0D",
    background: "linear-gradient(135deg, #FFD700, #E6B800)",
    borderRadius: 20,
    padding: "5px 14px",
  },
  upgradeBtn: {
    display: "block",
    marginTop: 8,
    padding: "8px 16px",
    borderRadius: 20,
    border: "none",
    background: "linear-gradient(135deg, #FFD700, #E6B800)",
    color: "#0D0D0D",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  badgesRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  badgePill: {
    fontSize: 12,
    background: colors.bgCard,
    border: "1px solid",
    borderRadius: 20,
    padding: "5px 12px",
    fontWeight: 500,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: 14,
    textAlign: "center",
  },
  statNum: {
    fontSize: 18,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  menuBox: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: 16,
    marginBottom: 8,
  },
  menuRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "13px 16px",
    background: colors.bgCard,
    borderRadius: radii.sm,
    color: "white",
    textDecoration: "none",
    marginBottom: 8,
    border: `1px solid ${colors.border}`,
    fontSize: 14,
    fontWeight: 500,
  },
  seriesRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: colors.bgCard,
    borderRadius: radii.sm,
    color: "white",
    textDecoration: "none",
    marginBottom: 8,
    border: `1px solid ${colors.border}`,
  },
  logoutBtn: {
    width: "100%",
    marginTop: 20,
    padding: 12,
    borderRadius: radii.sm,
    border: `1px solid ${colors.primary}`,
    background: "none",
    color: colors.primary,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
};
