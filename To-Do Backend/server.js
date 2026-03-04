// Using Express
const express = require('express');

// Create an instance of Express
const app = express();

app.use(express.json());
// Define a route for the root URL
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// sample in-memory data store for todo items
let todos = [];

// create a new todo item
app.post('/todos',(req,res)=>{
  const {title,discription} = req.body;
  const newtodo = {
    id :todos.length + 1,
    title,
    discription
  }
  todos.push(newtodo);
  console.log(todos);
  res.status(201).json(newtodo);
})

// Get all todo items
app.get('/todos',(req,res)=>{
  res.json(todos);
});


// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

