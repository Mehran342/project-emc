const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = './db.json';

// خواندن دیتابیس
function readDB() {
  if (!fs.existsSync(DB_FILE)) return { projects: [], messages: [] };
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// نوشتن دیتابیس
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ورود کاربر
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  res.json({ email });
});

// گرفتن لیست پروژه‌ها
app.get('/api/projects', (req, res) => {
  const db = readDB();
  res.json(db.projects);
});

// ایجاد پروژه جدید
app.post('/api/projects', (req, res) => {
  const db = readDB();
  const project = { id: Date.now().toString(), title: req.body.title };
  db.projects.push(project);
  writeDB(db);
  res.json(project);
});

// گرفتن پیام‌های یک پروژه
app.get('/api/messages/:projectId', (req, res) => {
  const db = readDB();
  const projectId = req.params.projectId;
  const messages = db.messages.filter(m => m.projectId === projectId);
  res.json(messages);
});

// ارسال پیام جدید به پروژه
app.post('/api/messages/:projectId', (req, res) => {
  const db = readDB();
  const projectId = req.params.projectId;
  const { author, text } = req.body;
  const message = { projectId, author, text };
  db.messages.push(message);
  writeDB(db);
  res.json(message);
});

// اجرای سرور روی پورت 4000
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
