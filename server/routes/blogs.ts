import express from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Determine blogs storage location
const isProduction = process.env.NODE_ENV === "production";
let blogsPath: string;

if (isProduction) {
  // In production, try multiple locations
  const possiblePaths = [
    "/tmp/blogs.json",
    join("/var/tmp", "blogs.json"),
    join(process.cwd(), "blogs.json"),
    join(process.cwd(), "client/src/data/blogs.json"),
  ];

  blogsPath = possiblePaths[0]; // Default to /tmp

  // Try to find existing file
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      blogsPath = path;
      console.log(`Found blogs at: ${blogsPath}`);
      break;
    }
  }
} else {
  // In development, use source file
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

// Ensure directory exists and file is initialized
function initializeBlogsFile() {
  try {
    const dir = blogsPath.substring(0, blogsPath.lastIndexOf("/"));
    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    if (!existsSync(blogsPath)) {
      writeFileSync(blogsPath, JSON.stringify({ blogs: [] }, null, 2));
    }
  } catch (error) {
    console.error("Failed to initialize blogs file:", error);
  }
}

initializeBlogsFile();

// Helper to get blogs
async function getBlogs() {
  try {
    const data = readFileSync(blogsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read blogs:", error);
    return { blogs: [] };
  }
}

// Helper to save blogs
async function saveBlogs(blogsData: any) {
  try {
    writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));
    return true;
  } catch (error) {
    console.error("Failed to save blogs:", error);
    return false;
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
