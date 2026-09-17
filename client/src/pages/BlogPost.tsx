import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
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
  const [match, params] = useRoute("/blog/:slug");
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

  const blog = match && params?.slug ? blogs.find((b) => b.slug === params.slug) : null;

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

  const contentStyles = `
    .blog-content h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: #0A2540;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      line-height: 1.3;
    }

    .blog-content h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A2540;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .blog-content p {
      margin-bottom: 1.2rem;
      line-height: 1.8;
      color: #444;
    }

    .blog-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 2rem 0;
      display: block;
    }

    .blog-content ul, .blog-content ol {
      margin: 1.5rem 0 1.5rem 2rem;
      line-height: 1.8;
    }

    .blog-content li {
      margin-bottom: 0.75rem;
      color: #444;
    }

    .blog-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      border-radius: 8px;
      overflow: hidden;
    }

    .blog-content table th,
    .blog-content table td {
      padding: 12px 16px !important;
      text-align: center;
    }

    .blog-content table th {
      background: #0A2540 !important;
      color: white !important;
      font-weight: 800 !important;
    }

    .blog-content table tr:nth-child(even) {
      background: #f8f9fa;
    }

    .blog-content table tr:hover {
      background: #f0f4f8;
    }

    .blog-content details {
      background: #fff;
      border: 1px solid #E4EAF0;
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .blog-content summary {
      cursor: pointer;
      padding: 16px 20px;
      font-weight: 700;
      color: #0A2540;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .blog-content summary:hover {
      background: #f0f4f8;
    }

    .blog-content details[open] > summary {
      background: #e8f4fb;
      border-bottom: 1px solid #E4EAF0;
    }

    .blog-content details > div {
      padding: 16px 20px;
      color: #666;
      line-height: 1.8;
    }

    .blog-content a {
      color: #5BCBF5;
      text-decoration: none;
      font-weight: 600;
    }

    .blog-content a:hover {
      text-decoration: underline;
    }

    .blog-content strong {
      font-weight: 700;
      color: #0A2540;
    }

    .blog-content em {
      font-style: italic;
      color: #555;
    }
  `;

  return (
    <div style={{ background: "#FAFAFA", minHeight: "100vh", padding: "3rem 2rem" }}>
      <style>{contentStyles}</style>
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
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 8 }}>
          <div
            className="blog-content"
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
