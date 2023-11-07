const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 34850;
const SELL_PRICE = 35180;
let isOpened = false
const API_URL = "https://testnet.binance.vision"

function calcSMA(data) {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a, b) => a + b);
    return (
        sum / data.length
    );
}

async function start() {
    const { data } = await axios.get(API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL);
    const candle = data[data.length - 1];
    const price = parseFloat(candle[4])
    const sma  = calcSMA(data)


    console.clear();
    console.log(`Candle: ${candle}`);
    console.log("Price: " + price);
    console.log(`SMA: ${sma}`);
    console.log(`Is Opened: ${isOpened}`);

    if (price <= (sma * 0.02) && isOpened === false) {
        console.log('BUY');
        isOpened = true;
    }
    else if (price >= (sma * 1.01) && isOpened === true) {
        console.log('SELL');
        isOpened = false;
    }
    else
        console.log("Aguardando entrada ou saída");
}

setInterval(start, 3000);

start();



// let profitPercentage = (SELL_PRICE - BUY_PRICE) / BUY_PRICE * 10
// console.log(profitPercentage); // output: 0.769230769230769

// "https://api.coinbase.com/v2/prices/BTC-USD/buy";