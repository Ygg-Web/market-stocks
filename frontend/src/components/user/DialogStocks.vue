<template>
  <v-row justify="center">
    <v-dialog v-model="open" max-width="390">
      <template v-slot:activator="{on}">
        <v-btn class="ma-3" min-width="170" color="info" dark @click="onClickOpen">
         {{ type === 'buy' ? 'Купить' : 'Продать' }}
        </v-btn>
      </template>
      <v-card align="center">
        <v-card-title class="text-h5 justify-center">
          {{ type === 'buy' ? 'Покупка' : 'Продажа'}} акций
        </v-card-title>
        <v-card-text>Сколько акций хотите {{ type=== 'buy' ? 'приобрести' : 'продать'}}?</v-card-text>
        <v-flex xs12 sm8>
          <v-text-field label="Количество" single-line v-model="count"></v-text-field>
        </v-flex>
        <v-card-actions>
          <v-spacer>
          </v-spacer>
          <v-btn color="green darken-1" text @click="onClickClose">
            Отмена
          </v-btn>
          <v-btn :disabled="!count" color="green darken-1" text @click="handleStart">
            {{ type === 'buy' ? 'Купить' : 'Продать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class extends Vue {
    @Prop(String) type: string;
    @Prop(Function) onSell: void;
    @Prop(Function) onBuy: void;
    @Prop(Number) max: number;
    @Prop(Number) stockId: number;
    @Prop(Number) price: number;
    @Prop(Number) userBalance: number;

    open: boolean = false;
    count: number | null  = null;

    onClickOpen() {
      this.open = true;
    }

    onClickClose() {
      this.open = false;
    }

    handleStart() {
      const count = parseInt(this.count);
      if (count > this.max || count <= 0) {
          alert(`Количество акций должно быть меньше ${this.max + 1} и больше 0`);
      } else if ( this.type === 'buy') {
        if( this.userBalance < (this.price * count)) {
          alert("Недостаточно средств для покупки")
        } else {
            this.$emit('onBuy', {
              count,
              stockId: this.stockId
            })
            this.open = false
        }
      } else {
          this.$emit("onSell", {
            count,
            stockId: this.stockId,
            price: this.price,})
          this.open = false
      }
    }
  }
</script>