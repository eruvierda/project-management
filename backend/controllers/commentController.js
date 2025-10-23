import Comment from '../models/Comment.js';
import Task from '../models/Task.js';

// @desc    Get all comments for a task
// @route   GET /api/comments/by-task/:taskId
// @access  Private
const getCommentsByTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Find the task and populate its project to check for membership
    const task = await Task.findById(taskId).populate('project');
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Authorization: Check if user is a member of the project
    if (!task.project.members.includes(req.user.id)) {
      return res
        .status(401)
        .json({ msg: 'Not authorized to access this task' });
    }

    const comments = await Comment.find({ task: taskId }).populate(
      'user',
      'name'
    );
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a comment on a task
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  const { text, taskId } = req.body;

  try {
    // Find the task and populate its project to check for membership
    const task = await Task.findById(taskId).populate('project');
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Authorization: Check if user is a member of the project
    if (!task.project.members.includes(req.user.id)) {
      return res
        .status(401)
        .json({ msg: 'Not authorized to comment on this task' });
    }

    const newComment = new Comment({
      text,
      task: taskId,
      user: req.user.id,
    });

    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export { getCommentsByTask, createComment };
