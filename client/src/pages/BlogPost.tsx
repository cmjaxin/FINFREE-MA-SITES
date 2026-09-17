import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { getCurrentAdvisor } from "@/lib/advisor-loader";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
}

export default function BlogPost() {
  const [params] = useParams();
  const [, setLocation] = useLocation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const advisor = getCurrentAdvisor();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        const data = await response.json();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Failed to load blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const blog = blogs.find((b) => b.slug === params?.slug);

  useEffect(() => {
    // Add noindex meta tag to prevent indexing
    const noindexMeta = document.createElement("meta");
    noindexMeta.name = "robots";
    noindexMeta.content = "noindex, nofollow";
    document.head.appendChild(noindexMeta);

    // Update page title
    if (blog) {
      document.title = `${blog.title} - ${advisor.name} | NEO Home Loans`;
    }

    return () => {
      noindexMeta.remove();
    };
  }, [blog, advisor.name]);

  if (!blog) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem", textAlign: "center" }}>
        <h1>Blog post not found</h1>
        <button onClick={() => setLocation("/blog")} style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", background: "#5BCBF5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#FAFAFA", minHeight: "100vh", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid #dde3ea" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#5BCBF5", marginBottom: "0.5rem", textTransform: "uppercase" }}>{blog.category}</div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, color: "#0A2540", marginBottom: "1rem", lineHeight: 1.2 }}>{blog.title}</h1>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem", color: "#666", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontWeight: 600 }}>By</span> {advisor.name} at {advisor.company}
            </div>
            <div>{new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 8, lineHeight: 1.8 }}>
          <div
            style={{ color: "#444", fontSize: "1rem" }}
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ marginTop: "3rem", padding: "2rem", background: "#fff", borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
            Posted by <strong>{advisor.name}</strong> at {advisor.company}
          </div>
          <button onClick={() => setLocation("/")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem", background: "#5BCBF5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
