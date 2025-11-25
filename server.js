const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = './db.json';

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { projects: [], messages: [] };
  return JSON.parse(fs.readFileSync(DB_FILE));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  res.json({ email });
});

app.get('/api/projects', (req, res) => {
  const db = readDB();
  res.json(db.projects);
});

app.post('/api/projects', (req, res) => {
  const db = readDB();
  const project = { id: Date.now().toString(), title: req.body.title || 'Untitled' };
  db.projects.push(project);
  writeDB(db);
  res.json(project);
});

app.get('/api/messages/:projectId', (req, res) => {
  const db = readDB();
  const messages = db.messages.filter(m => m.projectId === req.params.projectId);
  res.json(messages);
});

app.post('/api/messages/:projectId', (req, res) => {
  const db = readDB();
  const msg = {
    id: Date.now().toString(),
    projectId: req.params.projectId,
    author: req.body.author || 'Guest',
    text: req.body.text,
    time: new Date().toISOString()
  };
  db.messages.push(msg);
  writeDB(db);
  res.json(msg);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
