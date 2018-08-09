const express = require('express')
const app = express()
// const morgan = require('morgan')
const PORT = process.env.PORT || 8080
// const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))
// const db = require('./db')

// db.sync().then(() => console.log('Database synced!'))

// app.use(morgan('dev'))
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res, next) => {
  res.send({test: 'data'})
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))

module.exports = app
