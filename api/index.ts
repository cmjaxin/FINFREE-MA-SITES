import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blogsPath = "/tmp/blogs.json";

function getBlogs() {
  try {
    if (existsSync(blogsPath)) {
      const data = readFileSync(blogsPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading blogs:", e);
  }
  return {
    blogs: [
      {
        id: "1789674689474",
        slug: "first-time-home-buyer-tips",
        title: "First Time Home Buyer Tips",
        excerpt: "Essential tips and guidance for first-time home buyers to make your home purchase journey smoother.",
        content:
          "<h2>Getting Started as a First-Time Home Buyer</h2><p>Buying your first home is one of the biggest financial decisions you'll make. Here are some essential tips to help guide you through the process:</p><h3>1. Get Pre-Approved for a Mortgage</h3><p>Before you start house hunting, get pre-approved for a mortgage. This will show sellers you're a serious buyer and help you understand your budget.</p><h3>2. Save for a Down Payment</h3><p>While down payment requirements vary, having a larger down payment can help you get better interest rates and avoid PMI (Private Mortgage Insurance).</p><h3>3. Check Your Credit Score</h3><p>Your credit score directly impacts the interest rate you'll receive. Take time to improve your credit before applying for a mortgage.</p><h3>4. Get Pre-Approved</h3><p>A mortgage pre-approval is stronger than a pre-qualification and shows sellers you can actually get financing.</p>",
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop",
        author: "Blog Team",
        date: "2026-09-17",
        category: "Home Buying Tips",
      },
    ],
  };
}

function saveBlogs(data: any) {
  try {
    const dir = path.dirname(blogsPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(blogsPath, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error("Error saving blogs:", e);
    return false;
  }
}

// GET /api/blogs
app.get("/api/blogs", (req: any, res: any) => {
  res.json(getBlogs());
});

// POST /api/blogs
app.post("/api/blogs", (req: any, res: any) => {
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
    res.json({ success: true, blog: newBlog });
  } else {
    res.status(500).json({ error: "Failed to save blog" });
  }
});

// DELETE /api/blogs/:id
app.delete("/api/blogs/:id", (req: any, res: any) => {
  const { id } = req.params;
  let blogsData = getBlogs();
  const originalCount = blogsData.blogs.length;
  blogsData.blogs = blogsData.blogs.filter((b: any) => b.id !== id);

  if (blogsData.blogs.length < originalCount) {
    if (saveBlogs(blogsData)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to delete" });
    }
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return new Promise((resolve) => {
    app(req as any, res as any, () => {
      resolve(undefined);
    });
  });
}
