"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("manga");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [textContent, setTextContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [status, setStatus] = useState("");

  async function handleUpload() {
    setStatus("Uploading...");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setStatus("You need to log in first.");
      return;
    }

    // 1. Create the series
    const { data: seriesData, error: seriesError } = await supabase
      .from("series")
      .insert({ title, description, type, creator_id: userData.user.id })
      .select()
      .single();

    if (seriesError) {
      setStatus("Error creating series: " + seriesError.message);
      return;
    }

    let images = [];
    if (type === "manga" && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const filePath = `${seriesData.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("chapter-images")
          .upload(filePath, file);
        if (uploadError) {
          setStatus("Error uploading image: " + uploadError.message);
          return;
        }
        const { data: publicUrlData } = supabase.storage
          .from("chapter-images")
          .getPublicUrl(filePath);
        images.push(publicUrlData.publicUrl);
      }
    }

    // 2. Create the first chapter
    const { error: chapterError } = await supabase.from("chapters").insert({
      series_id: seriesData.id,
      chapter_number: parseInt(chapterNumber, 10),
      text_content: type === "novel" ? textContent : null,
      images: type === "manga" ? images : null,
    });

    if (chapterError) {
      setStatus("Error creating chapter: " + chapterError.message);
      return;
    }

    setStatus("Uploaded! Redirecting...");
    window.location.href = `/series/${seriesData.id}`;
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Upload a New Series</h1>

      <label style={label}>Title</label>
      <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />

      <label style={label}>Description</label>
      <textarea style={{ ...input, height: 80 }} value={description} onChange={(e) => setDescription(e.target.value)} />

      <label style={label}>Type</label>
      <select style={input} value={type} onChange={(e) => setType(e.target.value)}>
        <option value="manga">Manga / Manhwa / Manhua</option>
        <option value="novel">Novel</option>
      </select>

      <label style={label}>Chapter Number</label>
      <input style={input} type="number" value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} />

      {type === "novel" ? (
        <>
          <label style={label}>Chapter Text</label>
          <textarea style={{ ...input, height: 200 }} value={textContent} onChange={(e) => setTextContent(e.target.value)} />
        </>
      ) : (
        <>
          <label style={label}>Chapter Images (select in reading order)</label>
          <input
            style={input}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
          />
        </>
      )}

      <button style={button} onClick={handleUpload}>Publish</button>
      {status && <p style={{ marginTop: 12, color: "#c9c9d6", fontSize: 14 }}>{status}</p>}
    </main>
  );
}

const label = { display: "block", marginTop: 14, marginBottom: 6, fontSize: 13, color: "#c9c9d6" };
const input = { width: "100%", padding: 10, borderRadius: 6, border: "1px solid #262626", background: "#161616", color: "white", boxSizing: "border-box" };
const button = { marginTop: 20, width: "100%", padding: 12, borderRadius: 6, border: "none", background: "#E63946", color: "white", fontWeight: "bold", cursor: "pointer" };
