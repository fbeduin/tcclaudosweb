const Joi = require('joi');

const schemaPatch = Joi.object({
    dt_laudo: Joi.date().required()
});

exports.validatePatch = async (req, res, next) => {
    await schemaPatch.validateAsync(req.body);
    next();
};