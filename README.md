# REST API for erc20 tokens

This is a REST API to retrieve the list of erc20 tokens owned by a specific wallet on Ethereum(ETH), Polygon (MATIC) or Arbitrum

It uses `NestJS` with TypeScript and built-in express web framework.

It uses the `Alchemy-sdk` build to fetch the wallet data.

It uses the `CoinGecko` API to fetch the tokens metadatas and prices.

## Dependencies

* node
* npm
* typescript
* nestJS
* Alchemy-sdk
* CoinGecko-API-v3


## Getting Started
Clone this repo:
```
git clone https://github.com/thraseth/wallet-api.git wallet-api && cd wallet-api
```

Install dependencies:
```
 npm i
```

Start server:
```
npm run start
```

## Description

The REST API is described below.

### Request the list of erc20 tokens

`GET /Balances/@chain/@wallet`

```
Use the following HTTP instruction in your browser or your REST client (ex: insomnia.rest) : "http://localhost:3000/Balances/@chain/@wallet"
Where:
@chain - Is the chain you want to retrieve the wallet from. Can be "ethereum", "polygon" or "arbitrum"
@wallet - Is the wallet address you want to retrieve the assets from
example: "http://localhost:3000/Balances/ethereum/0xab5801a7d398351b8be11c439e05c5b3259aec9b"
```

### Wrong requests

`GET /Balances/@chain/@wallet`
If the wallet contains no non-null token balance, it will output the following message:
```
There is no erc20 token for this address
```

if the wallet address does not respect the hexadecimal wallet address format, it will output the error thrown by the Alchemy SDK !



`GET /Balances/@chain`
This endpoint will lead to an error message.

* If the chain is correct:
```
You need to complete your request as follow: Balances/@chain/@wallet
```
* If the chain is uncorrect or unallowed:
```
Thrown error: The chain parameter can only be "ethereum", "polygon" or "arbitrum" and you need to complete your request as follow: Balances/@chain/@wallet
```
## Testing

You can run a test built with the NEST built-in JEST framework with that command line:
`npm run test`
This automated testing command should:
* Try to retrieve erc20 assets from a given wallet address on our three allowed chains
* Try again with a wrong chain name
* Try again with a wallet wrong synthax
* Try to reach the @chain endpoint 

## Further informations

* I chose to use the NestJS framework to get closer to production needs. 
* I decided not to use the swagger module to keep a raw output and exploit the native possibilities of nestJS.
* I decided to use the Alchemy sdk to fetch the on-chain data, and the coinGecko API for the tokens metadatas and their USD value.
* I had to make a modification to the alchemy API to fix an endpoint (alchemy.core.getTokenBalances) that didn't allow filtering erc20 tokens. 
* Since ETH is not an erc20, I did not include it in the response.
* A minor limitation of the API is that some little known tokens may not be listed on coinGecko, so the API won't be able to display these tokens. A workaround could be to make an aggregator of APIs from tools like coinGecko to limit this kind of behaviour.
