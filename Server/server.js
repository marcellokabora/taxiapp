const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());

const shareNowVehicles = JSON.parse(fs.readFileSync('share-now/vehicles.json', 'utf8'));
const freeNowVehicles = JSON.parse(fs.readFileSync('free-now/vehicles.json', 'utf8'));

// SHARE NOW ROUTE
app.get('/share-now/vehicles', (req, res) => {
    res.send(JSON.stringify(shareNowVehicles));
});

// FREE NOW ROUTE
app.get('/free-now/vehicles', (req, res) => {
    res.send(JSON.stringify(freeNowVehicles));
});

app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});