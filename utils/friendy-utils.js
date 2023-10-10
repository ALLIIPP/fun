import bs58 from 'bs58'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { Connection, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import axios from 'axios'
import 'dotenv/config'

const FRIENDZY_3nG = new PublicKey('Fr3nGzsEefxDV5auZeiQVFeHj2NhSgvqztdLBYpsob5e')
const META = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s') //aka 'f'
const FRIENDZY = new PublicKey('FrenAezyygcqNKaCkYNzBAxTCo717wh1bgnKLqnxP8Cq')
const ATA_PROGRAM = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
const TOKEN_PROGRAM = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET))
const connection = new Connection(process.env.RPC_URL)


export async function buy(accountID, amount, supply) {

    /**
     * accountID - id of account to buy their tokens
     * amount - the amount of tokens to buy
     * supply - the total supply of token
     */

    const FRIEND_TOKEN_ACCOUNT = PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([109, 105, 110, 116,]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0] // aka 'd'

    const instruction = new TransactionInstruction({
        programId: FRIENDZY,
        keys: [
            {
                pubkey: wallet.publicKey,
                isSigner: true,
                isWritable: false
            },
            {
                pubkey: PublicKey.findProgramAddressSync([Buffer.from("bank")], FRIENDZY)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([99, 111, 110, 102, 105, 103]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0],
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: FRIEND_TOKEN_ACCOUNT,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([99, 111, 110, 102, 105, 103]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)]), ...[wallet.publicKey.toBuffer()]], FRIENDZY)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('SysvarRent111111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            /*  {
                  pubKey: PublicKey.findProgramAddressSync([ new Uint8Array([109, 101, 116, 97, 100, 97, 116, 97]), META.toBuffer(), FRIEND_TOKEN_ACCOUNT.toBuffer()], META)[0],
                  isSigner: false,
                  isWritable: true
              },*/
            {
                pubkey: new PublicKey('11111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('11111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('11111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: PublicKey.findProgramAddressSync([...[wallet.publicKey.toBuffer()], ...[TOKEN_PROGRAM.toBuffer()], ...[PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([109, 105, 110, 116]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0].toBuffer()]], ATA_PROGRAM)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: new PublicKey('Fr3nGzsEefxDV5auZeiQVFeHj2NhSgvqztdLBYpsob5e'),
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: ATA_PROGRAM,
                isSigner: false,
                isWritable: false
            }

        ],

        data: getProgramDataBUY(BigInt(accountID), BigInt(amount), supply)


    })

    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [wallet],
        { skipPreflight: true }
    ).catch((e) => {
        console.log(e)
    });
    console.log("Signature = ", transactionSignature);

    return transactionSignature

}


export async function createAccountBuy(accountID, amount, supply) {

    /**
     *  this function is to be used when a token account has not been created for the account youd like to buy (i.e you are the first buyer of that token / supply = 0)
        * accountID - id of account to buy their tokens
        * amount - the amount of tokens to buy
        * supply - the total supply of tokens (in this case, always 0)
        */

    const FRIEND_TOKEN_ACCOUNT = PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([109, 105, 110, 116]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0]
    const instruction = new TransactionInstruction({
        programId: FRIENDZY,
        keys: [
            {
                pubkey: wallet.publicKey,
                isSigner: true,
                isWritable: false
            },
            {
                pubkey: PublicKey.findProgramAddressSync([Buffer.from("bank")], FRIENDZY)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([99, 111, 110, 102, 105, 103]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0],
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: FRIEND_TOKEN_ACCOUNT,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([99, 111, 110, 102, 105, 103]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)]), ...[wallet.publicKey.toBuffer()]], FRIENDZY)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('SysvarRent111111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('11111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: PublicKey.findProgramAddressSync([new Uint8Array([109, 101, 116, 97, 100, 97, 116, 97]), META.toBuffer(), FRIEND_TOKEN_ACCOUNT.toBuffer()], META)[0],
                isSigner: false,
                isWritable: true
            },

            {
                pubkey: META,
                isSigner: false,
                isWritable: false
            },



            {
                pubkey: PublicKey.findProgramAddressSync([...[wallet.publicKey.toBuffer()], ...[TOKEN_PROGRAM.toBuffer()], ...[FRIEND_TOKEN_ACCOUNT.toBuffer()]], ATA_PROGRAM)[0],
                isSigner: false,
                isWritable: true
            },


            {
                pubkey: FRIENDZY_3nG,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: ATA_PROGRAM,
                isSigner: false,
                isWritable: false
            }

        ],

        data: getProgramDataBUY(BigInt(accountID), BigInt(amount), supply)


    })
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [wallet],
        { skipPreflight: true }
    ).catch((e) => {
        console.log(e)
    });
    console.log("Signature = ", transactionSignature);

    return transactionSignature

}


export async function sell(accountID, amount, supply) {


    /**
    * accountID - id of account to sell their tokens
    * amount - the amount of tokens to sell
    * supply - the total outstanding suppy of tokens
    */

    const FRIEND_TOKEN_ACCOUNT = PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([109, 105, 110, 116,]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0] 


    const instruction = new TransactionInstruction({
        programId: FRIENDZY,
        keys: [
            {
                pubkey: wallet.publicKey,
                isSigner: true,
                isWritable: false
            },
            {
                pubkey: PublicKey.findProgramAddressSync([Buffer.from("bank")], FRIENDZY)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([99, 111, 110, 102, 105, 103]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0],
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: FRIEND_TOKEN_ACCOUNT,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([99, 111, 110, 102, 105, 103]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)]), ...[wallet.publicKey.toBuffer()]], FRIENDZY)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('SysvarRent111111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            /*  {
                  pubKey: PublicKey.findProgramAddressSync([ new Uint8Array([109, 101, 116, 97, 100, 97, 116, 97]), META.toBuffer(), FRIEND_TOKEN_ACCOUNT.toBuffer()], META)[0],
                  isSigner: false,
                  isWritable: true
              },*/
            {
                pubkey: new PublicKey('11111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('11111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey('11111111111111111111111111111111'),
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: PublicKey.findProgramAddressSync([...[wallet.publicKey.toBuffer()], ...[TOKEN_PROGRAM.toBuffer()], ...[PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([109, 105, 110, 116]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0].toBuffer()]], ATA_PROGRAM)[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: FRIENDZY_3nG, 
                isSigner: false,
                isWritable: true
            }

        ],   
        data: getProgramDataSELL(BigInt(accountID), BigInt(amount), supply)

    })


    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [wallet],
        { skipPreflight: true }
    ).catch((e) => {
        console.log(e)
    });
    console.log("Signature = ", transactionSignature);
    return transactionSignature

}


export function getProgramDataSELL(id, amount, supply) {
    const other = BigInt(Math.floor(.1 * (Number((BigInt(595e8) + supply) ** 2n / 12000000000000n) - Number((BigInt(595e8) + supply - amount) ** 2n / 12000000000000n))))


    let amountInput = new Uint8Array(new BigUint64Array([amount]).buffer)
    let otherInput = new Uint8Array(new BigUint64Array([other]).buffer)
    let idInput = new Uint8Array(new BigUint64Array([id]).buffer)

    let final = [2, ...amountInput, ...otherInput]
    let junk = new Uint8Array([0, ...idInput].concat(final))

    return junk
}


export function getProgramDataBUY(id, amount, supply) {
    const other = BigInt(Math.floor((2 * (Number((BigInt(595e8) + supply + amount) ** 2n / 12000000000000n) - Number((BigInt(595e8) + supply) ** 2n / 12000000000000n)))))


    let amountInput = new Uint8Array(new BigUint64Array([amount]).buffer)
    let otherInput = new Uint8Array(new BigUint64Array([other]).buffer)
    let idInput = new Uint8Array(new BigUint64Array([id]).buffer)

    let final = [1, ...amountInput, ...otherInput]
    let junk = new Uint8Array([0, ...idInput].concat(final))

    return junk
}


export async function getTokenSupplyById(accountID) {
    const tokenAccount = PublicKey.findProgramAddressSync([new Uint8Array([...new Uint8Array([109, 105, 110, 116,]), ...new Uint8Array(new BigUint64Array([accountID]).buffer)])], FRIENDZY)[0] // aka 'd'

    let obj = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenSupply",
        "params": [
            tokenAccount
        ]
    }
    let result = await axios.post(process.env.RPC_URL, obj)
        .then(res => {
            return res.data.result.value.amount
        }).catch((e) => {
            return 0
        })

    return result
}



export async function totalWalletValue() {
    /**
     * returns the total value of all keys in wallet (in SOL)
     */
    return await axios(`https://api2.friendzy.gg/v1/profile/${wallet.publicKey.toBase58()}/tokens`)
        .then((res) => {
            let total = BigInt(0)
            for (let element of res.data) {
                let sellReturns = BigInt(Math.floor( (Number(BigInt(595e8 + element.supply) ** 2n / 12000000000000n) - Number(BigInt(595e8 + element.supply - Number(element.amount)) ** 2n / 12000000000000n))))
                total += sellReturns
            }
            total = Number(total) / 10 ** 9 * .96
            return total
        })
}
