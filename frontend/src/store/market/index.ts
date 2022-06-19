import { Module } from "vuex";
import { MarketState } from "@/types";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { actions } from "./actions";

const state: MarketState = {
  users: [],
  stocks: [],
  settings: {},
};

export const market: Module<MarketState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
