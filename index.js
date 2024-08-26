const express = require('express');
const app = express();

const cors = require('cors')
const bodyParser = require('body-parser');

const Routes = require('./routes/index');
const connectToDatabase = require('./config/mongoose')
const awsService = require('./config/aws')

app.use(bodyParser.json());
app.use(cors());

Routes(app)
connectToDatabase()
awsService()

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
