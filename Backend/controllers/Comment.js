const Comment = require('../models/Comment');
const Task = require('../models/Task');

const createComment = async (req, res) => {
    try {
        const { task, message, parent } = req.body;
        const userId = req.user._id;

        const taskExists = await Task.findById(task);
        if (!taskExists) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        const newComment = new Comment({
            task,
            user: userId,
            message,
            parent: parent || null,
        });

        await newComment.save();

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully.',
            comment: newComment,
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};


const getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const comments = await Comment.find({ task: taskId }).populate('user', 'name email').populate('parent');

        if (comments.length === 0) {
            return res.status(404).json({ success: false, message: 'No comments found for this task.' });
        }

        return res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};


const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { message } = req.body;
        const userId = req.user._id; 


        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found.' });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this comment.' });
        }


        comment.message = message;
        comment.updatedAt = Date.now();
        await comment.save();

        return res.status(200).json({
            success: true,
            message: 'Comment updated successfully.',
            comment,
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found.' });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this comment.' });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

module.exports = {
    createComment,
    getCommentsByTask,
    updateComment,
    deleteComment,
};
