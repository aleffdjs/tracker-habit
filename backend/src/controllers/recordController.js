const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obter registros de um dia específico
const getDailyRecords = async (req, res, next) => {
    try {
        const { date, status } = req.query; // Novo parâmetro
        const targetDate = date ? new Date(date) : new Date();

        // Mantém seu tratamento de data preciso
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        // Busca todos os hábitos ativos
        const activeHabits = await prisma.habit.findMany({
            where: { isActive: true }
        });

        // Busca os registros do dia
        const records = await prisma.record.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                habit: true
            }
        });

        // Prepara o resultado combinando hábitos e registros
        let dailyStatus = activeHabits.map(habit => {
            const record = records.find(r => r.habitId === habit.id);
            return {
                habit,
                record: record || null,
                completed: record ? record.completed : false,
                notes: record ? record.notes : ''
            };
        });

        // Adiciona filtro por status se especificado
        if (status) {
            dailyStatus = dailyStatus.filter(item => 
                status === 'pending' ? !item.completed : item.completed
            );
        }

        res.json(dailyStatus);
    } catch (error) {
        next(error);
    }
};

// Registrar ou atualizar um hábito do dia
const toggleDailyHabit = async (req, res, next) => {
    try {
        const { habitId } = req.params;
        const { date, completed, notes } = req.body;

        const targetDate = date ? new Date(date) : new Date();
        // Ajusta a data para meia-noite
        targetDate.setHours(0, 0, 0, 0);

        // Verifica se já existe um registro para este hábito neste dia
        const existingRecord = await prisma.record.findFirst({
            where: {
                habitId: parseInt(habitId),
                date: targetDate
            }
        });

        let record;
        if (existingRecord) {
            // Atualiza o registro existente
            record = await prisma.record.update({
                where: { id: existingRecord.id },
                data: {
                    completed: completed ?? !existingRecord.completed, // Toggle se não especificado
                    notes: notes || existingRecord.notes
                },
                include: { habit: true }
            });
        } else {
            // Cria um novo registro
            record = await prisma.record.create({
                data: {
                    habitId: parseInt(habitId),
                    date: targetDate,
                    completed: completed ?? true,
                    notes: notes || ''
                },
                include: { habit: true }
            });
        }

        res.json(record);
    } catch (error) {
        next(error);
    }
};

// Obter histórico de registros
const getHabitHistory = async (req, res, next) => {
    try {
        const { habitId } = req.params;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        const records = await prisma.record.findMany({
            where: {
                habitId: parseInt(habitId),
                date: {
                    gte: start,
                    lte: end
                }
            },
            orderBy: {
                date: 'desc'
            },
            include: {
                habit: true
            }
        });

        res.json(records);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDailyRecords,
    toggleDailyHabit,
    getHabitHistory
};