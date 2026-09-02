"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function ReadPage() {
  const params = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", params.chapterId)
        .single();
      setChapter(data);
    }
    load();
  }, [params.chapterId]);

  if (!chapter) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h2>Chapter {chapter.chapter_number}</h2>

      {chapter.text_content && (
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 16, color: "#e5e5eb" }}>
          {chapter.text_content}
        </div>
      )}

      {chapter.images && chapter.images.length > 0 && (
        <div>
          {chapter.images.map((url, i) => (
            <img key={i} src={url} alt={`Page ${i + 1}`} style={{ width: "100%", display: "block", marginBottom: 4 }} />
          ))}
        </div>
      )}
    </main>
  );
}
