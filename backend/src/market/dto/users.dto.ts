import { Stock } from './stocks.dto';

export class User {
  id: number;
  name: string;
  login: string;
  balance: number;
  profit: number;
  stocks: Stock[];
}
