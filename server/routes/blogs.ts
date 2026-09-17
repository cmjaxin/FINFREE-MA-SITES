import express from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Determine blogs.json path based on environment
const isProduction = process.env.NODE_ENV === "production";
let blogsPath: string;

if (isProduction) {
  // In Vercel production, use /tmp for persistence (session-based)
  const tmpDir = "/tmp/neo-ma-sites";
  mkdirSync(tmpDir, { recursive: true });
  blogsPath = join(tmpDir, "blogs.json");
} else {
  // In local dev, use source file
  const possiblePaths = [
    join(process.cwd(), "client/src/data/blogs.json"),
    join(process.cwd(), "../client/src/data/blogs.json"),
    join(__dirname, "../../client/src/data/blogs.json"),
  ];
  blogsPath = possiblePaths[0];
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      blogsPath = path;
      break;
    }
  }
}

// Initialize blogs.json if it doesn't exist
if (!existsSync(blogsPath)) {
  writeFileSync(blogsPath, JSON.stringify({ blogs: [] }, null, 2));
}

// GET all blogs
router.get("/", (req, res) => {
  try {
    const data = readFileSync(blogsPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read blogs" });
  }
});

// POST create/update blog
router.post("/", (req, res) => {
  try {
    const { id, slug, title, excerpt, content, thumbnail, category, date } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content || !thumbnail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Read current blogs
    let blogsData = { blogs: [] };
    try {
      blogsData = JSON.parse(readFileSync(blogsPath, "utf-8"));
    } catch {
      blogsData = { blogs: [] };
    }

    const newBlog = {
      id: id || Date.now().toString(),
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      title,
      excerpt,
      content,
      thumbnail,
      author: "Blog Team",
      date: date || new Date().toISOString().split("T")[0],
      category: category || "General",
    };

    // Check if updating existing blog
    const existingIndex = blogsData.blogs.findIndex((b: any) => b.id === newBlog.id);
    if (existingIndex >= 0) {
      blogsData.blogs[existingIndex] = newBlog;
    } else {
      blogsData.blogs.unshift(newBlog);
    }

    // Save to file
    writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));

    res.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Blog save error:", error);
    res.status(500).json({ error: "Failed to save blog" });
  }
});

// DELETE blog
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    let blogsData = JSON.parse(readFileSync(blogsPath, "utf-8"));
    blogsData.blogs = blogsData.blogs.filter((b: any) => b.id !== id);

    writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;
