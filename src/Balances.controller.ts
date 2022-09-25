import { Controller, Get, Param } from '@nestjs/common';
import { BalancesService } from './Balances.service';

//Enumerates the allowed chains
export enum allowedChain {
  eth = 'ethereum',
  matic = 'polygon',
  arb = 'arbitrum'
}

@Controller('Balances/:chain')
export class BalancesController {
  constructor(private readonly BalancesService: BalancesService) {}

  @Get()
  /**
   * 
   * Handles the chain endpoint
   * 
   * @param chain - The chain parameter from the HTTP request
   * 
   * @returns An instruction for the full correct synthax or an error if the chain is not an allowed chain
   * 
   */
  chainEndpointHandler(@Param('chain') chain:allowedChain) {
    let wrong = 'You need to complete your request as follow: Balances/@chain/@wallet';
    if(Object.values(allowedChain).includes(chain))
    throw new Error(wrong);
    else
    throw new Error('The chain parameter can only be "ethereum", "polygon" or "arbitrum" and '+ wrong.toLowerCase()); 
  }



  @Get(':wallet')
  /**
   * 
   * Handles the wallet nested endpoint
   * 
   * @param chain - The chain parameter from the HTTP request
   * @param wallet - The wallet parameter from the HTTP request
   * 
   * @returns The Promise<string | token[]> from the getWalletContent method
   * 
   */
  getWalletContent(@Param('chain') chain: allowedChain, @Param('wallet') wallet: string) {
    if(Object.values(allowedChain).includes(chain))
    return this.BalancesService.getWalletContent(chain, wallet);
    else
    throw new Error('The chain parameter can only be "ethereum", "polygon" or "arbitrum"');
  }
}

