const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve only the frontend directory — never expose backend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(port, () => {
    console.log(`[INNEX] Server running on http://localhost:${port}`);
});