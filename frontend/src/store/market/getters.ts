import { MarketState, ISettings, IStock, IUser } from "@/types";
import { GetterTree } from "vuex";

export const getters: GetterTree<MarketState, any> = {
  getAllUsers(state): IUser[] {
    return state.users;
  },
  getAllStocks(state): IStock[] {
    return state.stocks;
  },
  getSettings(state): ISettings {
    return state.settings;
  },
};
