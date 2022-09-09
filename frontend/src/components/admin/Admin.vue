<template>
  <div>
    <div v-if='loading === true' class='text-center'>Загрузка страницы...</div>
    <div v-else='loading === false' class='admin'>
      <h3 class='text-center mt-2'>Панель андминистратора</h3>
      <div class='text-center mb-2'>Таблица пользователей:</div>
      <table-users
          :users='updateUsers'
      ></table-users>
      <div class='admin_header'>
        <div class='admin_info'><b>Управление торгами:</b></div>
        <div class='admin_info'>
          <div v-if="getSettings.status === 'end'">Торги окончены</div>
          <div v-else-if="getSettings.status === 'start'">Торги будут завершены: {{timeEndTrade}}</div>
        </div>
        <div class='admin_controllers'>
          <DialogStart 
              @onStartClick='onStartClick'
          ></DialogStart>
          <v-btn
              class='admin_button'
              color='error'
              @click='onEndClick'
          >Конец торгов</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ISettings, IStock, IUser, ISetDate } from '@/types'
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import DialogStart from './DialogStart.vue'
import TableUsers from './TableUsers.vue'

@Component({
  components: {
    DialogStart,
    'table-users': TableUsers
  },
})
export default class extends Vue {
  @Action('market/fetchUsersDB') fetchUsersDB!: Promise<void>
  @Action('market/fetchStocksDB') fetchStocksDB!: Promise<void>
  @Action('market/fetchSettingsDB') fetchSettingsDB!: Promise<void>
  @Getter('market/getAllUsers') getAllUsers!: IUser[]
  @Getter('market/getAllStocks') getAllStocks!: IStock[]
  @Getter('market/getSettings') getSettings!: ISettings

  
  change: number = 0
  loading: boolean = true

  async created() {
    await (<any>this).fetchUsersDB()
    await (<any>this).fetchStocksDB()
    await (<any>this).fetchSettingsDB()
    this.loading = false

  }

  onStartClick(event: ISetDate): void {
    (<any>this).$socket.emit('start', event)
  }

  onEndClick(): void {
    (<any>this).$socket.emit('end')
  }

  get updateUsers(): IUser[] | void {
    if (this.getAllUsers) {
      let users = this.getAllUsers.map((user: IUser) => {
        user.stocks
          .filter((stock: IStock) => stock.count > 0)
          .map((stock: IStock) => {
            stock.name = this.getAllStocks[stock.id].name
            return stock
          })
        return user
      })
      return users
    }
  }

  get timeEndTrade(): string {
    return `${new Date(
      this.getSettings.dateEnd!).toLocaleDateString()}:${new Date(this.getSettings.dateEnd!).toLocaleTimeString()}`
  }
}
</script>
<style scoped>
  .admin{
    padding-top: 50px;
    font-size: 16px;
  }
  .admin_header{
    position: fixed;
    top: 0;
    width: 100%;
    background: #f5f5f5;
    display: flex;
    justify-content: flex-start;
    z-index: 100;
  }
  .admin_controllers{
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
  }
  .admin_button{
    margin: 0 10px;
    width: 150px;
    height: 30px !important;
    text-transform: capitalize;
    font-weight: normal;
    font-size: 16px !important;
    border: 1px solid #bfbfbf;
    background: #e4e4e4
  }
  .admin_info{
    margin: 0 10px;
  }
</style>