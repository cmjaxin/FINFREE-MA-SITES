import { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const isProduction = process.env.NODE_ENV === "production";
const sourceFilePath = isProduction
  ? "/var/task/dist/public/blogs.json"
  : join(process.cwd(), "client/src/data/blogs.json");
const tmpPath = "/tmp/blogs.json";

const defaultBlogs = {
  blogs: [
    {
      id: "1789674689474",
      slug: "first-time-home-buyer-tips",
      title: "First Time Home Buyer Tips",
      excerpt: "Essential tips and guidance for first-time home buyers to make your home purchase journey smoother.",
      content: "<h2>Getting Started as a First-Time Home Buyer</h2><p>Buying your first home is one of the biggest financial decisions you'll make. Here are some essential tips to help guide you through the process:</p><h3>1. Get Pre-Approved for a Mortgage</h3><p>Before you start house hunting, get pre-approved for a mortgage. This will show sellers you're a serious buyer and help you understand your budget.</p><h3>2. Save for a Down Payment</h3><p>While down payment requirements vary, having a larger down payment can help you get better interest rates and avoid PMI (Private Mortgage Insurance).</p><h3>3. Check Your Credit Score</h3><p>Your credit score directly impacts the interest rate you'll receive. Take time to improve your credit before applying for a mortgage.</p><h3>4. Get Pre-Approved</h3><p>A mortgage pre-approval is stronger than a pre-qualification and shows sellers you can actually get financing.</p>",
      thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop",
      author: "Blog Team",
      date: "2026-09-17",
      category: "Home Buying Tips",
    },
  ],
};

function getBlogs() {
  // In production, try /tmp first (persistent within container)
  if (isProduction) {
    try {
      if (existsSync(tmpPath)) {
        const data = readFileSync(tmpPath, "utf-8");
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn("Could not read /tmp/blogs.json");
    }
    // Fallback to default blogs
    return defaultBlogs;
  }

  // In development, try source file first
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
    return defaultBlogs;
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
