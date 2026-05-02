import { useEffect, useState } from 'react';
import './App.css';

const emptyForm = {
  title: '',
};

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  const formatDate = (value) => {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const fetchTodos = async () => {
    try {
      setError('');
      setIsLoading(true);
      const response = await fetch('/api/todos');

      if (!response.ok) {
        throw new Error('Unable to load todos');
      }

      const data = await response.json();
      setTodos(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      await fetchTodos();
    };

    loadTodos();
  }, []);

  const handleChange = (event) => {
    setFormData({
      title: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError('Please enter a todo title');
      return;
    }

    try {
      setError('');
      setIsSaving(true);

      const requestOptions = {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: formData.title }),
      };

      const endpoint = editingId ? `/api/todos/${editingId}` : '/api/todos';
      const response = await fetch(endpoint, requestOptions);

      if (!response.ok) {
        throw new Error('Unable to save todo');
      }

      setFormData(emptyForm);
      setEditingId(null);
      await fetchTodos();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setFormData({ title: todo.title });
    setError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError('');
  };

  const toggleCompleted = async (todo) => {
    try {
      setError('');
      const response = await fetch(`/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to update todo status');
      }

      await fetchTodos();
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError('');
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unable to delete todo');
      }

      if (editingId === id) {
        cancelEditing();
      }

      await fetchTodos();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="app-header">
        <h1>My Todo List</h1>
        <p className="subtitle">Plan your day, track progress, and finish tasks on time.</p>
        <div className="stats-row">
          <div className="stat-item">
            <span>Total</span>
            <strong>{todos.length}</strong>
          </div>
          <div className="stat-item">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
          <div className="stat-item">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="card">
          <div className="card-header">
            <h2>{editingId ? 'Edit todo' : 'Create todo'}</h2>
            <p>{editingId ? 'Update the selected task.' : 'Send a new task to MongoDB.'}</p>
          </div>

          <form className="todo-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Todo title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Prepare REST API presentation"
            />

            <div className="button-row">
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingId ? 'Update todo' : 'Add todo'}
              </button>
              {editingId && (
                <button type="button" className="secondary-button" onClick={cancelEditing}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && <p className="message error-message">{error}</p>}
        </article>

        <article className="card">
          <div className="card-header">
            <h2>Todo table</h2>
            <p>Manage all tasks in one place.</p>
          </div>

          {isLoading ? (
            <p className="message">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="message">No todos yet. Add your first task from the form.</p>
          ) : (
            <div className="table-wrap">
              <table className="todo-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr key={todo._id}>
                      <td className={todo.completed ? 'completed' : ''}>{todo.title}</td>
                      <td>
                        <span className={`status-pill ${todo.completed ? 'done' : 'pending'}`}>
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td>{formatDate(todo.updatedAt || todo.createdAt)}</td>
                      <td>
                        <div className="todo-actions">
                          <button type="button" onClick={() => toggleCompleted(todo)}>
                            {todo.completed ? 'Pending' : 'Complete'}
                          </button>
                          <button type="button" className="secondary-button" onClick={() => startEditing(todo)}>
                            Edit
                          </button>
                          <button type="button" className="danger-button" onClick={() => deleteTodo(todo._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
