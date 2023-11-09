const axios = require("axios");
const crypto = require("crypto");

const SYMBOL = "BTCUSDT";
const QUANTITY = "0.0001";
const BUY_PRICE = 35000;
const SELL_PRICE = 35800;
const API_KEY = "";
const SECRET_KEY = "";

let isOpened = false

//URL de produção: "https://api.binance.com";
const API_URL = "https://testnet.binance.vision"

function calcSMA(data) {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a, b) => a + b);
    return (
        sum / data.length
    );
}

async function newOrder(symbol,quantity,side){
    const order = {symbol,quantity,side};
    order.type = "MARKET";
    order.timestamp = Date.now();
    const signature = crypto.createHmac("sha256", SECRET_KEY).update(new URLSearchParams(order).toString()).digest("hex");
    order.signature = signature;
    try {
        const {data} = await axios.post(
            `${API_URL}/api/v3/order`,
            new URLSearchParams(order).toString,
            {headers: {"X-MBX-APIKEY": API_KEY}}
        )
        console.log(data);
    } catch (err) {
        console.error(err.response);
    }
}

async function start() {
    const { data } = await axios.get(API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL);
    const candle = data[data.length - 1];
    const price = parseFloat(candle[4])
    const sma  = calcSMA(data)


    // console.clear();
    // console.log(`Candle: ${candle}`);
    // console.log("Price: " + price);
    // console.log(`SMA: ${sma}`);
    // console.log(`Is Opened: ${isOpened}`);

    if (isOpened)
        console.log("Sell Price: " + SELL_PRICE);
    else
        console.log("Buy Price: " + BUY_PRICE);

    if (price < BUY_PRICE && !isOpened) {
        console.log("Comprar!");
        newOrder(SYMBOL, QUANTITY, "BUY");
        isOpened = true;
    }
    else if (price >= (sma * 1.02) && isOpened) {
        console.log("Vender!");
        newOrder(SYMBOL, QUANTITY, "SELL");
        isOpened = false;
    }
}

setInterval(start, 3000);

start();