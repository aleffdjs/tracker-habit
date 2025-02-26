const express = require('express');
const router = express.Router();
const { 
    getAllHabits, 
    createHabit, 
    updateHabit, 
    getHabitsSummary 
} = require('../controllers/habitController');

router.get('/', getAllHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.get('/summary', getHabitsSummary);

module.exports = router;