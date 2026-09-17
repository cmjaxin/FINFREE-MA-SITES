import express from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Check if we're in production (Vercel) or local
const isProduction = process.env.NODE_ENV === "production";
const useKV = isProduction && process.env.KV_REST_API_URL;

// Lazy load KV (async import)
let kvModule: any = null;
async function initKV() {
  if (useKV && !kvModule) {
    try {
      kvModule = await import("@vercel/kv");
    } catch (e) {
      console.error("Failed to initialize KV:", e);
    }
  }
}

// Fallback: use local file in dev mode
let blogsPath: string;
if (!useKV) {
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

// Helper to get blogs
async function getBlogs() {
  if (useKV) {
    await initKV();
    if (kvModule?.kv) {
      try {
        const data = await kvModule.kv.get("blogs");
        return data ? JSON.parse(data as string) : { blogs: [] };
      } catch (error) {
        console.error("KV read error:", error);
        return { blogs: [] };
      }
    }
  }

  // Fallback to file
  try {
    const data = readFileSync(blogsPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { blogs: [] };
  }
}

// Helper to save blogs
async function saveBlogs(blogsData: any) {
  if (useKV) {
    await initKV();
    if (kvModule?.kv) {
      try {
        await kvModule.kv.set("blogs", JSON.stringify(blogsData));
        return;
      } catch (error) {
        console.error("KV write error:", error);
      }
    }
  }
}

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogsData = await getBlogs();
    res.json(blogsData);
  } catch (error) {
    console.error("Failed to read blogs:", error);
    res.status(500).json({ error: "Failed to read blogs" });
  }
});

// POST create/update blog
router.post("/", async (req, res) => {
  try {
    const { id, slug, title, excerpt, content, thumbnail, category, date } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content || !thumbnail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Read current blogs
    let blogsData = await getBlogs();

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

    // Save blogs
    await saveBlogs(blogsData);

    res.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Blog save error:", error);
    res.status(500).json({ error: "Failed to save blog" });
  }
});

// DELETE blog
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let blogsData = await getBlogs();
    blogsData.blogs = blogsData.blogs.filter((b: any) => b.id !== id);

    await saveBlogs(blogsData);

    res.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;
