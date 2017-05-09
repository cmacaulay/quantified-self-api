const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const FoodsController = require('./lib/controllers/foods-controller')
const Food = require('./lib/models/food')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', process.env.PORT || 3000);
app.get('/api/foods', FoodsController.index);
app.post('/api/foods', FoodsController.create);
app.patch('/api/foods/:id', FoodsController.update);
app.delete('/api/foods/:id', FoodsController.destroy);

module.exports = app;
