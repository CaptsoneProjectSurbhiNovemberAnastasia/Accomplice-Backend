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
  res.send({users: [
    {name: 'Test1', userid: 1},
    {name: 'Test2', userid: 2},
    {name: 'Test3', userid: 3},
    {name: 'Test4', userid: 4},
    {name: 'Test5', userid: 5},
    {name: 'Test6', userid: 6}
  ]})
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))

module.exports = app
