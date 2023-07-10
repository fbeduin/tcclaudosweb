const router = require('express-promise-router')();
const controller = require('../controllers/usuario.controller');
const authorize = require('../_helpers/authorize');
const roles = require('../_helpers/roles');

router.get('/', authorize([roles.Admin]), controller.listAll);
router.post('/', authorize([roles.Admin]), controller.create);

module.exports = router;