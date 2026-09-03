const PILLARS = [
  { label: "Immersive", sub: "Reading Experience" },
  { label: "Global", sub: "Community" },
  { label: "Creator First", sub: "We Empower You" },
  { label: "Safe & Secure", sub: "Your Data, Our Priority" },
  { label: "Innovative", sub: "Always Evolving" },
];

export default function Footer() {
  return (
    <footer style={wrap}>
      <div style={inner}>
        <div style={left}>
          <h3 style={heading}>GHOULVERSE UNIVERSE</h3>
          <p style={tagline}>
            A place where every story matters. Every creator belongs. Every fan is family.
          </p>
          <div style={pillarsRow}>
            {PILLARS.map((p) => (
              <div key={p.label} style={pillar}>
                <div style={pillarLabel}>{p.label}</div>
                <div style={pillarSub}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={right}>
          <div style={quoteBox}>
            <div style={quoteMark}>&ldquo;</div>
            <p style={quoteText}>Stories are endless. And so is our universe.</p>
            <div style={{ ...quoteMark, textAlign: "right" }}>&rdquo;</div>
          </div>
          <img src="/mascot.png" alt="GhoulVerse mascot" style={mascotImg} />
        </div>
      </div>
    </footer>
  );
}

const wrap = { borderTop: "1px solid #262626", marginTop: 40, padding: "32px 24px" };
const inner = { maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between" };
const left = { flex: "1 1 320px" };
const heading = { color: "#E63946", fontSize: 15, letterSpacing: 1, marginBottom: 8 };
const tagline = { color: "#c9c9d6", fontSize: 13, lineHeight: 1.6, marginBottom: 18, maxWidth: 420 };
const pillarsRow = { display: "flex", flexWrap: "wrap", gap: 20 };
const pillar = { minWidth: 100 };
const pillarLabel = { fontSize: 12, fontWeight: "bold", color: "white" };
const pillarSub = { fontSize: 11, color: "#8a8a99", marginTop: 2 };
const right = { flex: "0 0 220px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 };
const quoteBox = { background: "#161616", border: "1px solid #262626", borderRadius: 10, padding: 14, textAlign: "center", width: "100%" };
const quoteMark = { color: "#E63946", fontSize: 20, lineHeight: 0.6 };
const quoteText = { fontSize: 13, color: "#e5e5eb", fontStyle: "italic", margin: "4px 0" };
const mascotImg = { width: 70, height: 70, borderRadius: 14, objectFit: "cover" };
