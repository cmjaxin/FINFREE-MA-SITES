import { useState, useEffect } from "react";
import { useNavigate } from "wouter";

export default function AdminBlog() {
  const [, navigate] = useNavigate();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    category: "General",
    date: new Date().toISOString().split("T")[0],
  });

  const ADMIN_PASSWORD = "neobuilder2026";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Blog creation is currently in demo mode. In production, this will save to your database.");
    console.log("Blog data to save:", formData);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA", padding: "2rem" }}>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 8, maxWidth: 400, width: "100%", boxShadow: "0 2px 8px rgba(10, 37, 64, 0.1)" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0A2540", marginBottom: "1.5rem", textAlign: "center" }}>Admin Login</h1>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.95rem",
                border: "1px solid #dde3ea",
                borderRadius: 6,
                fontFamily: "inherit",
              }}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "0.95rem",
              background: "#5BCBF5",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0A2540" }}>Create Blog Post</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              background: "#e8eef6",
              color: "#0A2540",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "2rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(10, 37, 64, 0.1)" }}>
          {/* Title */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.95rem",
                border: "1px solid #dde3ea",
                borderRadius: 6,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.95rem",
                border: "1px solid #dde3ea",
                borderRadius: 6,
                fontFamily: "inherit",
              }}
            >
              <option>General</option>
              <option>First-Time Buyers</option>
              <option>Refinancing</option>
              <option>Medical Professionals</option>
              <option>Investment Properties</option>
              <option>Tips & Advice</option>
            </select>
          </div>

          {/* Excerpt */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>
              Excerpt (Short summary) *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Write a brief excerpt (1-2 sentences)"
              required
              rows={2}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.95rem",
                border: "1px solid #dde3ea",
                borderRadius: 6,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {/* Thumbnail URL */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>
              Thumbnail Image URL *
            </label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.95rem",
                border: "1px solid #dde3ea",
                borderRadius: 6,
                fontFamily: "inherit",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "#8ba8c4", marginTop: "0.5rem" }}>Use a URL from Unsplash, your S3 bucket, or any image hosting service. Recommended size: 1200x800px</p>
          </div>

          {/* Content */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>
              Blog Content (Markdown) *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your blog content here. Use ## for headings, - for bullet points, 1. for numbered lists"
              required
              rows={12}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.95rem",
                border: "1px solid #dde3ea",
                borderRadius: 6,
                fontFamily: "monospace",
                resize: "vertical",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "#8ba8c4", marginTop: "0.5rem" }}>
              Use ## for headings, ### for subheadings, - for bullet points, and 1. for numbered lists
            </p>
          </div>

          {/* Publish Date */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>
              Publish Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={{
                padding: "0.75rem",
                fontSize: "0.95rem",
                border: "1px solid #dde3ea",
                borderRadius: 6,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "0.95rem",
                background: "#5BCBF5",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Publish Blog
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "0.95rem",
                background: "#e8eef6",
                color: "#0A2540",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div style={{ marginTop: "2rem", background: "#fff", padding: "2rem", borderRadius: 8 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0A2540", marginBottom: "1rem" }}>📝 Instructions</h3>
          <ul style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.8 }}>
            <li>The blog will appear on all 8 advisor sites</li>
            <li>Each site will show the advisor's name as the author</li>
            <li>Blog pages are NOT indexed by Google (noindex tag added)</li>
            <li>Use Markdown formatting for content (## headings, - bullets, 1. numbers)</li>
            <li>Get free images from Unsplash.com or use your own image URL</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
