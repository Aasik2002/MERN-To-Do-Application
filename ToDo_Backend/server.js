const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection (fixed)
mongoose.connect('mongodb://localhost:27017/todoapp')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Schema
const todoSchema = new mongoose.Schema({
    title:{
        required: true,
        type: String
    },
    description: String
});

// Model
const TodoModel = mongoose.model('Todo', todoSchema);

// Create Todo (POST)
app.post('/todos', async (req, res) => {
    try {
        const { title, description } = req.body;

        const newTodo = new TodoModel({ title, description });
        await newTodo.save(); // important

        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Get all Todos (GET)
app.get('/todos', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.status(200).json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update Todo (PUT)
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;   // ✅ Correct

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true } // optional but good: returns updated data
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json(updatedTodo); // send response
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Delete Todo (DELETE)
app.delete('/todos/:id', async (req, res) => {
   try {
         const id = req.params.id; // ✅ Correct
         await TodoModel.findByIdAndDelete(id);
         res.status(204).end();} 
    catch (error) {
         console.log(error);
         res.status(500).json({ message: error.message });
    }
});


// Start server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
