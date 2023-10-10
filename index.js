import axios from 'axios'
import fs from 'fs'
import * as Friendzygg from './utils/friendy-utils.js'
import 'dotenv/config'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const MAX_KEYS_HOLDING = process.env.MAX_KEYS_HOLDING || 5
const MAX_SPEND = process.env.MAX_SPEND || 0.25

runThrough()

async function runThrough() {
    while (true) {
        let activity = await axios.get('https://api2.friendzy.gg/v1/activity').then(res => {
            return res.data
        })
        await sellCheck()

        let pop = getMostPopular(activity)
        for (let thing of pop) {
            scanPopular(thing[0])
        }
        console.log('sleeping...')
        await sleep(60000)
    }
}

async function sellCheck() {
    let OUR_KEYS = JSON.parse(fs.readFileSync('./OUR_KEYS.json'))
    for (let key of OUR_KEYS) {
        let supply = await Friendzygg.getTokenSupplyById(key.id)
        if (valueSELL(BigInt(supply), BigInt(key.purchaseAmount)) > key.totalPurchaseValue * 1.1) {
            console.log('selling ...')
            let txn = await Friendzygg.sell(key.id, key.purchaseAmount, BigInt(supply))
            updateSell(key, supply, key.purchaseAmount, txn)
        }
    }
}

async function scanPopular(id) {

    let supply = await Friendzygg.getTokenSupplyById(id)
    let OUR_KEYS = JSON.parse(fs.readFileSync('./OUR_KEYS.json'))

    if (OUR_KEYS.length <= MAX_KEYS_HOLDING) {
        console.log('buying ...')
        let amountToBuy = getAmountToBuy(supply, MAX_SPEND * 10 ** 9)
        let txn = await Friendzygg.buy(id, amountToBuy, BigInt(supply))
        updateBuy(id, supply, Number(amountToBuy), txn)
    }

}

function updateSell(item, supply, amount, txn) {
    item.sellTxn = txn;
    item.totalSellValue = valueSELL(BigInt(supply), BigInt(amount))
    let sells = JSON.parse(fs.readFileSync('./trades.json'))
    sells.push(item)
    fs.writeFileSync('./trades.json', JSON.stringify(sells))

    let OUR_KEYS = JSON.parse(fs.readFileSync('./OUR_KEYS.json'))
    OUR_KEYS = OUR_KEYS.filter((key) => {
        return key.id != item.id
    })
    fs.writeFileSync('./OUR_KEYS.json', JSON.stringify(OUR_KEYS))

}
function updateBuy(id, supply, amount, txn) {
    let OUR_KEYS = JSON.parse(fs.readFileSync('./OUR_KEYS.json'))
    let obj = {
        "id": id,
        "purchaseAmount": amount,
        "totalPurchaseValue": valueBUY(BigInt(supply), BigInt(amount)),
        "buyTxn": txn
    }
    OUR_KEYS.push(obj)
    fs.writeFileSync('./OUR_KEYS.json', JSON.stringify(OUR_KEYS))
}


function valueBUY(supply, amount) {
    return Math.floor((Number((BigInt(595e8) + supply + amount) ** 2n / 12000000000000n) - Number((BigInt(595e8) + supply) ** 2n / 12000000000000n)))
}

function valueSELL(supply, amount) {
    return Math.floor((Number((BigInt(595e8) + supply) ** 2n / 12000000000000n) - Number((BigInt(595e8) + supply - amount) ** 2n / 12000000000000n)))
}

function getAmountToBuy(supply, value) {
    // this function accepts the amount of SOL you are willing to spend  and returns the number of keys that amount equates to
    /*
        supply - the supply of the token
        value -the amount ur willing to spend
    */

    //value*12000000000000 = (595e^8 + supply +amount)^2 - (595e^8 + supply)^2
    //(595e8^2 + supply^2 + x^2 + 2(595e8 * supply + supply * x + 595e8 *x)) - ( 595e8^2 + 2*595e8*supply + supply^2) 
    //(x^2 + 2*supply*x + 2*595e8*x + 595e8^2 + supply^2 + 2*595e8*supply) - ( 595e8^2 + 2*595e8*supply + supply^2) 
    // x^2 + 2*supply*x + 2*595e8*x +supply^2 + 2*595e8*supply - 2*595e8*supply - supply^2
    // x^2 + 2*supply*x + 2*595e8*x +supply^2 - supply^2
    //x*2 + 2*supply*x + 2*595e8*x = value/12000000000000
    // x*2 + 2*supply*x + 2*595e8*x - value/12000000000000 = 0
    /*  a = 1
        b = (2*supply + 2* 595e8)
        c = -value*12000000000000
    */
    let a = 1n
    let b = (2n * BigInt(supply) + 2n * BigInt(595e8))
    let c = -BigInt(value) * 12000000000000n


    let num =  (-(b) + bigIntSqrt(b * b - 4n * a * c)) / (2n * a)
  
    // need to round to 3 decimal places
    num = Math.floor(Number(num)/10**6) * 10**6
    console.log('a num : '+num)
    return num

}

function bigIntSqrt(n) {
    if (n <= 0n) return 0n;

    let x = n;
    let y = (x + 1n) / 2n;

    while (y < x) {
        x = y;
        y = (x + n / x) / 2n;
    }

    return x;
}

function getMostPopular(activity) {
    /*
        find top 5 most traded accounts by volume
    */
    let pop = {}
    for (let element of activity) {
        if (pop[element.id]) {
            pop[element.id] += element.volume
        }
        else {
            pop[element.id] = element.volume
        }
    }
    let arr = Object.entries(pop);
    arr.sort((a, b) => {
        return b[1] - a[1]
    })
    return arr.splice(0, 5)
}