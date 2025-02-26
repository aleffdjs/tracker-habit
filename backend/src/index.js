const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const habitRoutes = require('./routes/habitRoutes');
const recordRoutes = require('./routes/recordRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/habits', habitRoutes);
app.use('/records', recordRoutes);

// Middleware de erro
app.use(errorHandler);

// Configuração do servidor
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
    try {
        await prisma.$connect();
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
});

// Tratamento de erros do processo
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});