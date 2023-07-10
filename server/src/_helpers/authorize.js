const jwt = require('jsonwebtoken');
const roles = require('../_helpers/roles');

module.exports = (access_roles = []) => {
    if (typeof access_roles === 'string') {
        access_roles = [access_roles];
    }
    return [
        (req, res, next) => {
            try {
                token = req.headers['authorization'].replace('Bearer ', '');
            } catch (err) {
                return res.status(401).json({ message: 'Necessário login para acesso' });
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Sessão expirada' });
                    }
                    return res.status(401).json({ message: 'Token de acesso inválido. Favor realizar login' });
                }
                user = decoded.user;
                if (access_roles.length && !access_roles.includes(user.role)) {
                    return res.status(403).json({ message: 'Usuário não tem permissão para acessar o conteúdo' });
                }

                user.role = roles.getRole(user);
                const token = jwt.sign({ user }, process.env.JWT_SECRET, {
                    expiresIn: parseInt(process.env.JWT_TIMEOUT)
                });
                res.header('Authorization', 'Bearer ' + token);
                next();
            })
        }
    ];
}