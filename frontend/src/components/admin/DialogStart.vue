<template>
  <v-row class="m-2">
    <v-dialog v-model="open" max-width="490">
      <template v-slot:activator="{on}">
        <v-btn class="mt-4" min-width="300" color="info" dark @click="onClickOpen">
          Начать торги
        </v-btn>
      </template>
      <v-card align="center">
        <v-card-title class="text-h5 justify-center">
          Настройки торгов
        </v-card-title>
        <v-card-text>Введите данные торгов</v-card-text>
        <v-flex xs12 sm8>
          <v-text-field label="Интервал изменения цены" type="number" v-model="interval" single-line></v-text-field>
        </v-flex>
        <v-flex xs12 sm8>
          <v-text-field label="Дата" type="datetime-local" v-model="date" single-line></v-text-field>
        </v-flex>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn color="green darken-1" text @click="onClickClose">
            Отмена
          </v-btn>
          <v-btn :disabled="!date || !interval" color="green darken-1" text @click="handleStart">
            Начать торги
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";

  @Component
  export default class extends Vue {
    open: boolean = false;
    interval: number | null = null;
    date: string = "";

    onClickOpen(): void {
      this.open = true;
    }

    onClickClose(): void {
      this.open = false;
    }

    handleStart(): void {
      if(this.date && this.interval){
        if(this.interval > 5){
          const dateSet = new Date(this.date).getTime();
          const dateCurrent = new Date().getTime();
          const dateDif = dateSet - dateCurrent
          const dateMounth = new Date(2592000000).getTime();
          if (dateSet > dateCurrent && dateDif < dateMounth) { 
            const  endTime = {
              interval: parseInt(this.interval),
              dateEnd: this.date
            }
            console.log(endTime);
            this.$emit("onStartClick", endTime);
            this.open = false;
          } else {
            alert("Дата должна быть больше текущей и меньше месяца вперед");
          }
        } else {
          alert('Интервал должен быть > 5');
        }
      } else {
        alert('Необходимо заполнить все поля');
      }
    }
  }
</script>









