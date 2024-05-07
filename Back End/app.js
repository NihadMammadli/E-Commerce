const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./src/routes');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use('/', Routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
