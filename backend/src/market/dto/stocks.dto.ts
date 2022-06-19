export class Stock {
  id: number;
  count: number;
  name?: string;
  price?: number;
  stepChange?: number;
  profit: number;
  historyPrice?: [];
  historyTime?: [];
}
