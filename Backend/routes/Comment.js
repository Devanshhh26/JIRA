const express = require('express');
const router = express.Router();
const {
    createComment,
    getCommentsByTask,
    updateComment,
    deleteComment,
} = require('../controllers/Comment');
const {authenticate} = require('../middleware/auth'); 


router.post('/create', authenticate, createComment);
router.get('/:taskId', authenticate, getCommentsByTask); 
router.put('/:commentId', authenticate, updateComment); 
router.delete('/:commentId', authenticate, deleteComment);

module.exports = router;
