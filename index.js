const express = require("express");
const db = require("./db/db.js");

db.configureTables();

const app = express();

app.use(express.json());

app.post('/order', (req,res) => {
    const order = req.body;
    console.log(req.body);
    db.newOrder(order);
    res.send('order endpoint');
});

app.get('/orderbook', (req,res) => {
    res.send('orderbook endpoint');
});

app.get('/order/:id', (req,res) => {
    const body = 'Order by id: ' + req.params.id;
    res.send(body);
});

app.delete('/order/all', (req,res) => {
    res.send('This should delete all');
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});
