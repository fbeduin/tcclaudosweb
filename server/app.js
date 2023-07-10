const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const dotenv = require('dotenv-safe');
dotenv.config();

const routes = require('./src/routes/index');

app.use(bodyParser.json());
app.use(express.static('client'));
app.use('/api', routes);

const path = require('path');
app.route('/*').get(function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use(require('./src/_helpers/error.handler'));

app.listen(process.env.PORT, function () {
  console.log(`Application listening on port ${process.env.PORT}`);
});