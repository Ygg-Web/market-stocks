import { Settings } from './settings.dto';
import { Stock } from './stocks.dto';
import { User } from './users.dto';

export class Database {
  users: User[];
  stocks: Stock[];
  settings: Settings;
}
