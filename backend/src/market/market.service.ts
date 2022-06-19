import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Settings } from './dto/settings.dto';
import { Stock } from './dto/stocks.dto';
import { User } from './dto/users.dto';

const database: any = JSON.parse(readFileSync('db.json', 'utf-8'));

@Injectable()
export class MarketService {
  users: User[];
  stocks: Stock[];
  settings: Settings;

  constructor() {
    (this.users = database.users), (this.stocks = database.stocks), (this.settings = database.settings);
  }

  getUsers(): User[] {
    return this.users;
  }

  getAllStocks(): Stock[] {
    return this.stocks;
  }

  getSettings(): Settings {
    return this.settings;
  }
}
