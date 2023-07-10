const service = require('../services/exame.service');
const userAuth = require('../_helpers/auth-origin.wrapper');   

exports.getExamePorMedico = async (req, res) => {
    console.log("a");
    const userData = userAuth(req);
    const result = await service.getExamePorMedico(userData.user);
    res.status(200).send(result);
};

exports.getExamePorId = async (req, res) => {
    console.log("b");
    const result = await service.getExamePorId(req.params.id);
    res.status(200).send(result);
};

exports.getExamesExternos = async (req, res) => {
    console.log("c");
    const result = await service.getExamesExternos();
    res.status(200).send(result);
};