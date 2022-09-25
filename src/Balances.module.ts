import { Module } from '@nestjs/common';
import { BalancesController } from './Balances.controller';
import { BalancesService } from './Balances.service';

@Module({
  imports: [],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}
