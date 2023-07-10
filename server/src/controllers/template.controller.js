const service = require('../services/template.service');

exports.getEspecialidades = async (req, res) => {
    const result = await service.getEspecialidades();
    res.status(200).send(result);
};

exports.getPorEspecialidade = async (req, res) => {
    const especialidade = req.params.especialidade;
    const result = await service.getPorEspecialidade(especialidade);
    res.status(200).send(result);
};

exports.applyPatch = async (req, res) => {
    console.log(req.body)
    const especialidade = req.params.especialidade;
    const result = await service.applyPatch(especialidade, req.body);
    res.status(200).send(result);
};


