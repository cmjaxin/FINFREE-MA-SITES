import { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// In Vercel production: /var/task is the project root
// In local dev: process.cwd() is the project root
const isProduction = process.env.NODE_ENV === "production";
const projectRoot = isProduction ? "/var/task" : process.cwd();

// Primary: source file in git (persistent)
const sourceFilePath = join(projectRoot, "client/src/data/blogs.json");
// Fallback: temp storage (session-only)
const tmpPath = "/tmp/blogs.json";

let blogsPath = sourceFilePath;

// Initialize and check paths
function initBlogs() {
  try {
    // Try source file first
    if (existsSync(sourceFilePath)) {
      blogsPath = sourceFilePath;
      return;
    }
  } catch (e) {
    console.warn("Source file not accessible:", sourceFilePath);
  }

  // Fall back to tmp
  try {
    const dir = tmpPath.substring(0, tmpPath.lastIndexOf("/"));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    if (!existsSync(tmpPath)) {
      writeFileSync(tmpPath, JSON.stringify({ blogs: [] }, null, 2));
    }
    blogsPath = tmpPath;
    console.log("Using temporary storage:", tmpPath);
  } catch (e) {
    console.error("Failed to initialize temp storage:", e);
  }
}

// Get blogs from source file (always read from git-tracked file if available)
function getBlogs() {
  try {
    // Always try source file first (most recent committed version)
    if (existsSync(sourceFilePath)) {
      const data = readFileSync(sourceFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not read source file, falling back to tmp:", e);
  }

  // Fallback to tmp if source unavailable
  try {
    const data = readFileSync(tmpPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Read error:", e);
    return { blogs: [] };
  }
}

// Save blogs to both locations if possible
function saveBlogs(blogsData: any) {
  let savedToSource = false;
  let savedToTmp = false;

  // Try to save to source file (persistent in git)
  try {
    writeFileSync(sourceFilePath, JSON.stringify(blogsData, null, 2));
    savedToSource = true;
    console.log("✓ Saved to source file:", sourceFilePath);
  } catch (e: any) {
    console.warn("⚠ Could not save to source file (read-only in production):", e?.message);
  }

  // Always try to save to tmp as well
  try {
    const tmpDir = tmpPath.substring(0, tmpPath.lastIndexOf("/"));
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir, { recursive: true });
    }
    writeFileSync(tmpPath, JSON.stringify(blogsData, null, 2));
    savedToTmp = true;
    console.log("✓ Saved to tmp:", tmpPath);
  } catch (e: any) {
    console.error("✗ Could not save to tmp:", e?.message);
  }

  // Success if saved to at least one location
  if (savedToSource || savedToTmp) {
    console.log(`✓ Blog save successful (source: ${savedToSource}, tmp: ${savedToTmp})`);
    return true;
  }

  console.error("✗ Failed to save to any location");
  return false;
}

// Initialize on load
initBlogs();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    const blogsData = getBlogs();
    return res.status(200).json(blogsData);
  }

  if (req.method === "POST") {
    const { id, slug, title, excerpt, content, thumbnail, category, date } =
      req.body;

    if (!title || !excerpt || !content || !thumbnail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let blogsData = getBlogs();

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

    const existingIndex = blogsData.blogs.findIndex(
      (b: any) => b.id === newBlog.id
    );
    if (existingIndex >= 0) {
      blogsData.blogs[existingIndex] = newBlog;
    } else {
      blogsData.blogs.unshift(newBlog);
    }

    if (saveBlogs(blogsData)) {
      return res.status(200).json({ success: true, blog: newBlog });
    } else {
      return res.status(500).json({ error: "Failed to save blog" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    let blogsData = getBlogs();
    blogsData.blogs = blogsData.blogs.filter((b: any) => b.id !== id);

    if (saveBlogs(blogsData)) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Failed to delete blog" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
