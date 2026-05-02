# Full Stack Todo Demo

This project demonstrates a complete connection between:

- React frontend running on a Vite development server
- Express backend running on a Node.js web server
- MongoDB database storing todo records
- REST API endpoints that can be tested from both the browser and Postman

The goal is not only to make the app work, but also to make it easy to explain live in front of a teacher.

## Project structure

```text
2mayProject/
|-- backend/
|   |-- config/db.js
|   |-- controllers/todoController.js
|   |-- models/Todo.js
|   |-- routes/todoRoutes.js
|   |-- server.js
|   |-- .env
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/App.jsx
|   |-- src/App.css
|   |-- src/index.css
|   `-- vite.config.js
|-- postman/
|   `-- Todo-App.postman_collection.json
|-- package.json
`-- README.md
```

## Tech stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: MongoDB with Mongoose
- API style: REST API
- Testing API manually: Postman

## How data flows in this project

When you type a todo in the frontend and click `Add todo`, this is what happens:

1. React captures the text from the input field.
2. React sends a `POST` request to `/api/todos`.
3. Vite proxy forwards that request to the Express server on port `5000`.
4. Express receives the request and passes it to the route.
5. The route calls the controller function.
6. The controller uses the Mongoose model to save the todo in MongoDB.
7. MongoDB stores the document.
8. Express sends the saved todo back as JSON.
9. React fetches the updated list and shows the new todo on screen.
10. The same saved data is visible from Postman using `GET /api/todos`.

That is the live proof that frontend, backend, web server, and database are connected.

## CRUD operations included

- Create: add a new todo
- Read: fetch all todos from MongoDB
- Update: edit a todo title or mark it complete
- Delete: remove a todo

## Setup instructions

### 1. Prerequisites

Install these before running the project:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Postman](https://www.postman.com/downloads/)

### 2. Start MongoDB

If MongoDB is installed locally, make sure the database server is running.

On many Windows systems, MongoDB can run as a service. If needed, you can start it from Services or with the command prompt depending on how it was installed.

This project uses:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/todo_demo_app
```

That means MongoDB will automatically create a database named `todo_demo_app` when the first record is inserted.

### 3. Install dependencies

The dependencies are already installed in this workspace, but if you want to repeat the setup from scratch:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 4. Run frontend and backend together

From the root folder:

```bash
npm run dev
```

This starts:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

## REST API endpoints

Base URL:

```text
http://localhost:5000/api/todos
```

### 1. Create todo

Method:

```text
POST /api/todos
```

Body:

```json
{
  "title": "Practice backend explanation"
}
```

### 2. Get all todos

Method:

```text
GET /api/todos
```

### 3. Update todo title

Method:

```text
PUT /api/todos/:id
```

Body:

```json
{
  "title": "Updated title from Postman"
}
```

### 4. Mark todo as completed

Method:

```text
PUT /api/todos/:id
```

Body:

```json
{
  "completed": true
}
```

### 5. Delete todo

Method:

```text
DELETE /api/todos/:id
```

## Postman demonstration steps

You can import:

`postman/Todo-App.postman_collection.json`

Then demonstrate this flow:

1. Run `GET /api/todos` and show that the current records are coming from MongoDB.
2. Run `POST /api/todos` to create a new todo.
3. Copy the returned `_id`.
4. Put that value into the Postman variable `todoId`.
5. Run `PUT /api/todos/{{todoId}}` to update the title.
6. Run `PUT /api/todos/{{todoId}}` again with `"completed": true`.
7. Run `GET /api/todos` and show the updated record.
8. Run `DELETE /api/todos/{{todoId}}`.
9. Run `GET /api/todos` again to show the record is removed.

This is strong evidence that the API is working independently of the frontend.

## Code explanation for presentation

### Backend

#### `backend/server.js`

This is the main Express server file.

What to explain line by line:

- We import `express`, `cors`, and `dotenv`.
- We import `connectDatabase()` to connect MongoDB.
- We import `todoRoutes` to keep routes in a separate file.
- `dotenv.config()` loads values from `.env`.
- `app.use(cors())` allows cross-origin access when needed.
- `app.use(express.json())` lets Express read JSON request bodies.
- `app.get('/')` is a test route to confirm the server is alive.
- `app.use('/api/todos', todoRoutes)` connects all todo endpoints.
- The error middleware handles invalid IDs and server errors.
- `startServer()` first connects to MongoDB, then starts the Express server.

#### `backend/config/db.js`

This file only handles database connection.

What to say:

- `mongoose.connect()` connects Node.js to MongoDB.
- Keeping this in a separate file improves readability and reuse.
- If `MONGODB_URI` is missing, we throw an error early.

#### `backend/models/Todo.js`

This file defines the MongoDB document shape using Mongoose.

What to say:

- A schema describes how data should look inside MongoDB.
- Each todo has a `title` and a `completed` status.
- `timestamps: true` automatically creates `createdAt` and `updatedAt`.

#### `backend/controllers/todoController.js`

This file contains business logic.

What to say:

- `getTodos` reads all documents from MongoDB.
- `createTodo` validates the input and inserts a new document.
- `updateTodo` modifies title or completed status.
- `deleteTodo` removes a document from the database.
- Controllers are where request data meets database logic.

#### `backend/routes/todoRoutes.js`

This file maps HTTP methods to controller functions.

What to say:

- `GET /` calls `getTodos`
- `POST /` calls `createTodo`
- `PUT /:id` calls `updateTodo`
- `DELETE /:id` calls `deleteTodo`

This keeps routing simple and easy to explain.

### Frontend

#### `frontend/src/App.jsx`

This is the main React component.

What to say:

- `useState` stores todos, form data, loading state, and editing state.
- `fetchTodos()` loads data from the backend.
- `useEffect()` runs once when the page opens.
- `handleSubmit()` decides whether to create or update.
- `toggleCompleted()` updates only the `completed` field.
- `deleteTodo()` removes a task through the REST API.
- After every change, React fetches the list again so UI always matches MongoDB.

#### `frontend/vite.config.js`

This file adds a proxy.

What to say:

- The frontend runs on `5173`.
- The backend runs on `5000`.
- The proxy forwards `/api` calls from Vite to Express.
- Because of this, frontend code can call `/api/todos` instead of writing the full backend URL.

## Live demo script for teacher

Use this script while presenting. You do not need to memorize it exactly. Read it naturally.

### Part 1. Introduction

Say:

> This project demonstrates communication between four layers: the React frontend, the Vite development server, the Express backend server, and the MongoDB database. I will show that when I create or update a todo in the browser, the same data is saved in MongoDB and can also be seen through Postman.

### Part 2. Show the folder structure

Say:

> I separated the project into a frontend and backend folder. The frontend handles the user interface, while the backend handles routes, business logic, and database connection.

Then point to:

- `frontend/src/App.jsx`
- `backend/server.js`
- `backend/models/Todo.js`
- `backend/controllers/todoController.js`
- `backend/routes/todoRoutes.js`

### Part 3. Explain backend first

Say:

> I will start from the backend because this is where the server and database connection are defined.

Open `backend/server.js` and explain:

- `express()` creates the server.
- `cors()` and `express.json()` are middleware.
- `app.use('/api/todos', todoRoutes)` connects the todo routes.
- The server starts only after `connectDatabase()` succeeds.

Then open `backend/config/db.js` and say:

> This file connects Node.js with MongoDB using Mongoose. Without this connection, no todo can be stored permanently.

Then open `backend/models/Todo.js` and say:

> This schema defines what one todo document looks like inside MongoDB.

Then open `backend/controllers/todoController.js` and say:

> These functions implement CRUD operations. This is where the backend receives the request, talks to MongoDB, and sends a JSON response back.

### Part 4. Explain frontend

Say:

> Now I will show the React side. The frontend does not talk to MongoDB directly. It only talks to the backend using HTTP requests.

Open `frontend/src/App.jsx` and explain:

- State variables store current todos and form input.
- `fetchTodos()` loads all todos from the backend.
- `handleSubmit()` sends `POST` or `PUT`.
- `toggleCompleted()` changes status.
- `deleteTodo()` removes a record.

Then say:

> After each operation, the frontend fetches the latest data again. This ensures the browser always shows what is actually stored in the database.

### Part 5. Run the project live

From the terminal run:

```bash
npm run dev
```

Say:

> This single command starts both servers together. The React app runs on port 5173 and the Express backend runs on port 5000.

Open:

- `http://localhost:5173`

### Part 6. Demonstrate create

Add a new todo from the frontend.

Say:

> I am creating a todo from the browser. This action sends a POST request to the Express backend, and the backend stores the new document in MongoDB.

Then open Postman and run:

```text
GET http://localhost:5000/api/todos
```

Say:

> We can now see the same record from the API response. This proves the frontend is not just changing the screen locally. The data is actually stored in the database.

### Part 7. Demonstrate update

Edit a todo title in the frontend.

Say:

> When I update this todo, React sends a PUT request to the backend. The backend controller updates the matching MongoDB document using its unique ID.

Run `GET /api/todos` again in Postman and show the updated title.

### Part 8. Demonstrate completed status

Click `Mark complete`.

Say:

> This toggles the boolean completed field. Again, the request goes from frontend to backend to MongoDB, and the new value comes back in the response.

Show it in Postman.

### Part 9. Demonstrate delete

Delete a todo from the frontend.

Say:

> Deleting uses the DELETE method. The backend removes the record from MongoDB, and when the frontend fetches again, the removed item is no longer displayed.

Run `GET /api/todos` in Postman one final time.

### Part 10. Final conclusion

Say:

> This project demonstrates complete full stack communication. The frontend sends REST API requests, the backend processes them, MongoDB stores the data, and the results are visible both in the browser and in Postman. That confirms the connection between client, server, and database.

## Quick viva answers

### Why use Express?

Express makes it easy to create routes, middleware, and REST APIs in Node.js.

### Why use MongoDB?

MongoDB stores data as flexible JSON-like documents, which matches JavaScript objects naturally.

### Why use Mongoose?

Mongoose gives structure through schemas and makes MongoDB operations easier from Node.js.

### Why use Vite?

Vite gives very fast frontend development and a clean React setup.

### Why use REST API here?

REST is a simple and standard way for the frontend to communicate with the backend using HTTP methods like GET, POST, PUT, and DELETE.

### Why test with Postman if the frontend already works?

Postman proves the backend works independently. It helps show that the API is real and not dependent on the browser UI.

## If something does not work

### MongoDB connection error

Check:

- MongoDB server is running
- `backend/.env` contains the correct `MONGODB_URI`

### Frontend cannot load todos

Check:

- Backend is running on port `5000`
- Frontend is running on port `5173`
- `frontend/vite.config.js` contains the proxy

### API works in Postman but not in frontend

Check:

- Browser console for errors
- Backend terminal for server logs
- Whether the frontend called `/api/todos`

## Useful commands

```bash
npm run dev
npm run frontend
npm run backend
npm run build
```

## Final summary

This project is built to help you clearly demonstrate:

- frontend to backend communication
- backend to MongoDB communication
- REST API CRUD operations
- verification through both browser and Postman

If you want, I can also add:

- a MongoDB Compass walkthrough section
- screenshots section in the README
- a shorter 2-minute presentation version
- comments inside the code for every important line
