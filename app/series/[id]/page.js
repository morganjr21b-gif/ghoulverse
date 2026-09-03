"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function SeriesPage() {
  const params = useParams();
  const [series, setSeries] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: seriesData } = await supabase.from("series").select("*").eq("id", params.id).single();
      setSeries(seriesData);

      const { data: chapterData } = await supabase
        .from("chapters")
        .select("*")
        .eq("series_id", params.id)
        .order("chapter_number", { ascending: true });
      setChapters(chapterData || []);

      const { count } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("series_id", params.id);
      setFollowerCount(count || 0);

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user || null);
      if (userData?.user) {
        const { data: followRow } = await supabase
          .from("follows")
          .select("*")
          .eq("user_id", userData.user.id)
          .eq("series_id", params.id)
          .maybeSingle();
        setFollowing(!!followRow);
      }
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

  async function toggleFollow() {
    if (!user) {
      setStatus("Log in to follow this series.");
      return;
    }
    if (following) {
      await supabase.from("follows").delete().eq("user_id", user.id).eq("series_id", params.id);
      setFollowing(false);
      setFollowerCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("follows").insert({ user_id: user.id, series_id: params.id });
      setFollowing(true);
      setFollowerCount((c) => c + 1);
    }
  }

  if (!series) return <main style={{ padding: 24 }}>Loading...</main>;

  const isOwner = user && series.creator_id === user.id;

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
        <div style={coverBox}>
          {series.cover_url ? (
            <img
              src={series.cover_url}
              alt={series.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555", fontSize: 12 }}>
              No cover
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 8px" }}>{series.title}</h1>
          <p style={{ color: "#8a8a99", fontSize: 13, textTransform: "capitalize", margin: "0 0 8px" }}>
            {series.type} · {chapters.length} chapter{chapters.length === 1 ? "" : "s"}
          </p>
          {series.description && (
            <p style={{ color: "#c9c9d6", margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              {series.description}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}>
        <button onClick={toggleFollow} style={following ? followingBtn : followBtn}>
          {following ? "Following" : "+ Follow"}
        </button>
        <span style={{ fontSize: 12, color: "#8a8a99" }}>
          {followerCount} follower{followerCount === 1 ? "" : "s"}
        </span>
        {isOwner && (
          <a href="/upload" style={addChapterBtn}>
            + Add Chapter
          </a>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <button onClick={() => addToLibrary("reading")} style={btn}>
          + Reading
        </button>
        <button onClick={() => addToLibrary("plan_to_read")} style={btnOutline}>
          + Plan to Read
        </button>
        <button onClick={() => addToLibrary("completed")} style={btnOutline}>
          + Completed
        </button>
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

const coverBox = {
  width: 130,
  height: 195,
  borderRadius: 10,
  overflow: "hidden",
  background: "#1f1f1f",
  flexShrink: 0,
  border: "1px solid #262626",
};
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
const btn = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "none",
  background: "#E63946",
  color: "white",
  fontSize: 13,
  fontWeight: "bold",
  cursor: "pointer",
};
const btnOutline = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #262626",
  background: "none",
  color: "white",
  fontSize: 13,
  cursor: "pointer",
};
const followBtn = {
  padding: "6px 16px",
  borderRadius: 20,
  border: "1px solid #E63946",
  background: "none",
  color: "#E63946",
  fontSize: 13,
  fontWeight: "bold",
  cursor: "pointer",
};
const followingBtn = {
  padding: "6px 16px",
  borderRadius: 20,
  border: "1px solid #262626",
  background: "#161616",
  color: "white",
  fontSize: 13,
  fontWeight: "bold",
  cursor: "pointer",
};
const addChapterBtn = {
  marginLeft: "auto",
  padding: "6px 14px",
  borderRadius: 6,
  background: "#E63946",
  color: "white",
  fontSize: 13,
  fontWeight: "bold",
  textDecoration: "none",
};
