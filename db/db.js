const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new pg.Pool();

exports.configureTables = async () => {
    const ordersExist = await tableExists('orders');
    const tradesExist = await tableExists('trades');
    
    if(ordersExist === true){
        console.log("Table orders already exists, continuing...");
    }
    else{
        console.log("Table orders doesn't exist, creating table...");
        await createOrders();
    }

    if(tradesExist === true){
        console.log("Table trades already exists, continuing...");
    }
    else{
        console.log("Table trades doesn't exist, creating table...");
        await createTrades();
    }
}

exports.getOrderById = async (id) => {
    try {
        const res = await pool.query('SELECT * FROM orders WHERE id = $1',[id]);
        if (res.rows[0] === undefined) {
            throw new Error(`There is no order with the id=${id}`);
        }
        return res.rows[0];
    }
    catch(err) {
        throw err;
    }
}

exports.newOrder = async (order) => {
    try {
        let filledQuantity = 0;
        let orderStatus = "OPEN";
        let relevantOrders;
        if(order.type === "BUY"){
            relevantOrders = await pool.query("SELECT * FROM orders WHERE\
                                               type = 'SELL' AND \"orderStatus\" = 'OPEN' AND price <= $1",[order.price]);
        }
        else {
            relevantOrders = await pool.query("SELECT * FROM orders WHERE\
                                               type = 'BUY' AND \"orderStatus\" = 'OPEN' AND price >= $1",[order.price]);
        }
        const n = relevantOrders.rowCount;
        relevantOrders = relevantOrders.rows;
        let i = 0;
        while(order.quantity !== filledQuantity && i < n){
            let relevantOrderQuantity = relevantOrders[i].quantity - relevantOrders[i].filledQuantity;
            let neededQuantity = order.quantity - filledQuantity;
            if(relevantOrderQuantity > neededQuantity) relevantOrderQuantity = neededQuantity;
            filledQuantity += relevantOrderQuantity;
            if(filledQuantity >= order.quantity){
                filledQuantity = order.quantity;
                orderStatus = "CLOSED";
            }
            const relevantOrderId = relevantOrders[i].id;
            const relevantOrderPrice = relevantOrders[i].price;
            const exchangedQuantity = relevantOrderQuantity;
            relevantOrderQuantity += relevantOrders[i].filledQuantity;
            let relevantOrderStatus = "OPEN";
            if(relevantOrderQuantity >= relevantOrders[i].quantity) relevantOrderStatus = "CLOSED";

            await pool.query("UPDATE orders SET \
                                \"filledQuantity\" = $1, \
                                \"orderStatus\" = $2 \
                                WHERE id = $3",[relevantOrderQuantity,relevantOrderStatus,relevantOrderId]);
            let buyId,sellId;
            if(order.type == "BUY"){
                buyId = order.id;
                sellId = relevantOrderId;
            }
            else {
                buyId = relevantOrderId;
                sellId = order.id;
            }

            await pool.query("INSERT INTO trades \
                                VALUES(DEFAULT,$1,$2,NOW(),$3,$4)",
                                [buyId,sellId,relevantOrderPrice,exchangedQuantity]);
            i += 1;
        }
        await pool.query('INSERT INTO orders \
                            VALUES($1, $2, NOW(), $3, $4, $5 ,$6, $7, $8)',
                            [order.id,
                             order.currencyPair,
                             order.type,
                             order.price,
                             order.quantity,
                             filledQuantity,
                             orderStatus,
                             []]);
    }
    catch(err) {
        throw err;
    }
}

exports.getOrderBook = async () => {
    try {
        const buyOrders = [];
        const sellOrders = [];
        const openOrders = await pool.query("SELECT * FROM orders\
                                            WHERE \"orderStatus\" = 'OPEN'");
        openOrders.rows.forEach((order) => {
            let relevantOrders = (order.type === "BUY")? buyOrders : sellOrders;
            const equalPriceOrder = relevantOrders.find((o) => o.price === order.price);
            realOrderQuantity = order.quantity - order.filledQuantity;
            if(equalPriceOrder !== undefined){
                equalPriceOrder.quantity += realOrderQuantity;
            }
            else {
                relevantOrders.push({price: order.price, quantity: realOrderQuantity});
            }
        });

        return {buyOrders, sellOrders}

    }
    catch(err) {
        throw err;
    }
}

exports.deleteAll = async () => {
    try {
        await pool.query("DELETE FROM orders");
        await pool.query("DELETE FROM trades");
    } 
    catch(err){
        throw err;
    }
}

const tableExists = async (name) => {
    try{
        const res = await pool.query('SELECT EXISTS (\
                        SELECT FROM\
                            pg_tables\
                        WHERE\
                            schemaname = \'public\' AND\
                            tablename = $1::text\
        )',[name]);
        return res.rows[0].exists;
    }
    catch(err) {
        console.log(err);
    }
}

const createOrders = async () => {
    try {
        const res = await pool.query('CREATE TABLE orders (\
                                        "id"                 int primary key,\
                                        "currencyPair"       varchar(10),\
                                        "createdDateTime"    date,\
                                        "type"               varchar(4),\
                                        "price"              double precision,\
                                        "quantity"           double precision,\
                                        "filledQuantity"     double precision,\
                                        "orderStatus"        varchar(6),\
                                        "trades"             int[])');
        console.log('Table orders created succesfully');
        console.log();
    }
    catch(err) {
        console.log(err);
    }
}

const createTrades = async () => {
    try {
        const res = await pool.query('CREATE TABLE trades (\
                                        "id"                  serial primary key,\
                                        "buyOrderId"          int,\
                                        "sellOrderId"         int,\
                                        "createdDateTime"     date,\
                                        "price"               double precision,\
                                        "quantity"            double precision)');
        console.log('Table trades created succesfully');
        console.log();
    }
    catch(err) {
        console.log(err);
    }
}
