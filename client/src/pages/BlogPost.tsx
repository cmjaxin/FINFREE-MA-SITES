import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import blogsDataRaw from "@/data/blogs.json";
import { getCurrentAdvisor } from "@/lib/advisor-loader";

const blogsData = blogsDataRaw as { blogs: Array<{ id: string; slug: string; title: string; excerpt: string; content: string; author: string; date: string; category: string }> };

export default function BlogPost() {
  const [params] = useParams();
  const [, setLocation] = useLocation();
  const advisor = getCurrentAdvisor();

  const blog = blogsData.blogs.find((b) => b.slug === params?.slug);

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
              __html: blog.content
                .split("\n\n")
                .map((para) => {
                  if (para.startsWith("##")) {
                    return `<h2 style="font-size: 1.5rem; font-weight: 800; color: #0A2540; margin: 1.5rem 0 1rem; line-height: 1.3;">${para.replace(/^## /, "")}</h2>`;
                  }
                  if (para.startsWith("###")) {
                    return `<h3 style="font-size: 1.2rem; font-weight: 700; color: #0A2540; margin: 1.25rem 0 0.75rem; line-height: 1.3;">${para.replace(/^### /, "")}</h3>`;
                  }
                  if (para.match(/^\d+\./)) {
                    const items = para.split("\n").map((item) => `<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">${item.replace(/^\d+\. /, "")}</li>`).join("");
                    return `<ol style="margin: 1rem 0;">${items}</ol>`;
                  }
                  if (para.startsWith("-")) {
                    const items = para.split("\n").map((item) => `<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">${item.replace(/^- /, "")}</li>`).join("");
                    return `<ul style="margin: 1rem 0;">${items}</ul>`;
                  }
                  return `<p style="margin-bottom: 1rem;">${para}</p>`;
                })
                .join(""),
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
