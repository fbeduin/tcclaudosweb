const router = require('express-promise-router')();
const validator = require('../_helpers/validators/laudo.validator');
const controller = require('../controllers/laudo.controller');
const authorize = require('../_helpers/authorize');
const roles = require('../_helpers/roles');

router.get('/', validator.validateLaudoPorData, authorize([roles.Medico]), controller.getLaudosPorData);
router.get('/:id', authorize(), controller.getLaudoPorId);
router.post('/', validator.validateNovoLaudo, authorize([roles.Medico]), controller.createLaudo);

module.exports = router;