import express from "express";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = fileURLToPath(new URL(".", import.meta.url));
// Try multiple possible paths for blogs.json
const possiblePaths = [
  join(process.cwd(), "client/src/data/blogs.json"),
  join(process.cwd(), "../client/src/data/blogs.json"),
  join(__dirname, "../../client/src/data/blogs.json"),
];
let blogsPath = possiblePaths[0];
for (const path of possiblePaths) {
  if (existsSync(path)) {
    blogsPath = path;
    break;
  }
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
