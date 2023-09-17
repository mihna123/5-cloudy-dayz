const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new pg.Pool();

exports.configureTables = async () => {
    const ordersExist = await tableExists('orders');
    const tradesExist = await tableExists('trades');
    const orderbookExist = await tableExists('orderbook');
    
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

    if(orderbookExist === true){
        console.log("Table orderbook already exists, continuing...");
    }
    else{
        console.log("Table orderbook doesn't exists, creating table...");
        await createOrderbook();
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
                                        id                 int,\
                                        currencypair       varchar(10),\
                                        createddatetime    date,\
                                        type               varchar(4),\
                                        price              double precision,\
                                        quantity           double precision,\
                                        filledquantity     double precision,\
                                        status             varchar(6),\
                                        trades             int[])');
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
                                        id          int,\
                                        buyorderid  int,\
                                        sellorderid int,\
                                        createddatetime     date,\
                                        price               double precision,\
                                        quantity            double precision)');
        console.log('Table trades created succesfully');
        console.log();
    }
    catch(err) {
        console.log(err);
    }
}

const createOrderbook = async () => {
    try {
        const res = await pool.query('CREATE TABLE orderbook (\
                                        buyorders       int[],\
                                        sellorders      int[])');
        console.log('Table orderbook created succesfully');
        console.log();
    }
    catch(err){
        console.log(err);
    }
}







