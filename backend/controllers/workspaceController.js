import Workspace from '../models/Workspace.js';

// @desc    Get all workspaces for a user
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user.id });
    res.json(workspaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
  const { name } = req.body;

  try {
    const newWorkspace = new Workspace({
      name,
      owner: req.user.id,
      members: [req.user.id], // The creator is the first member
    });

    const workspace = await newWorkspace.save();
    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export { getWorkspaces, createWorkspace };
