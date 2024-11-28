const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/fileUpload');
const { 
    createTask,
    editTask, 
    deleteTask,
    getTaskById,
    getAllTasks,
    getAllTasksForProject , 
    getAllTasksAssignedToUser, 
    addCommentToTask,
    uploadFilesToTask
} = require('../controllers/Task');

// Route to create a task
router.post('/project/:projectId/tasks', authenticate, createTask);

// Route to edit a task
router.put('/task/:id', authenticate, editTask);

// Route to delete a task
router.delete('/task/:id', authenticate, deleteTask);

// Route to get a task by its ID
router.get('/task/:id', authenticate, getTaskById);

// Route to get all tasks (accessible to admin or authorized user)
router.get('/tasks', authenticate, getAllTasks);

// Route to get all tasks for a project (only the project owner can access)
router.get('/project/:projectId/tasks', authenticate, getAllTasksForProject);

// Route to get all tasks assigned to the authenticated user
router.get('/user/tasks', authenticate, getAllTasksAssignedToUser);

// Route to add a comment to a task
router.post('/task/:taskId/comments', authenticate, addCommentToTask);

// Route to upload file
router.post('/tasks/:taskId/upload-multiple', authenticate, upload.array('files', 10), uploadFilesToTask);


module.exports = router;
