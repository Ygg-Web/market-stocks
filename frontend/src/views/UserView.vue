<template>
  <div>
    <div v-if='loading === true' class='text-center'>Загрузка страницы...</div>
    <div v-else='loading === false'>
      <div class='user_header'>
        <div class='mx-2'><b>Данные брокера:</b></div>
        <div class='mr-2 my-2'><u>Брокер:</u> {{getAllUsers[userId].name}}</div>
        <div class='mr-2'><u>Баланс:</u> {{getAllUsers[userId].balance}} $</div>
        <div class='mr-2'><u>Доходность</u>(↑↓): {{getAllUsers[userId].profit ? getAllUsers[userId].profit : '...'}} $</div>
      </div>
      <div class="text-center mt-12">
        <div>Текущая дата: {{dateCurrent}}</div>
        <div v-if="getSettings.status === 'start'">Торги будут завершены: {{timeEndTrade}}</div>
        <div v-else-if="getSettings.status === 'end'">Торги окончены</div>
      </div>
      <div class='user'>
        <div class='table_stocks'>
          <div class='text-center'>Текущий портфель акций:</div>
          <table-stocks
              :stocks='stocksFilterForSell'
              type="sell"
              @onSell="onSell"
          ></table-stocks>
        </div>
        <div class='table_stocks'>
          <div class='text-center'>Биржа:</div>
          <div v-if="getSettings.status === 'start'">
            <table-stocks
                :stocks='stocksFilterForBuy'
                :userBalance="getAllUsers[userId].balance"
                type="buy"
                @onBuy="onBuy"
            ></table-stocks>
          </div>
          <div
              v-else-if="getSettings.status == 'end'" 
              class='text-center'
          >Биржа закрыта, торги прекращены</div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ISettings, IStock, ITrade, IUser } from '@/types'
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import TableStocks from '@/components/user/TableStocks.vue'

@Component({
  components: {
    'table-stocks': TableStocks
  },
})
export default class extends Vue {
  @Action('market/fetchUsersDB') fetchUsersDB!: Promise<void>
  @Action('market/fetchStocksDB') fetchStocksDB!: Promise<void>
  @Action('market/fetchSettingsDB') fetchSettingsDB!: Promise<void>
  @Getter('market/getAllUsers') getAllUsers!: IUser[]
  @Getter('market/getAllStocks') getAllStocks!: IStock[]
  @Getter('market/getSettings') getSettings!: ISettings
  userId: number = 0
  loading: boolean = true
  interval: any
  dateCurrent: string = ''

  async mounted() {
    this.userId = +this.$route.params.id - 1
    await (<any>this).fetchUsersDB()
    await (<any>this).fetchStocksDB()
    await (<any>this).fetchSettingsDB()
    this.loading = false
    this.timerDate()
  }

  unmounted() {
    this.clearTimerDate()
  }

  onBuy(event: ITrade): void {
    const trade = {
      buyerId: this.userId,
      stockId: event.stockId,
      count: event.count,
      price: this.getAllStocks[event.stockId].price,
    };
    (<any>this).$socket.emit('buy', trade)
  }

  onSell(event: ITrade): void {
    const trade = {
      sellerId: this.userId,
      stockId: event.stockId,
      count: event.count,
      price: event.price,
    };
    (<any>this).$socket.emit('sell', trade)
  }

  getParseDate(value: string | null = null): string {
    const date = value ? new Date(value) : new Date()
    return `${date.toLocaleDateString()}:${date.toLocaleTimeString()}`
  }

  timerDate(): void {
    this.interval = setInterval(() => {
      this.dateCurrent = this.getParseDate()
    }, 1000)
  }

  clearTimerDate(): void {
    clearInterval(this.interval)
  }

  get stocksFilterForSell(): IStock[] | void {
    if (this.getAllUsers) {
      const user = this.getAllUsers[this.userId]
      return user.stocks
        .filter((stock: IStock) => stock.count > 0)
        .map((stock: IStock) => {
          stock.name = this.getAllStocks[stock.id].name
          stock.price = this.getAllStocks[stock.id].price
          stock.button = ''
          return stock
        })
    }
  }

  get stocksFilterForBuy(): IStock[] | void {
    if (this.getAllStocks) {
      return this.getAllStocks.filter((stock: IStock) => (stock.count > 0))
    }
  }

  get timeEndTrade(): string | void {
    return this.getParseDate(this.getSettings.dateEnd)
  }
}
</script>
<style>
  .user{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }
  .user_header{
    position: fixed;
    width: 100%;
    top: 0%;
    background: #f5f5f5;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 100;
    font-size: 16px;
  } 
  .table_stocks{
    margin: 0 40px;
    width: 800px;
  }
</style>