const express = require('express');
const router = express.Router();
const { createProject,editProject,deleteProject,searchProjects,updateTeamMembers,getAllProjects,getProject,archiveProject } = require('../controllers/Project');
const { authenticate } = require('../middlewares/auth');

router.post('/create', authenticate, createProject);

router.put('/editProject/:projectId', authenticate, editProject);

router.delete('/delete/:projectId',authenticate,deleteProject);

router.get('/projectId',authenticate,getProject);

router.get('/',authenticate,getAllProjects);

router.put('/archive/:projectId',authenticate,archiveProject);

router.put('/team/:projectId',authenticate,updateTeamMembers);

router.get('/search',authenticate,searchProjects);

module.exports = router;
