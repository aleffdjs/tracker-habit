const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar hábitos com filtros
const getAllHabits = async (req, res, next) => {
    try {
        const { active, category } = req.query;
        
        const where = {};
        if (active !== undefined) {
            where.isActive = active === 'true';
        }
        if (category) {
            where.category = category;
        }

        const habits = await prisma.habit.findMany({
            where,
            include: {
                records: {
                    orderBy: {
                        date: 'desc'
                    },
                    take: 7 // Últimos 7 registros
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(habits);
    } catch (error) {
        next(error);
    }
};

// Criar hábito
const createHabit = async (req, res, next) => {
    try {
        const { name, category, description } = req.body;
        
        if (!name || !category) {
            return res.status(400).json({ error: 'Nome e categoria são obrigatórios' });
        }

        const newHabit = await prisma.habit.create({
            data: { 
                name, 
                category,
                description 
            }
        });
        res.json(newHabit);
    } catch (error) {
        next(error);
    }
};

// Atualizar hábito
const updateHabit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, category, description, isActive } = req.body;

        const updatedHabit = await prisma.habit.update({
            where: { id: parseInt(id) },
            data: { 
                name, 
                category,
                description,
                isActive
            }
        });
        res.json(updatedHabit);
    } catch (error) {
        next(error);
    }
};

// Obter resumo dos hábitos
const getHabitsSummary = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        const records = await prisma.record.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                habit: true
            }
        });

        const summary = records.reduce((acc, record) => {
            const habitId = record.habitId;
            if (!acc[habitId]) {
                acc[habitId] = {
                    habit: record.habit,
                    totalDays: 0,
                    completedDays: 0
                };
            }
            acc[habitId].totalDays++;
            if (record.completed) {
                acc[habitId].completedDays++;
            }
            return acc;
        }, {});

        res.json(Object.values(summary));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllHabits,
    createHabit,
    updateHabit,
    getHabitsSummary
};