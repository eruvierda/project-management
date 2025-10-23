import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import Workspace from '../models/Workspace.js';

// @desc    Search across projects, tasks, and comments
// @route   GET /api/search
// @access  Private
const searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i'); // Case-insensitive regex

    // 1. Find all workspaces the user is a member of
    const userWorkspaces = await Workspace.find({ members: req.user.id });
    const workspaceIds = userWorkspaces.map((ws) => ws._id);

    // 2. Find all projects within those workspaces
    const accessibleProjects = await Project.find({
      workspace: { $in: workspaceIds },
    });
    const accessibleProjectIds = accessibleProjects.map((p) => p._id);

    // 3. Search within accessible data
    const projects = await Project.find({
      workspace: { $in: workspaceIds },
      name: searchRegex,
    });

    const tasks = await Task.find({
      project: { $in: accessibleProjectIds },
      title: searchRegex,
    });

    const comments = await Comment.find({
      task: { $in: tasks.map((t) => t._id) }, // Further filter: comments on found tasks
      text: searchRegex,
    });

    res.json({ projects, tasks, comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export { searchAll };
