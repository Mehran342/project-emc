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
