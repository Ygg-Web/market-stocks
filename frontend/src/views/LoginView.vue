<template>
  <div class='login'>
    <div v-if='loading === true'>Загрузка...</div>
    <div v-else="loading === false" class='login_inner'>
      <h3>Биржа акций</h3>
      <div class='select_user'>
        <v-select
            v-model='selectedUser'
            :items='users'
            label='Выберите пользователя...'
            solo          
        ></v-select>
      </div>
      <div class='controllers'>
        <v-btn 
            @click='login'
            outlined
        >Войти</v-btn>
        <v-btn 
            @click='clear'
            outlined
        >Очистить</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IUser } from '@/types'
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

@Component
export default class extends Vue {
  @Action('market/fetchUsersDB') fetchUsersDB!: Promise<void>
  @Action('market/fetchStocksDB') fetchStocksDB!: Promise<void>
  @Getter('market/getAllUsers') getAllUsers!: IUser[]

  users: string[] = ['admin']
  selectedUser: string = ''
  loading = true

  async created() {
    await (<any>this).fetchUsersDB()
    await (<any>this).fetchStocksDB()
    this.loading = false
    this.updateUsers()
  }

  updateUsers(): void {
    this.users = [...this.users, ...this.getAllUsers.map((user: IUser) => user.login)]
  }

  login(): void {
    let userId = -1
    let userIn = false
    let id = 0
    for (let user of this.users){
      if (this.selectedUser === user) {
        userIn = true
        userId = id
        break
      }
      id++ 
    }

    if (this.selectedUser === 'admin') {
      this.$router.push({ name: 'admin' })
    } else if (!userIn) {
      alert('Логин введен неправильно!')
    } else {
      (<any>this).$router.push({ name: 'user', params: { id: userId } })
    }
  }

  clear(): void {
    this.selectedUser = ''
  }
}
</script>
<style scoped>
  .login{
    height: 100vh;
    padding-top: 100px;
    display: flex;
    justify-content: center;
    background-color: #fcfcfc;
    font-size: 16px;
  }
  .login_inner{
    width: 500px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border:  1px solid #bfbfbf;
    border-radius: 5px;
    background: #f5f5f5;
  }
  .select_user{
    width: 250px;
    margin: 20px 0;
    height: 30px !important;
  }
  ::v-deep .v-input__slot{
    min-height: 30px;
  }
  .select_user ::v-deep .v-input__slot{
    border-radius: 5px;
    border: 1px solid #bfbfbf;
  }
  .select_user ::v-deep .v-text-field--solo > .v-input__control > .v-input__slot{
    font-size: 16px;
    background: #e4e4e4;
  }
  .select_user ::v-deep .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot{
    box-shadow:  none;
  }
  .controllers{
    margin-top: 5px;
  }
  .login .v-btn{
    width: 115px;
  }
</style>