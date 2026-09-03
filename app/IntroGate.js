"use client";

import { useEffect, useState } from "react";
import { colors, fonts, radii } from "../lib/theme";

const SLIDES = [
  {
    title: "Welcome to GhoulVerse",
    text: "Discover amazing stories, support creators and become part of a global community.",
    icon: "📖",
  },
  {
    title: "Read Beyond Reality",
    text: "Original manga, manhwa, manhua and novels from independent creators — all in one place.",
    icon: "🌌",
  },
  {
    title: "Create & Earn",
    text: "Upload your own series, build your audience, and grow together with the community.",
    icon: "🚀",
  },
];

export default function IntroGate({ children }) {
  const [stage, setStage] = useState("checking"); // checking | splash | onboarding | done

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      window.localStorage.getItem("ghoulverse_onboarded");

    setStage("splash");

    const timer = setTimeout(() => {
      setStage(seen ? "done" : "onboarding");
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  function finishOnboarding() {
    window.localStorage.setItem("ghoulverse_onboarded", "1");
    setStage("done");
  }

  if (stage === "checking") return null;

  if (stage === "splash") {
    return <SplashScreen />;
  }

  if (stage === "onboarding") {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return children;
}

/* ===================== SPLASH ===================== */
function SplashScreen() {
  return (
    <div style={styles.fullScreen}>
      {/* Red glow behind mascot */}
      <div style={styles.glow} />

      <img src="/mascot.png" alt="GhoulVerse" style={styles.mascot} />

      <h1 style={styles.logo}>
        GHOUL<span style={{ color: colors.primary }}>VERSE</span>
      </h1>

      <p style={styles.tagline}>READ BEYOND REALITY</p>

      <div style={styles.progressTrack}>
        <div style={styles.progressFill} />
      </div>

      <p style={styles.loadingText}>LOADING THE VERSE...</p>
    </div>
  );
}

/* ===================== ONBOARDING ===================== */
function Onboarding({ onFinish }) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div style={styles.fullScreen}>
      <button onClick={onFinish} style={styles.skipBtn}>
        SKIP
      </button>

      <div style={styles.onboardContent}>
        <div style={styles.mascotWrap}>
          <div style={styles.glowSmall} />
          <img src="/mascot.png" alt="GhoulVerse" style={styles.mascotOnboard} />
        </div>

        <h2 style={styles.slideTitle}>{slide.title}</h2>
        <p style={styles.slideText}>{slide.text}</p>

        {/* Dots */}
        <div style={styles.dots}>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              style={{
                ...styles.dot,
                background: i === index ? colors.primary : "#333",
                width: i === index ? 18 : 7,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => (isLast ? onFinish() : setIndex(index + 1))}
          style={styles.ctaBtn}
        >
          {isLast ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */
const styles = {
  fullScreen: {
    position: "fixed",
    inset: 0,
    background: colors.bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: 24,
    textAlign: "center",
    fontFamily: fonts.body,
    overflow: "hidden",
  },

  // Glow effect behind mascot
  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(230,57,70,0.35) 0%, transparent 70%)",
    top: "38%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  glowSmall: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(230,57,70,0.3) 0%, transparent 70%)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },

  mascot: {
    width: 140,
    height: 140,
    borderRadius: 28,
    objectFit: "cover",
    boxShadow: "0 0 0 3px #E63946, 0 0 40px rgba(230,57,70,0.4)",
    marginBottom: 24,
    position: "relative",
    zIndex: 2,
  },

  logo: {
    fontSize: 32,
    fontWeight: 700,
    color: "white",
    letterSpacing: 2,
    margin: 0,
    position: "relative",
    zIndex: 2,
  },

  tagline: {
    fontSize: 12,
    letterSpacing: 4,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 0,
    fontWeight: 500,
  },

  progressTrack: {
    width: 180,
    height: 4,
    background: "#262626",
    borderRadius: 4,
    marginTop: 32,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    width: "70%",
    background: `linear-gradient(90deg, ${colors.primary}, #ff6b6b)`,
    borderRadius: 4,
    animation: "progress 1.6s ease-in-out infinite",
  },

  loadingText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 14,
    letterSpacing: 2,
    fontWeight: 500,
  },

  // Onboarding
  skipBtn: {
    position: "absolute",
    top: 24,
    right: 24,
    background: "none",
    border: "none",
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: 1,
  },

  onboardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 340,
  },

  mascotWrap: {
    position: "relative",
    marginBottom: 28,
  },

  mascotOnboard: {
    width: 130,
    height: 130,
    borderRadius: 26,
    objectFit: "cover",
    boxShadow: "0 0 0 3px #E63946",
    position: "relative",
    zIndex: 2,
  },

  slideTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 700,
    margin: "0 0 12px",
    lineHeight: 1.25,
  },

  slideText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 1.55,
    margin: 0,
    maxWidth: 300,
  },

  dots: {
    display: "flex",
    gap: 8,
    margin: "28px 0",
    alignItems: "center",
  },

  dot: {
    height: 7,
    borderRadius: 4,
    transition: "all 0.25s ease",
  },

  ctaBtn: {
    background: colors.primary,
    color: "white",
    border: "none",
    padding: "14px 48px",
    borderRadius: radii.md,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(230,57,70,0.35)",
    letterSpacing: 0.3,
  },
};
