const express = require('express');
const {
    createDrawboard,
    getDrawboard,
    updateDrawboard,
    deleteDrawboard,
} = require('../controllers/Drawboard');
const {authenticate} = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, createDrawboard);
router.get('/:projectId', authenticate, getDrawboard); 
router.put('/:projectId', authenticate, updateDrawboard);
router.delete('/:projectId', authenticate, deleteDrawboard);

module.exports = router;
