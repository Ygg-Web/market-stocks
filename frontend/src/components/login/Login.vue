<template>
  <div>
    <div v-if="loading" class="text-h3 text-center" >
      Загрузка...
    </div>
    <v-layout v-else="!loading" align-center justify-center column>
      <h1>Биржа акций</h1>
      <form style="width: 50%;">
        <v-select v-model="selectedUser" :items="users" label="Выберите пользователя"></v-select>
        <v-btn class="mr-4" @click="login">
          Войти
        </v-btn>
        <v-btn @click="clear">
          Очистить
        </v-btn>
      </form>
    </v-layout>
  </div>
</template>

<script lang="ts">
  import { IUser } from '@/types';
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter } from "vuex-class";

  @Component
  export default class extends Vue {
    @Action('market/fetchUsersDB') fetchUsersDB: Promise<void>;
    @Action("market/fetchStocksDB") fetchStocksDB: Promise<void>;
    @Getter('market/getAllUsers') getAllUsers: IUser[];

    users: string[] = ["admin"]
    selectedUser: string = ''
    loading = true

    async mounted() {
      await this.fetchUsersDB()
      await this.fetchStocksDB()
      this.loading = false
      this.updateUsers()
    }

    updateUsers(): void {
      this.users = [...this.users, ...this.getAllUsers.map((user: IUser) => user.login)]
    }

    login(): void {
      let userId = -1;
      let userIn = false;
      for (let i = 0; i < this.users.length; i++) {
        if (this.selectedUser === this.users[i]) {
          userIn = true;
          userId = i;
          break;
        }
      }
      if (this.selectedUser === 'admin') {
        this.$router.push({name: 'admin'})
      } else if (!userIn) {
        alert('Логин введен неправильно!')
      } else {
        this.$router.push({name: "user", params: {id: userId}})
      }
    }

    clear(): void {
      this.selectedUser = ''
    }

  }
</script>