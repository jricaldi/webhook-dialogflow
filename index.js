const express = require('express');
const app = express();
const dialogFlow = require('dialogflow-fulfillment');
const makeOrder = require('./intents/makeOrder');
const checkProduct = require('./intents/checkProduct');
const importStock = require('./services/import-stock');
const mongoose = require('mongoose');

require('dotenv').config();

const connection = async () => {
    await mongoose.connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('mongo connect');
}

connection();


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('OK');
});

app.get("/import_stock", async (req, res) => {
    await importStock();
    res.send("import stock done");
});

app.post('/', express.json(), (req, res) => {
     const agent = new dialogFlow.WebhookClient({
        request: req,
        response: res
    })

    const intentMap = new Map();
    intentMap.set('MakeOrder', makeOrder);
    intentMap.set('CheckProduct', checkProduct);

    agent.handleRequest(intentMap);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server live! port = ${PORT}`));