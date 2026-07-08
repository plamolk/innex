const express = require('express');
const path = require('path');
const app = express();
const env = require('dotenv').config();
const port = env.parsed.PORT;

app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(port, () => {
    console.log('run server port :' + port);
})