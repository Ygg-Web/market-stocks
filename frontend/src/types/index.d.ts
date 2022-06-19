export interface MarketState {
  users: IUser[];
  stocks: IStock[];
  settings: ISettings;
}

export interface ISettings {
  dateStart?: string;
  dateEnd?: string;
  interval?: number;
  status?: string;
}

export interface IUser {
  id: number;
  name: string;
  login: string;
  balance: number;
  profit: number;
  stocks: IStock[];
}

export interface IStock {
  id: number;
  count: number;
  name?: string;
  price?: number;
  stepChange?: number;
  profit: number;
  historyPrice?: number[];
  historyTime?: string[];
}

export interface ITrade {
  buyerId?: number;
  sellerId?: number;
  stockId: number;
  count: number;
  price?: number;
}

export interface ISetDate {
  interval: number;
  dateEnd: string;
}
