const express = require('express');
const router = express.Router();

const authenticate = require('../_helpers/authenticate');
const signRoute = require('./usuario.route');

const examesRoute = require('./exame.route');
const laudoRoute = require('./laudo.route');
const templateRoute = require('./template.route');

router.post('/login', authenticate);
router.use('/sign', signRoute);

router.use('/usuario', signRoute);
router.use('/exame', examesRoute);
router.use('/laudo', laudoRoute);
router.use('/template', templateRoute);

module.exports = router;