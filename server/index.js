import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(__dirname, "data");
const submissionsFile = path.join(dataDir, "submissions.json");
const feedbackFile = path.join(dataDir, "feedback.json");
const port = Number(process.env.PORT || 8787);

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(submissionsFile);
  } catch {
    await fs.writeFile(submissionsFile, "[]\n", "utf8");
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "portfolio-contact-api" });
});

app.post("/api/contact", async (req, res) => {
  const {
    name = "",
    email = "",
    company = "",
    projectType = "",
    budget = "",
    timeline = "",
    message = "",
    website = ""
  } = req.body || {};

  if (website) {
    return res.status(400).json({ message: "Spam protection triggered." });
  }

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (message.trim().length < 20) {
    return res.status(400).json({ message: "Please provide a slightly more detailed message." });
  }

  const submission = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    company: company.trim(),
    projectType: projectType.trim(),
    budget: budget.trim(),
    timeline: timeline.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    await ensureStorage();
    const existing = JSON.parse(await fs.readFile(submissionsFile, "utf8"));
    existing.unshift(submission);
    await fs.writeFile(submissionsFile, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
    return res.status(201).json({
      message: "Message received. I will get back to you soon.",
      submissionId: submission.id
    });
  } catch (error) {
    console.error("Failed to store contact submission", error);
    return res.status(500).json({ message: "Unable to save your message right now." });
  }
});

app.post("/api/feedback", async (req, res) => {
  const {
    colleagueName = "",
    company = "",
    role = "",
    email = "",
    rating = 5,
    message = ""
  } = req.body || {};

  if (!colleagueName.trim() || !email.trim() || !company.trim() || !message.trim()) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ message: "Please provide a more detailed feedback." });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  const feedback = {
    id: crypto.randomUUID(),
    colleagueName: colleagueName.trim(),
    company: company.trim(),
    role: role.trim(),
    email: email.trim(),
    rating: Number(rating),
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    await ensureStorage();
    await fs.mkdir(dataDir, { recursive: true });
    
    let existing = [];
    try {
      existing = JSON.parse(await fs.readFile(feedbackFile, "utf8"));
    } catch {
      existing = [];
    }

    existing.unshift(feedback);
    await fs.writeFile(feedbackFile, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
    return res.status(201).json({
      message: "Thank you for your feedback! It will appear shortly.",
      feedbackId: feedback.id
    });
  } catch (error) {
    console.error("Failed to store feedback", error);
    return res.status(500).json({ message: "Unable to save your feedback right now." });
  }
});

app.get("/api/feedbacks", async (req, res) => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const feedback = JSON.parse(await fs.readFile(feedbackFile, "utf8"));
    res.json(feedback);
  } catch (error) {
    console.error("Failed to retrieve feedback", error);
    res.json([]);
  }
});

// Serve static files with no-cache headers for HTML
app.use(express.static(distDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }
  }
}));
app.get("*", async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  try {
    await fs.access(path.join(distDir, "index.html"));
    return res.sendFile(path.join(distDir, "index.html"));
  } catch {
    return res.status(404).send("Build the frontend first with `npm run build`.");
  }
});

app.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`);
});
