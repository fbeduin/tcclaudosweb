const service = require('../services/usuario.service');

exports.listAll = async (req, res) => {
    const result = await service.listAll();
    res.status(200).send(result);
};

exports.create = async (req, res) => {
    const result = await service.create(req.body);
    res.status(201).send(result);
};

exports.update = async (req, res) => {
    const result = await service.update(usuario);
    res.status(200).send(result);
};