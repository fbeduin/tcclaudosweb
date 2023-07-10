module.exports = function errorHandler(err, req, res, next) {
    
    if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
        console.log(err);
        res.status(503).send('Problemas de comunicação do sistema com seus recursos.');
    }
    
    else if (!err.name) {
        console.log(err);
        res.status(500).send(err.message ? err.message : err);
    }
    switch (err.name) {
        case 'ValidationError':
        case 'DataError':
            res.status(422).send(err.message);
            break;
        case 'DBError':
            console.log(err);
            res.status(500).send(err.message);
            break;
        default:
            console.log(err);
            res.status(500).send(err.message);
    }
};
