// server/index.ts
import express2 from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// server/routes/blogs.ts
import express from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
var router = express.Router();
var __dirname = fileURLToPath(new URL(".", import.meta.url));
var isProduction = process.env.NODE_ENV === "production";
var blogsPath;
if (isProduction) {
  const possiblePaths = [
    "/tmp/blogs.json",
    join("/var/tmp", "blogs.json"),
    join(process.cwd(), "blogs.json"),
    join(process.cwd(), "client/src/data/blogs.json")
  ];
  blogsPath = possiblePaths[0];
  for (const path2 of possiblePaths) {
    if (existsSync(path2)) {
      blogsPath = path2;
      console.log(`Found blogs at: ${blogsPath}`);
      break;
    }
  }
} else {
  const possiblePaths = [
    join(process.cwd(), "client/src/data/blogs.json"),
    join(process.cwd(), "../client/src/data/blogs.json"),
    join(__dirname, "../../client/src/data/blogs.json")
  ];
  blogsPath = possiblePaths[0];
  for (const path2 of possiblePaths) {
    if (existsSync(path2)) {
      blogsPath = path2;
      break;
    }
  }
}
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
async function getBlogs() {
  try {
    const data = readFileSync(blogsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read blogs:", error);
    return { blogs: [] };
  }
}
async function saveBlogs(blogsData) {
  try {
    writeFileSync(blogsPath, JSON.stringify(blogsData, null, 2));
    return true;
  } catch (error) {
    console.error("Failed to save blogs:", error);
    return false;
  }
}
router.get("/", async (req, res) => {
  try {
    const blogsData = await getBlogs();
    res.json(blogsData);
  } catch (error) {
    console.error("Failed to read blogs:", error);
    res.status(500).json({ error: "Failed to read blogs" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { id, slug, title, excerpt, content, thumbnail, category, date } = req.body;
    if (!title || !excerpt || !content || !thumbnail) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let blogsData = await getBlogs();
    const newBlog = {
      id: id || Date.now().toString(),
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      title,
      excerpt,
      content,
      thumbnail,
      author: "Blog Team",
      date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      category: category || "General"
    };
    const existingIndex = blogsData.blogs.findIndex((b) => b.id === newBlog.id);
    if (existingIndex >= 0) {
      blogsData.blogs[existingIndex] = newBlog;
    } else {
      blogsData.blogs.unshift(newBlog);
    }
    await saveBlogs(blogsData);
    res.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Blog save error:", error);
    res.status(500).json({ error: "Failed to save blog" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let blogsData = await getBlogs();
    blogsData.blogs = blogsData.blogs.filter((b) => b.id !== id);
    await saveBlogs(blogsData);
    res.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});
var blogs_default = router;

// server/index.ts
var __filename = fileURLToPath2(import.meta.url);
var __dirname2 = path.dirname(__filename);
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json());
  app.use(express2.urlencoded({ extended: true }));
  app.use("/api/blogs", blogs_default);
  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname2, "public") : path.resolve(__dirname2, "..", "dist", "public");
  app.use(express2.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
  const port = process.env.PORT || 3e3;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
