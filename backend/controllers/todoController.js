const Todo = require('../models/Todo');

const getTodos = async (_request, response) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  response.status(200).json(todos);
};

const createTodo = async (request, response) => {
  const { title } = request.body;

  if (!title || !title.trim()) {
    return response.status(400).json({ message: 'Title is required' });
  }

  const todo = await Todo.create({
    title: title.trim(),
  });

  response.status(201).json(todo);
};

const updateTodo = async (request, response) => {
  const { id } = request.params;
  const { title, completed } = request.body;

  const todo = await Todo.findById(id);

  if (!todo) {
    return response.status(404).json({ message: 'Todo not found' });
  }

  if (typeof title === 'string' && title.trim()) {
    todo.title = title.trim();
  }

  if (typeof completed === 'boolean') {
    todo.completed = completed;
  }

  const updatedTodo = await todo.save();
  response.status(200).json(updatedTodo);
};

const deleteTodo = async (request, response) => {
  const { id } = request.params;

  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    return response.status(404).json({ message: 'Todo not found' });
  }

  response.status(200).json({ message: 'Todo deleted successfully' });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
