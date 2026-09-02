"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function ReadPage() {
  const params = useParams();
  const [chapter, setChapter] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", params.chapterId)
        .single();
      setChapter(data);

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
  }, [params.chapterId]);

  async function handlePostComment() {
    if (!newComment.trim()) return;
    if (!user) {
      alert("Log in to comment.");
      return;
    }
    const { data, error } = await supabase
      .from("comments")
      .insert({ chapter_id: params.chapterId, user_id: user.id, text: newComment })
      .select()
      .single();
    if (!error) {
      setComments([data, ...comments]);
      setNewComment("");
    }
  }

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

      <div style={{ marginTop: 32, borderTop: "1px solid #262626", paddingTop: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Comments</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            style={commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
          />
          <button onClick={handlePostComment} style={postBtn}>Post</button>
        </div>
        {comments.length === 0 && <p style={{ color: "#8a8a99", fontSize: 14 }}>No comments yet. Be the first!</p>}
        {comments.map((c) => (
          <div key={c.id} style={commentRow}>
            <div style={{ fontSize: 14, color: "#e5e5eb" }}>{c.text}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

const commentInput = { flex: 1, padding: 10, borderRadius: 6, border: "1px solid #262626", background: "#161616", color: "white" };
const postBtn = { padding: "0 16px", borderRadius: 6, border: "none", background: "#E63946", color: "white", fontWeight: "bold", cursor: "pointer" };
const commentRow = { padding: "10px 0", borderBottom: "1px solid #1a1a1a" };
