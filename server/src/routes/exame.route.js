const router = require('express-promise-router')();
const controller = require('../controllers/exame.controller');
const authorize = require('../_helpers/authorize');
const roles = require('../_helpers/roles');

router.get('/', authorize([roles.Medico]), controller.getExamePorMedico);
router.get('/:id', authorize([roles.Medico]), controller.getExamePorId);
router.get('/dados_externos', authorize([roles.Medico]), controller.getExamesExternos);

module.exports = router;
