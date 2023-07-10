const dao = require('../dao/template.dao');

exports.getEspecialidades = async () => {
    const result = await dao.getEspecialidades();
    return result;
};

exports.getPorEspecialidade = async (especialidade) => {
    const result = await dao.getPorEspecialidade(especialidade);
    return result;
};

exports.applyPatch = async (especialidade, patches) => {
    const result = await dao.applyPatch(especialidade, patches);
    return result;
};