import Project from '../models/Project.js';
import Workspace from '../models/Workspace.js';

// @desc    Get all projects for a workspace
// @route   GET /api/projects/by-workspace/:workspaceId
// @access  Private
const getProjectsByWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    // Authorization: Check if user is a member of the workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      members: req.user.id,
    });
    if (!workspace) {
      return res
        .status(401)
        .json({ msg: 'Not authorized to access this workspace' });
    }

    const projects = await Project.find({ workspace: workspaceId });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { name, workspaceId } = req.body;

  try {
    // Authorization: Check if user is a member of the workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      members: req.user.id,
    });
    if (!workspace) {
      return res
        .status(401)
        .json({ msg: 'Not authorized to create a project in this workspace' });
    }

    const newProject = new Project({
      name,
      workspace: workspaceId,
      members: [req.user.id], // Project creator is the first member
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export { getProjectsByWorkspace, createProject };
