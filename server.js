const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CHANGE_THIS_PASSWORD";
const SESSION_SECRET = process.env.SESSION_SECRET || "CHANGE_THIS_SESSION_SECRET";

const db = new Database("boy-astato.db");
db.exec(`
CREATE TABLE IF NOT EXISTS music (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  cover TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL
);
`);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false, maxAge: 86400000 }
}));
app.use(express.static(__dirname));

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

function adminOnly(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ error: "Não autenticado." });
}

app.get("/api/content", (req, res) => {
  const music = db.prepare("SELECT * FROM music ORDER BY id DESC").all();
  const videos = db.prepare("SELECT * FROM videos ORDER BY id DESC").all();
  res.json({ music, videos });
});

app.post("/api/login", (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Senha incorreta." });
  }
  req.session.admin = true;
  res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.admin) });
});

app.post("/api/music", adminOnly, (req, res) => {
  const { title, url, cover = "" } = req.body || {};
  if (!title || !url) return res.status(400).json({ error: "Título e link são obrigatórios." });
  const info = db.prepare("INSERT INTO music (title,url,cover) VALUES (?,?,?)").run(title, url, cover);
  res.json({ id: info.lastInsertRowid });
});

app.delete("/api/music/:id", adminOnly, (req, res) => {
  db.prepare("DELETE FROM music WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

app.post("/api/videos", adminOnly, (req, res) => {
  const { title, url } = req.body || {};
  if (!title || !url) return res.status(400).json({ error: "Título e link são obrigatórios." });
  const info = db.prepare("INSERT INTO videos (title,url) VALUES (?,?)").run(title, url);
  res.json({ id: info.lastInsertRowid });
});

app.delete("/api/videos/:id", adminOnly, (req, res) => {
  db.prepare("DELETE FROM videos WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Boy Ástato V3: http://localhost:${PORT}`);
});
