const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const pg = require('pg')
const { Pool } = pg
const pool = new Pool({
  host : process.env.POSTGRES_HOST,
  user : process.env.POSTGRES_USER,
  password : process.env.POSTGRES_PASSWORD,
  database : process.env.POSTGRES_DB, }
)

morgan.token('postBody', (req) => {
  if (req.method==='POST') {
    return(JSON.stringify(req.body))
  }
})

morgan.token('postError', (req) => {
  if (req.method==='POST' && req.body.title.length > 140) {
    return('Title length should be maximum 140 characters')
  }
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postError :postBody'))

const loadTodos = async () => {
  const { rows } = await pool.query('SELECT * FROM todos')
  return rows
}

const saveTodo = async (todo) => {
  const res = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', [todo.title, todo.completed])
  return res.rows[0]
}

app.get('/todos', async (req, res) => {
  const todos = await loadTodos()
  res.json(todos)
})

app.post('/todos', async (req, res) => {
  if (req.body.title.length > 140) {
    return res.status(400).json({ error: 'Title length should be maximum 140 characters' })
  } else {
    const todo = await saveTodo(req.body)
    res.status(201).json(todo)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
