const express = require("express");
const db = require("./db/db.js");

db.configureTables();

const app = express();

app.use(express.json());

app.post('/order', async (req,res) => {
    const order = req.body;
    const [isValid, msg] = isOrderValid(order);
    if(!isValid){
        const err = "ERROR: " + msg;
        console.log(err);
        res.status(400).send(err);
        return;
    }
    await db.newOrder(order);
    const resBody = await db.getOrderById(order.id);
    res.status(201).send(resBody);
    console.log('Response sent...');
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


const isOrderValid = (order) => {
    if(order.currencyPair != "BTCUSD") return [false,"Currency pair is invalid.\nValid currencies are: BTCUSD"];
    if(order.type !== "BUY" && order.type !== "SELL") return [false, "Order type is invalid.\nValid types are: BUY,SELL"];
    if(order.price < 0 || order.quantity < 0) return [false, "Order price and order quantity musn't be negative"];
    return [true, "Order is valid"];
}
