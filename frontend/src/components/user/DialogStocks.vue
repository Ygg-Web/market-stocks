<template>
  <div>
    <v-dialog v-model="open" max-width="370">
      <template v-slot:activator="{ on }">
        <v-btn
            color='info'
            outlined
            @click='open = true'
        >{{type === 'buy' ? 'Купить' : 'Продать'}}</v-btn>
      </template>
      <v-card align="center" class='p-4'>
        <div class='pt-2'>Сколько акций хотите {{ type === 'buy' ? 'купить' : 'продать' }}?</div>
        <v-flex sm10>
          <v-text-field
              v-model='count'
              label='Введите количество'
              single-line
              type='number'
          ></v-text-field>
        </v-flex>
        <v-card-actions>
          <v-btn
              outlined
              @click='open = false'
          >Отмена</v-btn>
          <v-btn
              :disabled="!count"
              outlined
              @click="handleStart"
          >{{ type === 'buy' ? 'Купить' : 'Продать' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop(String) type!: string
  @Prop(Number) max!: number
  @Prop(Number) stockId!: number
  @Prop(Number) price!: number
  @Prop(Number) userBalance!: number
  open: boolean = false
  count: number|null = null

  handleStart() {
    const count = Number(this.count)
    if (count > this.max || count <= 0) {
      alert(`Количество акций должно быть меньше ${this.max + 1} и больше 0`)
    } else if (this.type === 'buy') {
      if (this.userBalance < this.price * count) {
        alert('Недостаточно средств для покупки')
      } else {
        this.$emit('onBuy', {count, stockId: this.stockId})
        this.open = false
      }
    } else {
      this.$emit('onSell', {count, stockId: this.stockId, price: this.price})
      this.open = false
    }
  }
}
</script>