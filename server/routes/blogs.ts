import express from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "cmjaxin/FINFREE-MA-SITES";
const BLOGS_FILE_PATH = "client/src/data/blogs.json";

// Check if we're in production (Vercel) or local
const isProduction = process.env.NODE_ENV === "production";
const useGitHub = isProduction && GITHUB_TOKEN;

// Fallback: use local file in dev mode
let blogsPath: string;
if (!useGitHub) {
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

// Helper to get blogs from GitHub
async function getBlogsFromGitHub() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );

    if (!response.ok) {
      console.error("GitHub fetch failed:", response.status);
      return { blogs: [] };
    }

    const data = await response.text();
    return JSON.parse(data);
  } catch (error) {
    console.error("GitHub read error:", error);
    return { blogs: [] };
  }
}

// Helper to save blogs to GitHub
async function saveBlogsToGitHub(blogsData: any) {
  try {
    // First, get the current file SHA for update
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );

    const getResult: any = await getResponse.json();
    const sha = getResult.sha;

    // Update the file
    const content = Buffer.from(JSON.stringify(blogsData, null, 2)).toString(
      "base64"
    );

    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update blogs via admin panel",
          content: content,
          sha: sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      console.error("GitHub update failed:", updateResponse.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("GitHub write error:", error);
    return false;
  }
}

// Helper to get blogs
async function getBlogs() {
  if (useGitHub) {
    return await getBlogsFromGitHub();
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
  if (useGitHub) {
    return await saveBlogsToGitHub(blogsData);
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
