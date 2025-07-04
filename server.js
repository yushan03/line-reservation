const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./reservations.db');
db.run(`CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  time TEXT,
  area TEXT,
  people INTEGER,
  payment TEXT,
  notify TEXT,
  name TEXT,
  phone TEXT,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/book', (req, res) => {
  const { date, time, area, name, phone, people, payment, note, notify } = req.body;
  if (!date || !time || !area || !name || !phone || !payment || !people || !notify) {
    return res.send('請填寫所有欄位');
  }
  const sql = `INSERT INTO reservations (date, time, area, name, phone, people, payment, note, notify) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [date, time, area, name, phone, people, payment, note, notify], err => {
    if (err) return res.send('寫入失敗');
    res.redirect('/');
  });
});

module.exports = app;
