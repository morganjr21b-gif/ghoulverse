"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    title: "Welcome to GhoulVerse",
    text: "Discover amazing stories, support creators, and become part of a global community.",
  },
  {
    title: "Read Beyond Reality",
    text: "Manga, manhwa, manhua, and novels — all from independent creators, all in one place.",
  },
  {
    title: "Become a Creator",
    text: "Upload your own original series and start building your audience today.",
  },
];

export default function IntroGate({ children }) {
  const [stage, setStage] = useState("checking"); // checking | splash | onboarding | done

  useEffect(() => {
    const seen = typeof window !== "undefined" && window.localStorage.getItem("ghoulverse_onboarded");
    setStage("splash");
    const timer = setTimeout(() => {
      setStage(seen ? "done" : "onboarding");
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  function finishOnboarding() {
    window.localStorage.setItem("ghoulverse_onboarded", "1");
    setStage("done");
  }

  if (stage === "checking") return null;

  if (stage === "splash") {
    return (
      <div style={splashStyles.wrap}>
        <img src="/mascot.png" alt="GhoulVerse" style={splashStyles.mascot} />
        <div style={splashStyles.title}>GHOUL<span style={{ color: "#E63946" }}>VERSE</span></div>
        <div style={splashStyles.barTrack}>
          <div style={splashStyles.barFill} />
        </div>
        <div style={splashStyles.loadingText}>LOADING...</div>
      </div>
    );
  }

  if (stage === "onboarding") {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return children;
}

function Onboarding({ onFinish }) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div style={splashStyles.wrap}>
      <button onClick={onFinish} style={onboardStyles.skip}>SKIP</button>

      <img src="/mascot.png" alt="GhoulVerse" style={splashStyles.mascot} />
      <h2 style={onboardStyles.title}>{slide.title}</h2>
      <p style={onboardStyles.text}>{slide.text}</p>

      <div style={onboardStyles.dots}>
        {SLIDES.map((_, i) => (
          <span key={i} style={{ ...onboardStyles.dot, background: i === index ? "#E63946" : "#333" }} />
        ))}
      </div>

      <button
        onClick={() => (isLast ? onFinish() : setIndex(index + 1))}
        style={onboardStyles.button}
      >
        {isLast ? "Get Started" : "Next"}
      </button>
    </div>
  );
}

const splashStyles = {
  wrap: {
    position: "fixed",
    inset: 0,
    background: "#0D0D0D",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 24,
    textAlign: "center",
  },
  mascot: { width: 120, height: 120, borderRadius: 24, objectFit: "cover", boxShadow: "0 0 0 2px #E63946", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "white", letterSpacing: 1 },
  barTrack: { width: 160, height: 4, background: "#262626", borderRadius: 2, marginTop: 24, overflow: "hidden" },
  barFill: { width: "60%", height: "100%", background: "#E63946", borderRadius: 2 },
  loadingText: { fontSize: 11, color: "#8a8a99", marginTop: 10, letterSpacing: 2 },
};

const onboardStyles = {
  skip: { position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#8a8a99", fontSize: 12, cursor: "pointer" },
  title: { color: "white", fontSize: 20, marginTop: 8, marginBottom: 8 },
  text: { color: "#8a8a99", fontSize: 14, maxWidth: 280, lineHeight: 1.5 },
  dots: { display: "flex", gap: 6, margin: "24px 0" },
  dot: { width: 7, height: 7, borderRadius: "50%" },
  button: { background: "#E63946", color: "white", border: "none", padding: "12px 40px", borderRadius: 8, fontWeight: "bold", fontSize: 14, cursor: "pointer" },
};
