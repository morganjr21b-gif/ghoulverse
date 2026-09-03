"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function ReadPage() {
  const params = useParams();
  const [chapter, setChapter] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sortMode, setSortMode] = useState("recent");
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("chapters").select("*").eq("id", params.chapterId).single();
      setChapter(data);

      if (data) {
        const { data: siblings } = await supabase
          .from("chapters")
          .select("id, chapter_number")
          .eq("series_id", data.series_id)
          .order("chapter_number", { ascending: true });
        setAllChapters(siblings || []);
      }

      const { data: commentData } = await supabase
        .from("comments")
        .select("*")
        .eq("chapter_id", params.chapterId)
        .order("created_at", { ascending: false });
      setComments(commentData || []);

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user || null);
    }
    load();
    window.scrollTo(0, 0);
  }, [params.chapterId]);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handlePostComment(text, parentId = null) {
    if (!text.trim()) return;
    if (!user) {
      alert("Log in to comment.");
      return;
    }
    const { data, error } = await supabase
      .from("comments")
      .insert({ chapter_id: params.chapterId, user_id: user.id, text, parent_id: parentId })
      .select()
      .single();
    if (!error) {
      setComments([data, ...comments]);
      if (parentId) {
        setReplyTo(null);
        setReplyText("");
      } else {
        setNewComment("");
      }
    }
  }

  async function handleLike(commentId, currentLikes) {
    if (!user) {
      alert("Log in to like comments.");
      return;
    }
    const { error } = await supabase.from("comments").update({ likes: currentLikes + 1 }).eq("id", commentId);
    if (!error) {
      setComments(comments.map((c) => (c.id === commentId ? { ...c, likes: currentLikes + 1 } : c)));
    }
  }

  if (!chapter) return <main style={{ padding: 24 }}>Loading...</main>;

  const currentIndex = allChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  const topLevel = comments.filter((c) => !c.parent_id);
  const sortedTopLevel = [...topLevel].sort((a, b) =>
    sortMode === "top" ? (b.likes || 0) - (a.likes || 0) : new Date(b.created_at) - new Date(a.created_at)
  );
  const repliesFor = (id) => comments.filter((c) => c.parent_id === id);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 24px 90px" }}>
      <div style={progressTrack}><div style={{ ...progressFill, width: `${progress}%` }} /></div>

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

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        {prevChapter ? <a href={`/read/${prevChapter.id}`} style={navBtn}>← Ch. {prevChapter.chapter_number}</a> : <span />}
        {nextChapter ? <a href={`/read/${nextChapter.id}`} style={navBtn}>Ch. {nextChapter.chapter_number} →</a> : <span />}
      </div>

      <div style={{ marginTop: 32, borderTop: "1px solid #262626", paddingTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Comments ({comments.length})</h3>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setSortMode("recent")} style={{ ...sortBtn, color: sortMode === "recent" ? "white" : "#8a8a99" }}>Recent</button>
            <button onClick={() => setSortMode("top")} style={{ ...sortBtn, color: sortMode === "top" ? "white" : "#8a8a99" }}>Top</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            style={commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostComment(newComment)}
          />
          <button onClick={() => handlePostComment(newComment)} style={postBtn}>Post</button>
        </div>

        {sortedTopLevel.length === 0 && <p style={{ color: "#8a8a99", fontSize: 14 }}>No comments yet. Be the first!</p>}

        {sortedTopLevel.map((c) => (
          <div key={c.id} style={commentRow}>
            <div style={{ fontSize: 14, color: "#e5e5eb" }}>{c.text}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
              <button onClick={() => handleLike(c.id, c.likes || 0)} style={miniBtn}>♥ {c.likes || 0}</button>
              <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)} style={miniBtn}>Reply</button>
            </div>

            {replyTo === c.id && (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  style={commentInput}
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment(replyText, c.id)}
                />
                <button onClick={() => handlePostComment(replyText, c.id)} style={postBtn}>Reply</button>
              </div>
            )}

            {repliesFor(c.id).map((r) => (
              <div key={r.id} style={replyRow}>
                <div style={{ fontSize: 13, color: "#c9c9d6" }}>{r.text}</div>
                <button onClick={() => handleLike(r.id, r.likes || 0)} style={{ ...miniBtn, marginTop: 4 }}>♥ {r.likes || 0}</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={toolbar}>
        <a href={`/series/${chapter.series_id}`} style={toolbarItem}><ListIcon /><span style={toolbarLabel}>List</span></a>
        <div style={toolbarItem}><CommentIcon /><span style={toolbarLabel}>{comments.length}</span></div>
        <button onClick={() => setSaved(!saved)} style={{ ...toolbarItem, background: "none", border: "none", cursor: "pointer" }}>
          <BookmarkIcon filled={saved} /><span style={toolbarLabel}>Save</span>
        </button>
        <a href="/settings" style={toolbarItem}><SettingsIcon /><span style={toolbarLabel}>Settings</span></a>
      </div>
    </main>
  );
}

function ListIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>; }
function CommentIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>; }
function BookmarkIcon({ filled }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#E63946" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>; }
function SettingsIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.32.22.67.22 1.03V10a2 2 0 010 4h-.09c-.36 0-.71.08-1.03.22z" /></svg>; }

const progressTrack = { position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "#1a1a1a", zIndex: 60 };
const progressFill = { height: "100%", background: "#E63946" };
const navBtn = { color: "#c9c9d6", textDecoration: "none", fontSize: 13, border: "1px solid #262626", padding: "8px 14px", borderRadius: 6 };
const commentInput = { flex: 1, padding: 10, borderRadius: 6, border: "1px solid #262626", background: "#161616", color: "white" };
const postBtn = { padding: "0 16px", borderRadius: 6, border: "none", background: "#E63946", color: "white", fontWeight: "bold", cursor: "pointer" };
const commentRow = { padding: "10px 0", borderBottom: "1px solid #1a1a1a" };
const replyRow = { marginLeft: 20, marginTop: 8, padding: "8px 0 0", borderTop: "1px solid #1a1a1a" };
const miniBtn = { background: "none", border: "none", color: "#8a8a99", fontSize: 12, cursor: "pointer", padding: 0 };
const sortBtn = { background: "none", border: "none", fontSize: 12, cursor: "pointer" };
const toolbar = { position: "fixed", bottom: 0, left: 0, right: 0, background: "#0D0D0D", borderTop: "1px solid #262626", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 55 };
const toolbarItem = { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "#c9c9d6", textDecoration: "none" };
const toolbarLabel = { fontSize: 10 };
