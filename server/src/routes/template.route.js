const router = require('express-promise-router')();
const validator = require('../_helpers/validators/template.validator');
const controller = require('../controllers/template.controller');
const authorize = require('../_helpers/authorize');
const roles = require('../_helpers/roles');

router.get('/tipos', authorize([roles.Admin, roles.Medico]), controller.getEspecialidades);
router.get('/:especialidade', authorize([roles.Medico]), controller.getPorEspecialidade);
router.patch('/:especialidade', authorize([roles.Medico]), controller.applyPatch);

module.exports = router;
