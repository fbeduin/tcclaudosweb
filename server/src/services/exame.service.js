const axios = require("axios").default;
const dao = require('../dao/exame.dao');

exports.getExamePorMedico = async (user) => {
    await getExamesExternos();
    const retorno = await dao.getExamePorMedico(user);
    return retorno;
};

exports.getExamePorId = async (id) => {
    const retorno = await dao.getExamePorId(id);
    return retorno;
};

const getExamesExternos = async () => {
    const dados = (await axios.get(process.env.API_ENDPOINT)).data;
    await dao.saveExamesExternos(dados);
    return;
};