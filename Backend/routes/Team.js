const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createTeam, addMemberToTeam, removeMemberFromTeam,deleteTeam, getUserTeams, updateTeam} = require('../controllers/Team');

const router = express.Router();

router.post('/create', authenticate, createTeam);

router.delete('/delete/:teamId', authenticate, deleteTeam);

router.get('/userteams', authenticate, getUserTeams);

router.put('/update/:teamId', authenticate, updateTeam);

module.exports = router;
