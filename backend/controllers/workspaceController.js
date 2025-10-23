import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

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

// @desc    Add a member to a workspace
// @route   POST /api/workspaces/:id/members
// @access  Private
const addWorkspaceMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }

    // Check if the user making the request is the owner
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const userToAdd = await User.findOne({ email: req.body.email });
    if (!userToAdd) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is already a member
    if (workspace.members.includes(userToAdd.id)) {
      return res.status(400).json({ msg: 'User is already a member' });
    }

    workspace.members.push(userToAdd.id);
    await workspace.save();

    res.json(workspace.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export { getWorkspaces, createWorkspace, addWorkspaceMember };
