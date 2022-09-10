<template>
  <div>
    <v-dialog v-model="open" max-width="370">
      <template v-slot:activator="{ on }">
        <v-btn
            outlined
            @click='open = true'
        >Настройка</v-btn>
      </template>
      <v-card align='center'>
        <div class='pt-2'>Введите данные торгов</div>
        <v-flex sm10>
          <v-text-field
              v-model='interval'
              label='Интервал изменения цены'
              type='number'
              single-line
          ></v-text-field>
          <span class='date'>Дата окончания торгов:</span>
          <v-text-field
          class='mt-0 pt-0'
              v-model='dateEnd'
              label='Дата'
              type='datetime-local'
              single-line
          ></v-text-field>
        </v-flex>  
        <v-card-actions>
          <v-btn 
              outlined
              @click='open = false'
          >Отмена</v-btn>
          <v-btn
              :disabled='!dateEnd || !interval'
              outlined
              @click='handleStart'
          >Начать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  interval: number|null = null
  open: boolean = false
  dateEnd: string = ''
  handleStart(): void {
    if (this.interval && this.interval > 5) {
      const dateSet = new Date(this.dateEnd).getTime()
      const dateCurrent = new Date().getTime()
      if (dateSet > dateCurrent) {
        this.$emit('onStartClick', {interval: Number(this.interval), dateEnd: this.dateEnd,})
        this.open = false
      } else {
        alert('Дата должна быть больше текущей')
      }
    } else {
      alert('Интервал должен быть > 5')
    }
  }
}
</script>
<style>
  .date{
    margin: 10px 0 0;
    text-align: start;
    width: 100%;
    display: block;
  }
</style>