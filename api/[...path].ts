import { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const isProduction = process.env.NODE_ENV === "production";
const projectRoot = isProduction ? "/var/task" : process.cwd();
const sourceFilePath = isProduction
  ? join(projectRoot, "dist/public/blogs.json")
  : join(projectRoot, "client/src/data/blogs.json");
const tmpPath = "/tmp/blogs.json";

function getBlogs() {
  try {
    if (existsSync(sourceFilePath)) {
      const data = readFileSync(sourceFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not read source file");
  }

  try {
    const data = readFileSync(tmpPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { blogs: [] };
  }
}

function saveBlogs(blogsData: any) {
  try {
    const tmpDir = "/tmp";
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir, { recursive: true });
    }
    writeFileSync(tmpPath, JSON.stringify(blogsData, null, 2));
    return true;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Route: GET /api/blogs
  if (req.method === "GET") {
    const blogsData = getBlogs();
    return res.status(200).json(blogsData);
  }

  // Route: POST /api/blogs (create or update)
  if (req.method === "POST") {
    const { id, slug, title, excerpt, content, thumbnail, category, date } = req.body;

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

    const existingIndex = blogsData.blogs.findIndex((b: any) => b.id === newBlog.id);
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

  // Route: DELETE /api/blogs/:id
  if (req.method === "DELETE") {
    const path = (req.query.path as string[])?.[0] || "";
    const id = path;

    if (!id) {
      return res.status(400).json({ error: "Missing blog ID" });
    }

    let blogsData = getBlogs();
    const originalCount = blogsData.blogs.length;
    blogsData.blogs = blogsData.blogs.filter((b: any) => b.id !== id);

    if (blogsData.blogs.length < originalCount) {
      if (saveBlogs(blogsData)) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(500).json({ error: "Failed to delete" });
      }
    } else {
      return res.status(404).json({ error: "Blog not found" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
