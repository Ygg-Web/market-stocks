<template>
  <div>
    <div v-if="loading" class="text-h5 text-center">Загрузка страницы...</div>
    <div v-else="!loading">
      <h1 class="text-md-center">Страница брокера</h1>
      <v-card class="pa-5 mt-5 mb-5" color="#FAFAFA">
        <v-card-title class="pa-0 pb-3 text-h5 justify-center font-weight-bold">Данные брокера:</v-card-title>
        <v-card-text class="pa-0 " style="font-size: 16px;">
          <v-list-item>
            Брокер:
            <span class="text-decoration-underline">
              {{ getAllUsers[userId].name }}</span>
          </v-list-item>
        </v-card-text>
        <v-card-text class="pa-0" style="font-size: 16px;" >
          <v-list-item>
            Баланс:
            <span class="text-decoration-underline">{{  getAllUsers[userId].balance }}$</span>
          </v-list-item>
        </v-card-text>
        <v-card-text class="pa-0" style="font-size: 16px;" >
          <v-list-item>
            Доходность(↑↓):
            <span class="text-decoration-underline">{{  getAllUsers[userId].profit ? getAllUsers[userId].profit : '...'  }}$</span>
          </v-list-item>
        </v-card-text>
      </v-card>
      <v-divider></v-divider>
      <v-card class="pa-5 mt-5 mb-5" color="#FAFAFA" >
        <v-card-title class="text-h5 justify-center font-weight-bold">
          Текущий портфель акций:
        </v-card-title>
        <TableStocks type="sell" :stocks="stocksFilterForSell" @onSell="onSell" />
      </v-card>
      <v-divider></v-divider>
      <v-card class="pa-5 mt-5 mb-5" color="#FAFAFA">
        <v-layout align-center jusstify-center column class="pa-2">
          <h4>Текущая дата: {{dateCurrent}}</h4>
          <h4 v-if="getSettings.status === 'start'">Торги будут завершены: {{timeEndTrade}}</h4>
          <h4 v-else-if="getSettings.status === 'end'">Торги окончены</h4>
        </v-layout>
        <v-divider></v-divider>
        <v-card-title class="text-h5 justify-center font-weight-bold">
          Биржа
        </v-card-title>
        <v-card-subtitle class="justify-center d-flex mb-1 pa-2" style="font-size: 16px;">
          Акции доступные для покупки
        </v-card-subtitle>
        <TableStocks v-if="getSettings.status ==='start'" type="buy" :stocks="stocksFilterForBuy" @onBuy="onBuy" :userBalance="getAllUsers[userId].balance"/>
        <h5 v-else-if="getSettings.status =='end'" class="text-center text-h6">Биржа закрыта, торги прекращены</h5>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
  import { ISettings, IStock, ITrade, IUser } from "@/types";
  import { Component,Vue } from "vue-property-decorator";
  import { Action, Getter } from "vuex-class";
  import TableStocks from "./TableStocks.vue";

  @Component({
    components: {
      TableStocks,
    },
  })
  export default class extends Vue {
    @Action("market/fetchUsersDB") fetchUsersDB: void;
    @Action("market/fetchStocksDB") fetchStocksDB: void;
    @Action("market/fetchSettingsDB") fetchSettingsDB: void;
    @Getter("market/getAllUsers") getAllUsers: IUser[];
    @Getter("market/getAllStocks") getAllStocks: IStock[];
    @Getter("market/getSettings") getSettings: ISettings;

    userId: number = 0;
    loading: boolean = true;
    interval: any;
    dateCurrent: string = '';

    async mounted() {
      this.userId = +this.$route.params.id - 1;
      await this.fetchUsersDB();
      await this.fetchStocksDB();
      await this.fetchSettingsDB();
      this.loading = false;
      this.timerDate();
    }

    unmounted(){
      this.clearTimerDate()
    }

    onBuy(event: ITrade): void {
      const trade = {
        buyerId: this.userId,
        stockId: event.stockId,
        count: event.count,
        price: this.getAllStocks[event.stockId].price,
      };
      this.$socket.emit("buy", trade);
    }

    onSell(event: ITrade): void {
      const trade = {
        sellerId: this.userId,
        stockId: event.stockId,
        count: event.count,
        price: event.price
      };
      this.$socket.emit("sell", trade);
    }

    getParseDate( value: string | null = null ): string {
      const d = value ? new Date(value) : new Date();
      const date = d.toLocaleDateString();
      const time = d.toLocaleTimeString();
      return `${date}:${time}`;
    }

    timerDate(): void {
      this.interval = setInterval(()=>{
        this.dateCurrent = this.getParseDate();
      }, 1000)
    }

    clearTimerDate(): void {
      clearInterval(this.interval)
    }

    get stocksFilterForSell(): IStock[] {
      if (this.getAllUsers) {
        const user = this.getAllUsers[this.userId];
        const userStocks = user.stocks
          .filter((stock: IStock) => stock.count > 0)
          .map((stock: IStock) => {
             stock.name = this.getAllStocks[stock.id].name;
             stock.price = this.getAllStocks[stock.id].price;
            return stock;
          });
        return userStocks;
      }
    }

    get stocksFilterForBuy(): IStock[] {
      if (this.getAllStocks) {
        const stocks = this.getAllStocks
          .filter((stock: IStock) => stock.count > 0)
          // .map((stock: IStock) => {
          //   stock.price = stock.price;
          //   return stock;
          // });
        return stocks;
      }
    }

    get timeEndTrade(): string {
      return this.getParseDate(this.getSettings.dateEnd)
    }

  }
</script>