// index.js (серверная часть)
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const path = require('path')

const app = express()
const port = 4000

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(cookieParser())

const db = new sqlite3.Database(path.resolve(__dirname, 'database.db'))

// Инициализация таблиц

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS capsules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      timestamp TEXT,
      type TEXT,
      raw TEXT,
      user TEXT
    )
  `)
})

// Регистрация
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password || !name) return res.status(400).send('Invalid data')
  if (password.length < 6) return res.status(400).send('Password must be at least 6 characters')

  const hashedPassword = await bcrypt.hash(password, 10)

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    function (err) {
      if (err) return res.status(500).send('User already exists')
      res.status(201).send({ name, email })
    }
  )
})

// Логин
const loginAttempts = {}
const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 минут

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).send('Missing credentials')

  if (!loginAttempts[email]) loginAttempts[email] = []
  const now = Date.now()
  loginAttempts[email] = loginAttempts[email].filter(ts => now - ts < WINDOW_MS)
  if (loginAttempts[email].length >= MAX_ATTEMPTS) return res.status(429).send('Too many login attempts')

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err || !row) return res.status(401).send('User not found')

    const match = await bcrypt.compare(password, row.password)
    if (!match) {
      loginAttempts[email].push(Date.now())
      return res.status(401).send('Invalid password')
    }

    const jwt = require('jsonwebtoken')
    const token = jwt.sign({ name: row.name, email: row.email }, 'secret_key', { expiresIn: '2h' })
    res.cookie('token', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 })
    res.status(200).send({ name: row.name, email: row.email })
  })
})

// Сохранение капсулы
app.post('/capsule', (req, res) => {
  const { title, timestamp, type, raw, user } = req.body
  if (!title || !timestamp || !type || !raw) {
    return res.status(400).send('Invalid capsule data')
  }

  db.run(
    'INSERT INTO capsules (title, timestamp, type, raw, user) VALUES (?, ?, ?, ?, ?)',
    [title, timestamp, type, raw, user],
    function (err) {
      if (err) return res.status(500).send('DB error')
      res.status(201).send({ id: this.lastID })
    }
  )
})

// Получение всех капсул
app.get('/capsule', (req, res) => {
  db.all('SELECT * FROM capsules ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).send('DB error')
    res.send(rows)
  })
})

// Запуск
app.get('/me', (req, res) => {
  const jwt = require('jsonwebtoken')
  const token = req.cookies.token
  if (!token) return res.status(401).send('Not authenticated')
  try {
    const user = jwt.verify(token, 'secret_key')
    res.send(user)
  } catch (e) {
    res.status(401).send('Invalid token')
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
