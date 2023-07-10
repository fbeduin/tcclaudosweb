const jwt = require('jsonwebtoken');

module.exports = (req) => {
    originHost = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    token = req.headers['authorization'].replace('Bearer ', '');
    user = jwt.decode(token).user;
    return {
        host: originHost,
        user: user.co_crm || user.no_email,
        userName: user.no_usuario,
        role: user.role
    }
}