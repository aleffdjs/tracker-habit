const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    res.status(500).json({
        error: 'Algo deu errado!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler;