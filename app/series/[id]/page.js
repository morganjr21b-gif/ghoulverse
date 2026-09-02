"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function SeriesPage() {
  const params = useParams();
  const [series, setSeries] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      const { data: seriesData } = await supabase
        .from("series")
        .select("*")
        .eq("id", params.id)
        .single();
      setSeries(seriesData);

      const { data: chapterData } = await supabase
        .from("chapters")
        .select("*")
        .eq("series_id", params.id)
        .order("chapter_number", { ascending: true });
      setChapters(chapterData || []);
    }
    load();
  }, [params.id]);

  async function addToLibrary(newStatus) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setStatus("Log in to add to your library.");
      return;
    }
    const { error } = await supabase
      .from("library")
      .upsert({ user_id: userData.user.id, series_id: params.id, status: newStatus }, { onConflict: "user_id,series_id" });
    setStatus(error ? "Error: " + error.message : `Added to "${newStatus.replace("_", " ")}"!`);
  }

  if (!series) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1>{series.title}</h1>
      <p style={{ color: "#c9c9d6" }}>{series.description}</p>
      <p style={{ color: "#8a8a99", fontSize: 13, textTransform: "capitalize" }}>{series.type}</p>

      <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <button onClick={() => addToLibrary("reading")} style={btn}>+ Reading</button>
        <button onClick={() => addToLibrary("plan_to_read")} style={btnOutline}>+ Plan to Read</button>
        <button onClick={() => addToLibrary("completed")} style={btnOutline}>+ Completed</button>
      </div>
      {status && <p style={{ fontSize: 13, color: "#8a8a99" }}>{status}</p>}

      <h3 style={{ marginTop: 24 }}>Chapters</h3>
      {chapters.length === 0 && <p style={{ color: "#8a8a99" }}>No chapters yet.</p>}
      <div>
        {chapters.map((c) => (
          <a key={c.id} href={`/read/${c.id}`} style={chapterRow}>
            Chapter {c.chapter_number}
          </a>
        ))}
      </div>
    </main>
  );
}

const chapterRow = {
  display: "block",
  padding: "12px 16px",
  background: "#161616",
  borderRadius: 8,
  color: "white",
  textDecoration: "none",
  marginBottom: 8,
  border: "1px solid #262626",
};
const btn = { padding: "8px 14px", borderRadius: 6, border: "none", background: "#E63946", color: "white", fontSize: 13, fontWeight: "bold", cursor: "pointer" };
const btnOutline = { padding: "8px 14px", borderRadius: 6, border: "1px solid #262626", background: "none", color: "white", fontSize: 13, cursor: "pointer" };
