import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import blogsDataRaw from "@/data/blogs.json";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  author: string;
  date: string;
  category: string;
}

const blogsData = blogsDataRaw as { blogs: Blog[] };

export default function AdminBlog() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for saved auth on component mount
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminAuth") === "true";
    }
    return false;
  });
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>(blogsData.blogs);
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
      localStorage.setItem("adminAuth", "true");
    } else {
      alert("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      thumbnail: "",
      category: "General",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      thumbnail: blog.thumbnail,
      category: blog.category,
      date: blog.date,
    });
    setEditingId(blog.id);
    setMode("edit");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post? This cannot be undone.")) {
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      alert("Blog deleted successfully! (Note: In production, this would update the database)");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content || !formData.thumbnail) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      // Edit existing blog
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === editingId
            ? {
                ...blog,
                ...formData,
                slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
              }
            : blog
        )
      );
      alert("Blog updated successfully!");
    } else {
      // Create new blog
      const newBlog: Blog = {
        id: Date.now().toString(),
        slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
        ...formData,
        author: "Blog Team",
      };
      setBlogs((prev) => [newBlog, ...prev]);
      alert("Blog created successfully!");
    }

    resetForm();
    setMode("list");
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
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0A2540" }}>Blog Admin</h1>
          <button
            onClick={handleLogout}
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

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button
            onClick={() => {
              setMode("list");
              resetForm();
            }}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "0.95rem",
              background: mode === "list" ? "#5BCBF5" : "#e8eef6",
              color: mode === "list" ? "#fff" : "#0A2540",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            All Blogs ({blogs.length})
          </button>
          <button
            onClick={() => {
              setMode("create");
              resetForm();
            }}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "0.95rem",
              background: mode === "create" ? "#5BCBF5" : "#e8eef6",
              color: mode === "create" ? "#fff" : "#0A2540",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            New Blog
          </button>
        </div>

        {/* List View */}
        {mode === "list" && (
          <div style={{ background: "#fff", padding: "2rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(10, 37, 64, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0A2540" }}>All Blog Posts</h2>
              <button
                onClick={() => {
                  const jsonData = JSON.stringify({ blogs }, null, 2);
                  const blob = new Blob([jsonData], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "blogs.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  background: "#5BCBF5",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ⬇️ Export blogs.json
              </button>
            </div>
            {blogs.length === 0 ? (
              <p style={{ color: "#666" }}>No blogs yet. Create one to get started!</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr auto",
                      gap: "1.5rem",
                      padding: "1rem",
                      border: "1px solid #dde3ea",
                      borderRadius: 6,
                      alignItems: "start",
                    }}
                  >
                    {/* Thumbnail */}
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      style={{
                        width: "120px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    {/* Info */}
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0A2540", marginBottom: "0.25rem" }}>{blog.title}</h3>
                      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>{blog.excerpt}</p>
                      <div style={{ fontSize: "0.8rem", color: "#8ba8c4" }}>
                        {blog.category} • {new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(blog)}
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          background: "#5BCBF5",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          background: "#ff4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Form */}
        {(mode === "create" || mode === "edit") && (
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "2rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(10, 37, 64, 0.1)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0A2540", marginBottom: "1.5rem" }}>
              {editingId ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>

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
              <p style={{ fontSize: "0.8rem", color: "#8ba8c4", marginTop: "0.5rem" }}>Use a URL from Unsplash, your S3 bucket, or any image hosting service.</p>
            </div>

            {/* Content */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#0A2540", marginBottom: "0.5rem" }}>
                Blog Content (HTML) *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Paste your HTML content here - directly from WordPress or formatted HTML"
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
                Paste your HTML content directly. You can copy and paste styled content from WordPress or any HTML source.
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
                {editingId ? "Update Blog" : "Publish Blog"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setMode("list");
                }}
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
        )}
      </div>
    </div>
  );
}
