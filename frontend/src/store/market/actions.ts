import axios from 'axios';
import { ActionTree } from 'vuex';
import { MarketState, IStock, ITrade, ISetDate } from '@/types';

const Axios = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

export const actions: ActionTree<MarketState, any> = {
  async fetchUsersDB({ commit }): Promise<void> {
    const { data } = await Axios.get('/market/users');
    commit('SET_USERS', data);
  },
  async fetchStocksDB({ commit }): Promise<void> {
    const { data } = await Axios.get('/market/stocks');
    commit('SET_STOCKS', data);
  },
  async fetchSettingsDB({ commit }): Promise<void> {
    const { data } = await Axios.get('/market/settings');
    commit('SET_SETTINGS', data);
  },
  SOCKET_start({ commit }: any, date: ISetDate): void {
    commit('CHANGE_STATUS', 'start');
    commit('SET_DATE', date);
  },
  SOCKET_end({ commit }: any): void {
    commit('CHANGE_STATUS', 'end');
  },
  SOCKET_buy({ commit }: any, trade: ITrade): void {
    commit('TRANSACTION_BUY', trade);
  },
  SOCKET_sell({ commit }: any, trade: ITrade): void {
    commit('TRANSACTION_SELL', trade);
  },
  SOCKET_change({ commit }: any, stocks: IStock[]): void {
    commit('CALC_PROFIT_STOCK', stocks);
    commit('CHANGE_PRICE_STOCKS', stocks);
    commit('SUMM_PROFIT');
  },
};
