<template>
  <div class="tableData">
    <v-data-table
        hide-default-footer
        disable-pagination
        :headers='headers'
        :items='users'
        item-key='id'
        mobile-breakpoint='0'
        single-select
    >
      <template v-slot:[`item.balance`]='{ item }'><span>{{item.balance}} $</span></template>
      <template v-slot:[`item.profit`]='{ item }'><span>{{item.profit || '...'}} $</span></template>
      <template v-slot:[`item.stocks`]='{ item }'><span>{{item.stocks}}</span></template>
      <template v-slot:[`item.stocks`]='{ item }'>
        <div v-for='stock in item.stocks.filter(stock => stock.count > 0)'>{{stock.name}}: {{stock.count}} шт.</div>
      </template>
    </v-data-table>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TableAdmin extends Vue {
  @Prop(Array) users!: []
  headers: any[] = [
    { text: 'Брокер', value: 'name', width: '20%', sortable: false, align: 'center' },
    { text: 'Логин', value: 'login', width: '20%', sortable: false, align: 'center' },
    { text: 'Баланс', value: 'balance', width: '20%', sortable: false, align: 'center' },
    { text: 'Доходность(↑↓)', value: 'profit', width: '20%', sortable: false, align: 'center' },
    { text: 'Акции', value: 'stocks', width: '20%', sortable: false, align: 'center' },
  ];
}
</script>
<style scoped>
.tableData {
  width: 800px;
  margin: 0 auto;
}
</style>