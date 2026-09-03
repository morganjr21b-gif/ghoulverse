import { colors, radii } from "../lib/theme";

const PILLARS = [
  { label: "Immersive", sub: "Reading Experience", icon: "📖" },
  { label: "Global", sub: "Community", icon: "🌍" },
  { label: "Creator First", sub: "We Empower You", icon: "🎬" },
  { label: "Safe & Secure", sub: "Your Data, Our Priority", icon: "🔒" },
  { label: "Innovative", sub: "Always Evolving", icon: "⚡" },
];

export default function Footer() {
  return (
    <footer style={styles.wrap}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <h3 style={styles.heading}>GHOULVERSE UNIVERSE</h3>
          <p style={styles.tagline}>
            A place where every story matters. Every creator belongs. Every fan is family.
          </p>
          <div style={styles.pillarsRow}>
            {PILLARS.map((p) => (
              <div key={p.label} style={styles.pillar}>
                <div style={styles.pillarIcon}>{p.icon}</div>
                <div style={styles.pillarLabel}>{p.label}</div>
                <div style={styles.pillarSub}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.quoteBox}>
            <div style={styles.quoteMark}>&ldquo;</div>
            <p style={styles.quoteText}>Stories are endless. And so is our universe.</p>
            <div style={{ ...styles.quoteMark, textAlign: "right" }}>&rdquo;</div>
          </div>
          <img src="/mascot.png" alt="GhoulVerse mascot" style={styles.mascotImg} />
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} GhoulVerse · Read Beyond Reality
      </div>
    </footer>
  );
}

const styles = {
  wrap: {
    borderTop: `1px solid ${colors.border}`,
    marginTop: 48,
    padding: "36px 20px 20px",
    background: "#0a0a0a",
  },
  inner: {
    maxWidth: 1000,
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    gap: 28,
    justifyContent: "space-between",
  },
  left: {
    flex: "1 1 320px",
  },
  heading: {
    color: colors.primary,
    fontSize: 14,
    letterSpacing: 1.5,
    marginBottom: 10,
    fontWeight: 700,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: 20,
    maxWidth: 420,
  },
  pillarsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
  },
  pillar: {
    minWidth: 100,
  },
  pillarIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  pillarLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "white",
  },
  pillarSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  right: {
    flex: "0 0 220px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },
  quoteBox: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: 16,
    textAlign: "center",
    width: "100%",
  },
  quoteMark: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 0.6,
  },
  quoteText: {
    fontSize: 13,
    color: "#e5e5eb",
    fontStyle: "italic",
    margin: "6px 0",
  },
  mascotImg: {
    width: 72,
    height: 72,
    borderRadius: 16,
    objectFit: "cover",
    boxShadow: "0 0 0 2px #E63946",
  },
  bottom: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
};
