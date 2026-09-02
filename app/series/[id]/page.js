"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function SeriesPage() {
  const params = useParams();
  const [series, setSeries] = useState(null);
  const [chapters, setChapters] = useState([]);

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

  if (!series) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1>{series.title}</h1>
      <p style={{ color: "#c9c9d6" }}>{series.description}</p>
      <p style={{ color: "#8a8a99", fontSize: 13, textTransform: "capitalize" }}>{series.type}</p>

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
