const dao = require('../dao/usuario.dao');
const bcrypt = require('bcrypt');

exports.listAll = async () => {
    const result = await dao.listAll();
    return result;
};

exports.create = async (novoUsuario) => {
    const result = await dao.create(novoUsuario);
    return result;
};

exports.update = async (usuario) => {
    const result = await dao.update(usuario);
    return result;
};