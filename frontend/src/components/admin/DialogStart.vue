<template>
  <v-row class="m-2">
    <v-dialog v-model="open" max-width="400">
      <template v-slot:activator="{ on }">
        <v-btn
            min-width="150"
            color="info"
            dark
            @click="onClickOpen"
        >Начать торги</v-btn>
      </template>
      <v-card align='center'>
        <v-card-title class="text-h6 justify-center">Настройки торгов</v-card-title>
        <v-card-text>Введите данные торгов</v-card-text>
        <v-flex xs12 sm8>
          <v-text-field
              label="Интервал изменения цены"
              type="number"
              v-model="interval"
              single-line
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm8>
          <v-text-field
              label="Дата"
              type="datetime-local"
              v-model="date"
              single-line
          ></v-text-field>
        </v-flex>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn 
              color="green darken-1" 
              @click="onClickClose"
              text 
          >Отмена</v-btn>
          <v-btn
              :disabled="!date || !interval"
              color="green darken-1"
              @click="handleStart"
              text
          >Начать торги</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  interval: number|null = null
  open: boolean = false
  date: string = ''

  handleStart(): void {
    if (this.date && this.interval) {
      if (this.interval > 5) {
        const dateSet = new Date(this.date).getTime()
        const dateCurrent = new Date().getTime()
        const dateDif = dateSet - dateCurrent
        const dateMounth = new Date(2592000000).getTime()
        if (dateSet > dateCurrent && dateDif < dateMounth) {
          const endTime = {
            interval: Number(this.interval),
            dateEnd: this.date,
          };
          this.$emit('onStartClick', endTime)
          this.open = false
        } else {
          alert('Дата должна быть больше текущей и меньше месяца вперед')
        }
      } else {
        alert('Интервал должен быть > 5')
      }
    } else {
      alert('Необходимо заполнить все поля')
    }
  }

  onClickOpen(): void {
    this.open = true
  }

  onClickClose(): void {
    this.open = false
  }
}
</script>