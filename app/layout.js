export const metadata = {
  title: "GhoulVerse",
  description: "Read and publish manga, manhwa, manhua, and novels",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Poppins', system-ui, sans-serif", background: "#0D0D0D", color: "white" }}>
        <nav style={nav.bar}>
          <a href="/" style={nav.logoWrap}>
            <img src="/mascot.png" alt="GhoulVerse" style={nav.mascot} />
            <span style={nav.logo}>GHOUL<span style={{ color: "#E63946" }}>VERSE</span></span>
          </a>
          <div style={nav.links}>
            <a href="/explore" style={nav.link}>Explore</a>
            <a href="/library" style={nav.link}>Library</a>
            <a href="/upload" style={nav.link}>Upload</a>
            <a href="/studio" style={nav.link}>Studio</a>
            <a href="/profile" style={nav.link}>Profile</a>
            <a href="/settings" style={nav.link}>Settings</a>
            <a href="/login" style={nav.link}>Log In</a>
            <a href="/signup" style={nav.signupBtn}>Sign Up</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

const nav = {
  bar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#0D0D0D",
    borderBottom: "1px solid #262626",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  mascot: {
    width: 34,
    height: 34,
    borderRadius: 8,
    objectFit: "cover",
  },
  logo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },
  link: {
    color: "#c9c9d6",
    textDecoration: "none",
    fontSize: 14,
  },
  signupBtn: {
    background: "#E63946",
    color: "white",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: "bold",
    padding: "8px 16px",
    borderRadius: 6,
  },
};
