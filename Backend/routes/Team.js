const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createTeam, addMemberToTeam, removeMemberFromTeam,deleteTeam} = require('../controllers/Team');

const router = express.Router();

router.post('/create', authenticate, createTeam);

router.post('/:teamId/add-member', authenticate, addMemberToTeam);

router.post('/:teamId/remove-member', authenticate, removeMemberFromTeam);

router.delete('/:teamId', authenticate, deleteTeam);

module.exports = router;
