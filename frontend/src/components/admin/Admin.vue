<template>
  <div>
    <div v-if="loading" class="text-h5 text-center">Загрузка страницы...</div>
    <div v-else="!loading">
      <h1 class="text-md-center mb-10">Панель андминистратора</h1>
      <h3 class="mb-5">Таблица пользователей:</h3>
      <v-card style="width: 100%;" color="#FAFAFA" class="pa-3 d-flex flex-wrap">
        <v-card v-for="user in updateUsers" :key="user.id" class="ma-3" max-width="300">
          <v-card-title class="justify-center pb-0 font-weight-bold">
            {{ user.name }}
          </v-card-title>
          <v-list-item>
            <v-card-text class="p-0">
              <v-list-item-content>
                <v-list-item-title>Логин: <span>{{ user.login }}</span></v-list-item-title>
                <v-list-item-title>Баланс: <span>{{ user.balance }} $</span></v-list-item-title>
                <v-list-item-title>Доходность(↑↓): <span>{{ user.profit ? user.profit : '...' }} $</span></v-list-item-title>
                <v-list-item-title class="text-md-center ma-2 text-decoration-underline">Обладает акциями:</v-list-item-title>
                <v-list-item-title v-for="stock in user.stocks.filter(
                    (stock) => stock.count > 0
                  )">
                  {{ stock.name }}: <span>{{ stock.count }} шт.</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-card-text>
          </v-list-item>
        </v-card>
      </v-card>
      <h3 class="mb-5 mt-5">Управление торгами:</h3>
      <v-card color="#FAFAFA" class="pa-3">
        <v-layout align-center justify-center column>
          <h4 v-if="getSettings.status === 'end'">Торги окончены</h4>
          <h4 v-else-if="getSettings.status === 'start'">Торги будут завершены: {{timeEndTrade}}</h4>
        </v-layout>
        <v-divider></v-divider>
        <v-layout align-center justify-center column class="pt-5">
          <DialogStart @onStartClick="onStartClick" />
          <v-btn class="ma-5" color="error" min-width="300px" @click="onEndClick">
            Конец торгов
          </v-btn>
       </v-layout>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
  import { ISettings, IStock, IUser, ISetDate } from "@/types";
  import { Component, Vue } from "vue-property-decorator";
  import { Action, Getter } from "vuex-class";
  import DialogStart from "./DialogStart.vue";

  @Component({
    components: {
      DialogStart,
    },
  })
  export default class extends Vue {
    @Action("market/fetchUsersDB") fetchUsersDB!: Promise<void>;
    @Action("market/fetchStocksDB") fetchStocksDB!: Promise<void>;
    @Action("market/fetchSettingsDB") fetchSettingsDB!: Promise<void>;
    @Getter("market/getAllUsers") getAllUsers!: IUser[];
    @Getter("market/getAllStocks") getAllStocks!: IStock[];
    @Getter("market/getSettings") getSettings!: ISettings;

    change: number = 0;
    loading: boolean = true;

    async mounted() {
      await (< any >this).fetchUsersDB();
      await (< any >this).fetchStocksDB();
      await (< any >this).fetchSettingsDB();
      this.loading = false;
    }

    onStartClick(event: ISetDate): void {
      (< any >this).$socket.emit("start", event);
    }

    onEndClick(): void {
      (< any >this).$socket.emit("end");
    }

    get updateUsers(): IUser[] | void {
     if(this.getAllUsers){
      let users = this.getAllUsers.map((user: IUser) => {
        user.stocks
          .filter((stock: IStock) => stock.count > 0)
          .map((stock: IStock) => {
            stock.name = this.getAllStocks[stock.id].name;
            return stock;
          });
        return user;
      });
      return users;
     }
    }

    get timeEndTrade(): string {
     return `${new Date(this.getSettings.dateEnd!).toLocaleDateString()}:${new Date(this.getSettings.dateEnd!).toLocaleTimeString()}`
    }
  }
</script>