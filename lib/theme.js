// GhoulVerse Design System
// Colors match the official brand identity

export const colors = {
  bg: "#0D0D0D",
  bgCard: "#161616",
  bgElevated: "#1A1A1A",
  border: "#262626",
  primary: "#E63946",
  primaryDark: "#8a1620",
  text: "#FFFFFF",
  textSecondary: "#c9c9d6",
  textMuted: "#8a8a99",
  accent: "#3D5DFF",
  gold: "#FFD700",
  success: "#22c55e",
  danger: "#f87171",
};

export const fonts = {
  body: "'Poppins', system-ui, -apple-system, sans-serif",
  // Display font for big titles (fallback to Poppins bold)
  display: "'Poppins', system-ui, sans-serif",
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const shadows = {
  glow: "0 0 0 2px #E63946",
  card: "0 4px 20px rgba(0,0,0,0.4)",
};

// Common reusable style objects
export const btnPrimary = {
  background: colors.primary,
  color: "white",
  border: "none",
  borderRadius: radii.sm,
  padding: "12px 24px",
  fontWeight: "bold",
  fontSize: 14,
  cursor: "pointer",
  fontFamily: fonts.body,
};

export const btnOutline = {
  background: "none",
  color: "white",
  border: `1px solid ${colors.border}`,
  borderRadius: radii.sm,
  padding: "10px 18px",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: fonts.body,
};

export const inputBase = {
  width: "100%",
  padding: 12,
  borderRadius: radii.sm,
  border: `1px solid ${colors.border}`,
  background: colors.bgCard,
  color: colors.text,
  fontSize: 14,
  boxSizing: "border-box",
  fontFamily: fonts.body,
};

export const card = {
  background: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  overflow: "hidden",
};
