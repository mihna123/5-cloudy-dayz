const express = require("express");
const db = require("./db/db.js");

const app = express();
app.use(express.json());

app.post('/order', async (req,res) => {
    const order = req.body;
    const [isValid, valmsg] = isOrderValid(order);
    if(!isValid){
        const err = "ERROR: " + valmsg;
        console.log(err);
        res.status(400).send(err);
        return;
    }
    try {
        await db.newOrder(order);
        const resBody = await db.getOrderById(order.id);
        res.status(201).send(resBody);
        console.log("New order created");
    } 
    catch(err) {
        res.status(400).send(err);
        console.log(err);
    }
});

app.get('/orderbook', async (req,res) => {
    try {
        const result = await db.getOrderBook();        
        res.status(200).send(result);
        console.log("Orderbook sent");
    }
    catch(err) {
        res.status(400).send(err);
        console.log(err);
    }
});

app.get('/order/:id', async (req,res) => {
    try {
        const id = req.params.id;
        const order = await db.getOrderById(id);
        res.status(200).send(order);
    }
    catch(err){
        res.status(400).send(err + "");
    }
});

app.delete('/order/all', async (req,res) => {
    try {
        await db.deleteAll();
        console.log("Deleting all data...");
        res.status(200).send("Deleted all data");
    } 
    catch(err) {
        console.error(err);
    }
});

db.configureTables().then(() => {
    app.listen(3000, () => {
        console.log('Listening on port 3000...');
    });
});


const isOrderValid = (order) => {
    if(order.currencyPair != "BTCUSD") return [false,"Currency pair is invalid.\nValid currencies are: BTCUSD"];
    if(order.type !== "BUY" && order.type !== "SELL") return [false, "Order type is invalid.\nValid types are: BUY,SELL"];
    if(order.price < 0 || order.quantity < 0) return [false, "Order price and order quantity musn't be negative"];
    return [true, "Order is valid"];
}
