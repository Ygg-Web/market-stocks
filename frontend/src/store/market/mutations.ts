import {
  MarketState,
  ISettings,
  IStock,
  ITrade,
  IUser,
  ISetDate,
} from '@/types';
import { MutationTree } from 'vuex';

export const mutations: MutationTree<MarketState> = {
  SET_USERS(state, users: IUser[]) {
    state.users = users;
  },
  SET_STOCKS(state, stocks: IStock[]) {
    state.stocks = stocks;
  },
  SET_SETTINGS(state, settings: ISettings) {
    state.settings = settings;
  },
  CHANGE_STATUS(state, status: string) {
    state.settings.status = status;
  },
  SET_DATE(state, date: ISetDate) {
    state.settings.interval = date.interval;
    state.settings.dateEnd = date.dateEnd;
  },
  TRANSACTION_BUY(state, trade: ITrade) {
    const balanceUser = state.users[trade.buyerId!].balance;
    if (balanceUser >= trade.count * trade.price!) {
      state.users[trade.buyerId!].stocks[trade.stockId].count += trade.count;
      state.users[trade.buyerId!].balance -= trade.price! * trade.count;
      state.stocks[trade.stockId].count -= trade.count;
    }
  },
  TRANSACTION_SELL(state, trade: ITrade) {
    const countStocksUser =
      state.users[trade.sellerId!].stocks[trade.stockId].count;
    if (trade.count <= countStocksUser) {
      state.users[trade.sellerId!].stocks[trade.stockId].count -= trade.count;
      state.users[trade.sellerId!]!.balance += trade.price! * trade.count;
      state.stocks[trade.stockId].count += trade.count;
    }
  },
  CHANGE_PRICE_STOCKS(state, stocks: IStock[]) {
    state.stocks.map((stock: IStock) => {
      const time = new Date().toLocaleTimeString();
      stock.historyTime!.push(time);
      stock.historyPrice!.push(stocks[stock.id].price!);
      stock.price = stocks[stock.id].price;
      return stock;
    });
  },
  CALC_PROFIT_STOCK(state, stocks: IStock[]) {
    let dif;
    state.users.map((user: IUser) => {
      user.stocks.map((stock: IStock) => {
        dif = stocks[stock.id].price! - state.stocks[stock.id].price!;
        stock.profit = dif * stock.count;
        return stock;
      });
      return user;
    });
  },
  SUMM_PROFIT(state) {
    let sumProfit;
    state.users.map((user: IUser) => {
      sumProfit = user.stocks.reduce((total, { profit }) => total + profit, 0);
      user.profit = sumProfit;
      return user;
    });
  },
};
