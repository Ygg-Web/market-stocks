import { Controller, Get } from '@nestjs/common';
import { Settings } from './dto/settings.dto';
import { Stock } from './dto/stocks.dto';
import { User } from './dto/users.dto';
import { MarketService } from './market.service';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('/users')
  getUsers(): User[] {
    return this.marketService.getUsers();
  }

  @Get('/stocks')
  getAllStocks(): Stock[] {
    return this.marketService.getAllStocks();
  }

  @Get('/settings')
  getSettings(): Settings {
    return this.marketService.getSettings();
  }
}
