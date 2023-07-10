const Joi = require('joi');

const schemaConsultaPorData = Joi.object({
    dt_laudo: Joi.date().required()
});

const schemaNovo = Joi.object({
    id_exame: Joi.string().guid({ version: 'uuidv4'}).required(),
    
    nome_especialidade: Joi.string().required(),

    o_paciente: Joi.object({ 
        nome: Joi.string().required(), 
        email: Joi.string().email().required() 
    }),

    o_medico_laudo: Joi.object({ 
        nome: Joi.string().required(), 
        crm: Joi.string().alphanum().required(), 
        email: Joi.string().email().required() 
    }),

    ar_texto: Joi.array().items(
        Joi.object({
            _id: Joi.string().required(),
            nome: Joi.string().required(),
            texto: Joi.string(),
            conclusao: Joi.string(),
            ref: Joi.string(),
            obs: Joi.string()
        }).or('texto', 'conclusao', 'ref', 'obs')
    ),

    dt_laudo: Joi.date().required()
});

exports.validateLaudoPorData = async (req, res, next) => {
    await schemaConsultaPorData.validateAsync(req.query);
    next();
};

exports.validateNovoLaudo = async (req, res, next) => {
    await schemaNovo.validateAsync(req.body);
    next();
};