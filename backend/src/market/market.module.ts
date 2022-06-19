import { Module } from '@nestjs/common';
import { MarketGateway } from './market.gateway';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  providers: [MarketGateway, MarketService],
  exports: [MarketGateway],
  controllers: [MarketController],
})
export class MarketModule {}
