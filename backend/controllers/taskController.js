import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get all tasks for a project
// @route   GET /api/tasks/by-project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Authorization: Check if user is a member of the project
    const project = await Project.findById(projectId);
    if (!project || !project.members.includes(req.user.id)) {
      return res
        .status(401)
        .json({ msg: 'Not authorized to access this project' });
    }

    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, projectId } = req.body;

  try {
    // Authorization: Check if user is a member of the project
    const project = await Project.findById(projectId);
    if (!project || !project.members.includes(req.user.id)) {
      return res
        .status(401)
        .json({ msg: 'Not authorized to create a task in this project' });
    }

    const newTask = new Task({
      title,
      project: projectId,
      assignee: req.user.id, // Default assignee is the creator
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export { getTasksByProject, createTask };
