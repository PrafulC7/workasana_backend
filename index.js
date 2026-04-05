const express = require("express")
const app = express()
app.use(express.json())
const cors = require("cors");
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const authMiddleware = require("./middleware/authMiddleware");
const {initializeDatabase} = require("./db/db.connect")
// const authMiddleware = require("./middleware/authMiddleware");
const Project = require("./models/project.models")
const Tag = require("./models/tag.models")
const Task = require("./models/task.models")
const Team = require("./models/team.models")
const User = require("./models/user.models")

// protected route example
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to dashboard", user: req.user });
});

initializeDatabase();

app.get("/", async (req,res)=>{
  try{
res.send("Workasana Backend")
  }catch(err){
res.status(404).json({error:"page not found"})
  }
})

// app.get("/tasks",authMiddleware,async(req,res)=>{

//  const tasks = await Task.find();

//  res.json(tasks);

// });
// ==============================
// GET all users
// ==============================
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// GET single user by ID
// ==============================
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// CREATE new user
// ==============================
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const newUser = new User({
      name,
      email,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==============================
// UPDATE user by ID
// ==============================
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==============================
// GET all teams
// ==============================
app.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// GET single team by ID
// ==============================
app.get("/teams/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// CREATE new team
// ==============================
app.post("/teams", async (req, res) => {
  try {
    const { name, description } = req.body;

    const newTeam = new Team({
      name,
      description,
    });

    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==============================
// UPDATE team by ID
// ==============================
app.put("/teams/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==============================
// Delete team by ID
// ==============================
app.delete("/teams/:id", async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// GET all projects
// ==============================
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// GET single project by ID
// ==============================
app.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// CREATE new project
// ==============================
app.post("/projects", async (req, res) => {
  try {
    const { name, description } = req.body;

    const newProject = new Project({
      name,
      description,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==============================
// UPDATE project by ID
// ==============================
app.put("/projects/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// ==============================
// Delete project by ID
// ==============================
app.delete("/projects/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    // 👇 delete all tasks under this project
    await Task.deleteMany({ project: projectId });

    // 👇 delete the project
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project and related tasks deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// GET Project Details
// ==============================

app.get("/tasks/project/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("owners", "name")
      .populate("team", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================
// GET all tasks
// ==============================
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// GET single task by ID
// ==============================
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// CREATE new task
// ==============================
app.post("/tasks", async (req, res) => {
  try {
    const {
      name,
      project,
      team,
      owners,
      tags,
      timeToComplete,
      status,
      dueDate
    } = req.body;

    const newTask = new Task({
      name,
      project,
      team,
      owners,
      tags,
      timeToComplete,
      status,
      dueDate: new Date(dueDate) // ✅ fixed
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==============================
// Delete task by ID
// ==============================

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// UPDATE task by ID
// ==============================
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/tasks/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };

    // 👇 ADD THIS LOGIC
    if (status === "Completed") {
      updateData.completedAt = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==============================
// GET all tags
// ==============================
app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// GET single tag by ID
// ==============================
app.get("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// CREATE new tag
// ==============================
app.post("/tags", async (req, res) => {
  try {
    const { name } = req.body;

    const newTag = new Tag({ name });

    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    // Handle duplicate tag name error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tag name already exists" });
    }

    res.status(400).json({ message: error.message });
  }
});

// ==============================
// UPDATE tag by ID
// ==============================
app.put("/tags/:id", async (req, res) => {
  try {
    const { name } = req.body;

    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json(updatedTag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tag name already exists" });
    }

    res.status(400).json({ message: error.message });
  }
});


// const PORT = 3000
// app.listen(PORT, ()=> {
//   console.log(`Server running on port ${PORT}`)
// })

export default app;