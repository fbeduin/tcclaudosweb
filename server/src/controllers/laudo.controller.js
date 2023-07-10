const service = require('../services/laudo.service');

exports.getLaudosPorData = async (req, res) => {
    const result = await service.getLaudosPorData(req.query.dt_laudo);
    res.status(200).send(result);
};

exports.getLaudoPorId = async (req, res) => {
    const result = await service.getLaudoPorId(req.params.id);
    res.status(200).send(result);
};

exports.createLaudo = async (req, res) => {
    const laudo = {
        id_exame: req.body.id_exame,
        nome_especialidade: req.body.nome_especialidade,
        o_paciente: req.body.o_paciente,
        o_medico_laudo: req.body.o_medico_laudo,
        ar_texto: req.body.ar_texto,
        dt_laudo: new Date(req.body.dt_laudo)
    }

    const result = await service.createLaudo(laudo);
    res.status(200).send(result);
};