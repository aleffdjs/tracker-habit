const express = require('express');
const router = express.Router();
const { 
    getDailyRecords,
    toggleDailyHabit,
    getHabitHistory
} = require('../controllers/recordController');

router.get('/daily', getDailyRecords);
router.post('/toggle/:habitId', toggleDailyHabit);
router.get('/history/:habitId', getHabitHistory);

module.exports = router;