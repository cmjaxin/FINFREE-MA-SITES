import { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// Use a persistent tmp directory for Vercel
const blogsPath = "/tmp/blogs.json";

// Initialize blogs file
function initBlogs() {
  try {
    const dir = blogsPath.substring(0, blogsPath.lastIndexOf("/"));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    if (!existsSync(blogsPath)) {
      writeFileSync(blogsPath, JSON.stringify({ blogs: [] }, null, 2));
    }
  } catch (e) {
    console.error("Init error:", e);
  }
}

// Get blogs
function getBlogs() {
  try {
    initBlogs();
    const data = readFileSync(blogsPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Read error:", e);
    return { blogs: [] };
  }
}

// Save blogs
function saveBlogs(blogsData: any) {
  try {
    initBlogs();
    writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));
    return true;
  } catch (e) {
    console.error("Write error:", e);
    return false;
  }
}

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
