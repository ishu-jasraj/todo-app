const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createNewTask, fetchAllTasks, updateTask, deleteTask } = require('../api/tasks');

router.post('/create', auth, createNewTask);
router.get('/fetch', auth, fetchAllTasks);
router.patch('/update', auth, updateTask);
router.delete('/delete', auth, deleteTask);

module.exports = router;