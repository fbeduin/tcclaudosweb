const dao = require('../dao/laudo.dao');
const mailService = require('../services/mail.service');

exports.getLaudosPorData = async (dt_laudo) => {
    const retorno = await dao.getLaudosPorData(dt_laudo);
    return [...retorno];
};

exports.getLaudoPorId = async (id) => {
    const retorno = await dao.getLaudoPorId(id);
    return retorno;
};

exports.createLaudo = async (laudo) => {
    const retorno = await dao.createLaudo(laudo);
    const email = laudo.o_paciente.email;
    const assunto = 'Seu laudo está disponível!';
    const mensagem = `Olá, ${laudo.o_paciente.nome}!<p> Seu laudo já está disponível, acesse clicando no link abaixo: <p>${process.env.URL}:${process.env.CLIENT_PORT}/laudo/${laudo.id_exame}/pdf`;
    mailService.sendEmail(email, assunto, mensagem);
    return retorno;
};