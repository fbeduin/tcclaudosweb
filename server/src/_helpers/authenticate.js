const jwt = require('jsonwebtoken');
const roles = require('../_helpers/roles');
const bcrypt = require('bcrypt');
const { connect } = require('./mongodb');

module.exports = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await autenticacao(username, password);
        user.role = roles.getRole(user);

        let token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: parseInt( process.env.JWT_TIMEOUT )
        });

        res.header('Authorization', 'Bearer ' + token).send(user);
    } catch (err) {
        if (err.code === 'ENOTFOUND') {
            res.status(503).send('Problemas de comunicação do sistema com seus recursos. Contate a equipe técnica');
        } else {
            res.status(401).send({ message: 'Login ou senha incorretos' });
        }
    }
};

autenticacao = async (username, password) => {
    try {
        const db = await connect();
        const result = await db.collection("col_usuarios").findOne({ $or: [{co_crm: username}, {no_email: username}] });

        if (result == null) throw new Error('Usuário não encontrado');
        
        const hash = result.hash;
        delete result.hash;
        const match = await bcrypt.compare(password, hash);
        if (match) return result;

        throw new Error('Senha incorreta');
    } catch (e) {
        throw (e);
    }
};