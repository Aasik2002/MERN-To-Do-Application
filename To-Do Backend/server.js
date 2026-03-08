// Using Express and using mongoose to connect to MongoDB and create a simple API for a to-do list application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an instance of Express
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define a Mongoose schema and model for todo items
// ✅ FIX 1: Changed "discription" to "description"
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  description: {
    type: String,
    required: true
  }
});

// Create a Mongoose model based on the schema
const Todo = mongoose.model('Todo', todoSchema);

// Create a new todo item
// ✅ FIX 2: Changed "discription" to "description"
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all todo items
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update a todo item by ID
// ✅ FIX 3: Changed "discription" to "description"
app.put('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a todo item by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }

    res.json({ message: 'Todo deleted successfully', deletedTodo });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: err.message });
  }
});

// Start the server on port 8000
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});