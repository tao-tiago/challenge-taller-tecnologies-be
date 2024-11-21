import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

let tasks: Task[] = [];

// Function to validate task data
const validateTask = (task: Partial<Task>): boolean => {
  const { id, title, completed } = task;

  if (typeof id !== "number" || id <= 0) return false;
  if (typeof title !== "string" || title.trim() === "") return false;
  if (typeof completed !== "boolean") return false;

  return true;
};

// Function to check if a task exists
const findTask = (id: number): Task | undefined => tasks.find(task => task.id === id);

// Route to retrieve all tasks
app.get("/", (req, res) => {
  res.status(200).json(tasks);
});

// Route to retrieve a specific task by ID
app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = findTask(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

// Route to create a new task
app.post("/", (req, res) => {
  const { id, title, completed = false } = req.body;

  if (!validateTask({ id, title, completed })) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  if (findTask(id)) {
    return res.status(400).json({ message: "Task with this ID already exists" });
  }

  tasks.push({ id, title, completed });
  res.status(201).json({ message: "Task created successfully" });
});

// Route to update an existing task
app.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = findTask(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, completed } = req.body;

  if (!validateTask({ id, title, completed })) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  task.title = title;
  task.completed = completed;

  res.status(200).json({ message: "Task updated successfully" });
});

// Route to delete a task
app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  res.status(200).json({ message: "Task deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
