"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Upload() {
  const [mode, setMode] = useState("new"); // "new" | "existing"
  const [mySeries, setMySeries] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("manga");
  const [coverFile, setCoverFile] = useState(null);

  const [chapterNumber, setChapterNumber] = useState("1");
  const [textContent, setTextContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      setUser(userData.user);

      const { data } = await supabase
        .from("series")
        .select("id, title, type")
        .eq("creator_id", userData.user.id)
        .order("created_at", { ascending: false });
      setMySeries(data || []);
    }
    load();
  }, []);

  async function uploadImages(files, seriesId) {
    const urls = [];
    for (const file of files) {
      const filePath = `${seriesId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("chapter-images")
        .upload(filePath, file);
      if (error) throw new Error("Image upload failed: " + error.message);
      const { data } = supabase.storage.from("chapter-images").getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  async function handleUpload() {
    if (!user) {
      setStatus("You need to log in first.");
      return;
    }

    setLoading(true);
    setStatus("Uploading...");

    try {
      let seriesId = selectedSeriesId;
      let seriesType = type;

      // --- Create new series ---
      if (mode === "new") {
        if (!title.trim()) {
          setStatus("Title is required.");
          setLoading(false);
          return;
        }

        let coverUrl = null;
        if (coverFile) {
          const coverPath = `covers/${user.id}/${Date.now()}-${coverFile.name}`;
          const { error: coverErr } = await supabase.storage
            .from("chapter-images")
            .upload(coverPath, coverFile);
          if (coverErr) throw new Error("Cover upload failed: " + coverErr.message);
          const { data: coverData } = supabase.storage
            .from("chapter-images")
            .getPublicUrl(coverPath);
          coverUrl = coverData.publicUrl;
        }

        const { data: seriesData, error: seriesError } = await supabase
          .from("series")
          .insert({
            title: title.trim(),
            description: description.trim() || null,
            type,
            cover_url: coverUrl,
            creator_id: user.id,
          })
          .select()
          .single();

        if (seriesError) throw new Error("Error creating series: " + seriesError.message);
        seriesId = seriesData.id;
        seriesType = type;
      } else {
        // existing series
        if (!selectedSeriesId) {
          setStatus("Please select a series.");
          setLoading(false);
          return;
        }
        const selected = mySeries.find((s) => s.id === selectedSeriesId);
        seriesType = selected?.type || "manga";
      }

      // --- Upload chapter images if manga ---
      let images = null;
      if (seriesType === "manga" && imageFiles.length > 0) {
        images = await uploadImages(imageFiles, seriesId);
      }

      // --- Create chapter ---
      const { error: chapterError } = await supabase.from("chapters").insert({
        series_id: seriesId,
        chapter_number: parseInt(chapterNumber, 10) || 1,
        text_content: seriesType === "novel" ? textContent : null,
        images: seriesType === "manga" ? images : null,
      });

      if (chapterError) throw new Error("Error creating chapter: " + chapterError.message);

      setStatus("Uploaded! Redirecting...");
      window.location.href = `/series/${seriesId}`;
    } catch (err) {
      setStatus(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
        <h1>Upload</h1>
        <p style={{ color: "#8a8a99" }}>
          Please <a href="/login" style={{ color: "#E63946" }}>log in</a> to upload.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Upload</h1>

      {/* Mode switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setMode("new")}
          style={{
            ...modeBtn,
            background: mode === "new" ? "#E63946" : "#161616",
            borderColor: mode === "new" ? "#E63946" : "#262626",
          }}
        >
          New Series
        </button>
        <button
          onClick={() => setMode("existing")}
          style={{
            ...modeBtn,
            background: mode === "existing" ? "#E63946" : "#161616",
            borderColor: mode === "existing" ? "#E63946" : "#262626",
          }}
        >
          Add Chapter to Existing
        </button>
      </div>

      {mode === "new" ? (
        <>
          <label style={label}>Title</label>
          <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />

          <label style={label}>Description</label>
          <textarea
            style={{ ...input, height: 80 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label style={label}>Type</label>
          <select style={input} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="manga">Manga / Manhwa / Manhua</option>
            <option value="novel">Novel</option>
          </select>

          <label style={label}>Cover Image (optional)</label>
          <input
            style={input}
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
        </>
      ) : (
        <>
          <label style={label}>Select Series</label>
          {mySeries.length === 0 ? (
            <p style={{ color: "#8a8a99", fontSize: 14 }}>
              You don't have any series yet. Create a new one first.
            </p>
          ) : (
            <select
              style={input}
              value={selectedSeriesId}
              onChange={(e) => setSelectedSeriesId(e.target.value)}
            >
              <option value="">Choose a series...</option>
              {mySeries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.type})
                </option>
              ))}
            </select>
          )}
        </>
      )}

      <hr style={{ border: "none", borderTop: "1px solid #262626", margin: "24px 0" }} />

      <label style={label}>Chapter Number</label>
      <input
        style={input}
        type="number"
        min="1"
        value={chapterNumber}
        onChange={(e) => setChapterNumber(e.target.value)}
      />

      {(mode === "new" ? type : mySeries.find((s) => s.id === selectedSeriesId)?.type) ===
      "novel" ? (
        <>
          <label style={label}>Chapter Text</label>
          <textarea
            style={{ ...input, height: 200 }}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </>
      ) : (
        <>
          <label style={label}>Chapter Images (select in reading order)</label>
          <input
            style={input}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
          />
          {imageFiles.length > 0 && (
            <p style={{ fontSize: 12, color: "#8a8a99", marginTop: 6 }}>
              {imageFiles.length} image{imageFiles.length === 1 ? "" : "s"} selected
            </p>
          )}
        </>
      )}

      <button style={button} onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Publish"}
      </button>
      {status && (
        <p style={{ marginTop: 12, color: "#c9c9d6", fontSize: 14 }}>{status}</p>
      )}
    </main>
  );
}

const label = {
  display: "block",
  marginTop: 14,
  marginBottom: 6,
  fontSize: 13,
  color: "#c9c9d6",
};
const input = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #262626",
  background: "#161616",
  color: "white",
  boxSizing: "border-box",
};
const button = {
  marginTop: 20,
  width: "100%",
  padding: 12,
  borderRadius: 6,
  border: "none",
  background: "#E63946",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};
const modeBtn = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid",
  color: "white",
  fontWeight: "bold",
  fontSize: 13,
  cursor: "pointer",
};
