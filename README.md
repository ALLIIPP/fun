# fun

to run locally
1. create a .env file with the following values
    - WALLET=<base 58 encoded private key>
    - RPC_URL=<url of the RPC you would like to use>
    - MAX_KEYS_HOLDING=<the maximum number of positions to hold at a time> (OPTIONAL, default = 5)
    - MAX_SPEND=<the maximum amount of SOL to spend on a single trade> (OPTIONAL, default =0.25)

2. run 'npm install' in the project root
3. run node index.js
