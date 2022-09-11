<template>
  <v-data-table
      hide-default-footer
      disable-pagination
      :headers='headers'
      :items='stocks'
      item-key='id'
      mobile-breakpoint='0'
      single-select
  >
    <template v-slot:[`item.button`] = '{item}'>
      <dialog-stocks
          v-if='type === "sell"'
          @onSell='$emit("onSell", $event)'
          :max='item.count'
          :stockId='item.id'
          :price='item.price'
          :type='type'
      ></dialog-stocks>
      <div v-else-if='type === "buy"' class='buy'>
        <dialog-stocks
            @onBuy='$emit("onBuy", $event)'
            :max='item.count'
            :stockId='item.id'
            :price='item.price'
            :type='type'
            :userBalance='userBalance'
        ></dialog-stocks>
        <dialog-grafic
            :historyPrice='item.historyPrice'
            :historyTime='item.historyTime'
        ></dialog-grafic>
      </div>
    </template>
  </v-data-table>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import DialogStocks from './DialogStocks.vue'
import DialogGrafic from './DialogGrafic.vue'
import { IStock } from '@/types'

@Component({
  components: {
    'dialog-stocks': DialogStocks,
    'dialog-grafic': DialogGrafic,
  },
})
export default class TableUsers extends Vue {
  @Prop(Array) stocks!: IStock[]
  @Prop(Number) userBalance!: number
  @Prop(String) type!: string
  headers: any[] = [
    { text: 'Акции', value: 'name', width: '20%', sortable: false, align: 'center' },
    { text: 'Количество', value: 'count', width: '20%', sortable: false, align: 'center' },
    { text: 'Цена $', value: 'price', width: '20%', sortable: false, align: 'center' },
    { text: '', value: 'button', width: '20%', sortable: false, align: 'center' },
  ]
  
  created(){
    this.type === 'sell' && this.headers.splice(3, 0, { text: 'Прибыль(↑↓)', value: 'profit', width: '20%', sortable: false, align: 'center' })
  }
}
</script>
<style>
  .buy{
    width: 150px;
    display: flex;
    align-items: center;
  }
 .buy .v-btn{
    width: 80px;
  }
</style>