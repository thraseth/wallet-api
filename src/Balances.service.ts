import { Injectable } from '@nestjs/common';
import {token} from './interfaces/token.interface';
import { Network, Alchemy } from 'alchemy-sdk';
import { CoinGeckoClient, PLATFORMS} from 'coingecko-api-v3';
import { allowedChain } from './Balances.controller';

//Connects to CoinGecko's API
const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});


//API key from Alchemy
const apiKey = "WbiNtlt91hYU3RqBlmEu1Yi0qmDxj8LA";


//Declares the Alchemy settings for our three allowed chains
const setETH = { //ethereum
  apiKey: apiKey,
  network: Network.ETH_MAINNET,
};
const setMAT = { //polygon
  apiKey: apiKey,
  network: Network.MATIC_MAINNET,
};
const setARB = { //arbitrum
  apiKey: apiKey,
  network: Network.ARB_MAINNET,
};


@Injectable()
export class BalancesService {

  /**
   * 
   * Retrieves the non-null list of erc20 tokens in a specified chain & wallet address
   * 
   * @param chain - The desired allowed chain 
   * @param wallet - The wallet address we try to retrieve the tokens from
   * 
   * @returns The erc20 list or throws an error
   * 
   */
  async getWalletContent(chain :allowedChain, wallet :string) :Promise<string | token[]> {
    let alchemy : Alchemy;
    let chainID : PLATFORMS;

    //Sets up the chain connection
    switch (chain) {
      case allowedChain.eth:
        alchemy = new Alchemy(setETH);
        chainID = 'ethereum';
        break;
      case allowedChain.matic:
        alchemy = new Alchemy(setMAT);
        chainID = 'polygon-pos';
        break;
      case allowedChain.arb:
        alchemy = new Alchemy(setARB);
        chainID ='arbitrum-one';
    }


    //Tries to retrieve the token balances for the wallet parameter
    let result;
    try{
      result = await alchemy.core.getTokenBalances(wallet,'erc20');
      if (result.tokenBalances.length == 0) //If there is only null balances, returns the following string
        throw new Error("There is no erc20 token for this address")
    }catch(error){
      throw new Error (error.body);
    }


    //Filters the resulting list to get only balances > 0
    const filtered = result.tokenBalances.filter((token) => {return token.tokenBalance !== '0' && Number(token.tokenBalance) != 0 });

    //Creates an array of tokens
    let list: Array<token> = [];

    //Loops through every retrieved erc20
    for(const t of filtered){
      let balance_usd: number | string;
      let tokenData;
      let newToken:token;

      //Retrieves the token metadata from alchemy
      let metadata = await alchemy.core.getTokenMetadata(t.contractAddress)

      //Retrieves the token informations from coingecko API
      tokenData = await client.contract({id :chainID, contract_address :t.contractAddress});


      if (tokenData.error){ //It means that the current token is not present in coingecko's database - sets the balance_usd as unretrievable
        balance_usd = "unretrievable";
      }
      else{ //If the token exists in coingecko's database, sets balance_usd according to the current USD price
        balance_usd= (tokenData.market_data.current_price.usd * (Number(t.tokenBalance) / Math.pow(10, metadata.decimals))).toFixed(2);
      }

      //Serializes the token data and pushes the new token object in our array
      newToken= {
        token_address: t.contractAddress,
        name: metadata.name,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        balance: Number(t.tokenBalance).toString(),
        balance_usd: balance_usd
      }
      list.push(newToken);
    }

    //Returns the array of token objects
    return list;
  }

}
