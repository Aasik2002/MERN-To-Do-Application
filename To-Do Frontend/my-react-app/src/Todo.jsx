import React, { useState, useEffect } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit States
  const [editingID, setEditingID] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiurl = "http://localhost:8000";

  // Fetch all todos on page load
  useEffect(() => {
    getitem();
  }, []);

  const getitem = async () => {
    try {
      const res = await fetch(apiurl + "/todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.log("Fetch error:", err.message);
      setError("🔴 Failed to fetch todos. Server may be down.");
    }
  };

  // Handle Submit - Create new todo
  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (title.trim() === "" || description.trim() === "") {
      setError("⚠️ Please fill in both Title and Description fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const data = await res.json();
        setTodos([...todos, data]);
        setMessage("✅ Todo item created successfully!");
        setTitle("");
        setDescription("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("❌ Server responded with error. Status: " + res.status);
      }
    } catch (err) {
      console.log("Catch block error:", err.message);
      setError("🔴 Network Error: Server is not running. Please start your backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Button Click
  const handleEdit = (item) => {
    setEditingID(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setMessage("");
    setError("");
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingID(-1);
    setEditTitle("");
    setEditDescription("");
  };

  // Handle Update - Update existing todo
  const handleUpdate = async () => {
    setMessage("");
    setError("");

    if (editTitle.trim() === "" || editDescription.trim() === "") {
      setError("⚠️ Please fill in both Title and Description fields.");
      return;
    }

    try {
      const res = await fetch(apiurl + "/todos/" + editingID, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });

      if (res.ok) {
        const updatedTodos = todos.map((item) => {
          if (item._id === editingID) {
            return { ...item, title: editTitle, description: editDescription };
          }
          return item;
        });
        setTodos(updatedTodos);
        setMessage("✅ Todo updated successfully!");
        setEditingID(-1);
        setEditTitle("");
        setEditDescription("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("❌ Failed to update todo. Status: " + res.status);
      }
    } catch (err) {
      console.log("Update error:", err.message);
      setError("🔴 Network Error: Unable to update todo.");
    }
  };

  // Handle Delete - Delete todo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const res = await fetch(apiurl + "/todos/" + id, {
        method: "DELETE",
      });

      if (res.ok) {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
        setMessage("🗑️ Todo deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("❌ Failed to delete todo. Status: " + res.status);
      }
    } catch (err) {
      console.log("Delete error:", err.message);
      setError("🔴 Network Error: Unable to delete todo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">

      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
          ToDo Project <span className="text-amber-500">MERN</span>
        </h1>
      </div>

      {/* Main Card Section */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h3>

        {/* Success Message */}
        {message !== "" && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              border: "2px solid #28a745",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        {/* Error Message */}
        {error !== "" && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              border: "2px solid #dc3545",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}

        {/* Input Fields Section */}
        <div className="space-y-4">
          <input
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3
            focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all placeholder-gray-400"
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3
            focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all placeholder-gray-400"
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg px-6 py-3.5 rounded-xl
            shadow-lg shadow-amber-500/30 transition-all duration-200 active:scale-95"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Task List Section */}
      <div className="w-full max-w-2xl mt-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">
          Tasks <span className="text-amber-500">({todos.length})</span>
        </h3>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-400">No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            todos.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                {/* Check if this item is being edited */}
                {editingID === item._id ? (
                  // EDIT MODE - Show input fields
                  <div className="space-y-4">
                    <input
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3
                      focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                      type="text"
                      placeholder="Edit Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />

                    <input
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3
                      focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                      type="text"
                      placeholder="Edit Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />

                    {/* Update & Cancel Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg
                        transition-all duration-200 active:scale-95 flex items-center gap-1"
                      >
                        <span>✅</span>
                        <span>Update</span>
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg
                        transition-all duration-200 active:scale-95 flex items-center gap-1"
                      >
                        <span>❌</span>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE - Show task content
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800">{item.title}</h4>
                      <p className="text-gray-500">{item.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg
                        transition-all duration-200 active:scale-95 flex items-center gap-1"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg
                        transition-all duration-200 active:scale-95 flex items-center gap-1"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;