export const metadata = {
  title: "GhoulVerse",
  description: "Read and publish manga, manhwa, manhua, and novels",
};

import IntroGate from "./IntroGate";
import Footer from "./Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "'Poppins', system-ui, sans-serif", background: "#0D0D0D", color: "white" }}>
        <style>{`
          @media (max-width: 768px) {
            .desktop-nav-links { display: none !important; }
            .bottom-nav { display: flex !important; }
            body { padding-bottom: 64px; }
          }
        `}</style>

        <nav style={nav.bar}>
          <a href="/" style={nav.logoWrap}>
            <img src="/mascot.png" alt="GhoulVerse" style={nav.mascot} />
            <span style={nav.logo}>GHOUL<span style={{ color: "#E63946" }}>VERSE</span></span>
          </a>
          <div className="desktop-nav-links" style={nav.links}>
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

        <IntroGate>
          {children}
          <Footer />

          <div className="bottom-nav" style={bottomNav.bar}>
            <a href="/" style={bottomNav.item}>
              <HomeIcon />
              <span style={bottomNav.label}>Home</span>
            </a>
            <a href="/explore" style={bottomNav.item}>
              <ExploreIcon />
              <span style={bottomNav.label}>Explore</span>
            </a>
            <a href="/library" style={bottomNav.item}>
              <LibraryIcon />
              <span style={bottomNav.label}>Library</span>
            </a>
            <a href="/studio" style={bottomNav.item}>
              <StudioIcon />
              <span style={bottomNav.label}>Studio</span>
            </a>
            <a href="/profile" style={bottomNav.item}>
              <ProfileIcon />
              <span style={bottomNav.label}>Profile</span>
            </a>
          </div>
        </IntroGate>
      </body>
    </html>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function ExploreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  );
}
function LibraryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h6v16H4z" />
      <path d="M14 4h6v16h-6z" />
    </svg>
  );
}
function StudioIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l4-8 4 5 3-4 7 7" />
      <path d="M3 21h18" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
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

const bottomNav = {
  bar: {
    display: "none",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#0D0D0D",
    borderTop: "1px solid #262626",
    justifyContent: "space-around",
    padding: "8px 0 10px",
    zIndex: 50,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    color: "#8a8a99",
    textDecoration: "none",
  },
  label: {
    fontSize: 10,
  },
};
