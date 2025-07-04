const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database('./reservations.db');
db.run(`CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/book', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.send('請填寫所有欄位');
  db.run("INSERT INTO reservations (name, phone) VALUES (?, ?)", [name, phone], err => {
    if (err) return res.send('儲存失敗');
    res.redirect('/success.html');
  });
});

app.get('/success.html', (req, res) => res.send('<h3>✅ 預約成功</h3><a href="/">回首頁</a>'));

module.exports = app;
