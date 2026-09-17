import { useEffect } from "react";
import { useNavigate } from "wouter";
import blogsDataRaw from "@/data/blogs.json";
import { getCurrentAdvisor } from "@/lib/advisor-loader";

const blogsData = blogsDataRaw as {
  blogs: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    content: string;
    author: string;
    date: string;
    category: string;
  }>;
};

export default function BlogList() {
  const [, navigate] = useNavigate();
  const advisor = getCurrentAdvisor();

  useEffect(() => {
    // Add noindex meta tag to prevent indexing
    const noindexMeta = document.createElement("meta");
    noindexMeta.name = "robots";
    noindexMeta.content = "noindex, nofollow";
    document.head.appendChild(noindexMeta);

    document.title = `Blog - ${advisor.name} | NEO Home Loans`;

    return () => {
      noindexMeta.remove();
    };
  }, [advisor.name]);

  return (
    <div style={{ background: "#FAFAFA", minHeight: "100vh", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#5BCBF5", marginBottom: "0.5rem", textTransform: "uppercase" }}>Insights & Resources</div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, color: "#0A2540", marginBottom: "1rem", lineHeight: 1.2 }}>Blog & Resources</h1>
          <p style={{ fontSize: "1.05rem", color: "#666", maxWidth: 600, margin: "0 auto" }}>
            Expert insights and resources to help you make smart mortgage decisions
          </p>
        </div>

        {/* Blog Grid */}
        {blogsData.blogs.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            {blogsData.blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(10, 37, 64, 0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(10, 37, 64, 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(10, 37, 64, 0.1)";
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: "100%", height: 200, overflow: "hidden", background: "#f0f4f8" }}>
                  <img src={blog.thumbnail} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5BCBF5", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {blog.category}
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0A2540", marginBottom: "0.75rem", lineHeight: 1.3, minHeight: "2.6rem" }}>
                    {blog.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem", lineHeight: 1.6 }}>{blog.excerpt}</p>
                  <div style={{ fontSize: "0.8rem", color: "#8ba8c4" }}>
                    {new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: 8 }}>
            <p style={{ fontSize: "1rem", color: "#666" }}>No blog posts yet. Check back soon!</p>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "0.95rem",
              background: "#5BCBF5",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
