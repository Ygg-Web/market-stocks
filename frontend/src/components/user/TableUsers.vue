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
export default class TableUsers extends Vue {
  @Prop(Array) users!: []
  headers: any[] = [
    { text: 'Акция', value: 'name', width: '20%', sortable: false, align: 'center' },
    { text: 'Количество', value: 'login', width: '20%', sortable: false, align: 'center' },
    { text: 'Цена', value: 'balance', width: '20%', sortable: false, align: 'center' },
    { text: 'Доходность(↑↓)', value: 'profit', width: '20%', sortable: false, align: 'center' },
    { text: '', value: 'stocks', width: '20%', sortable: false, align: 'center' },
  ];
}
</script>
<style scoped>
.tableData {
  width: 800px;
  margin: 0 auto;
}
.tableData ::v-deep .v-data-table-header th {
  font-size: 16px;
  height: 30px;
}
.tableData ::v-deep .v-data-table-header th span {
  font-size: 16px;
  font-weight: normal;
  color: #333;
}
.tableData ::v-deep tr.v-data-table__selected {
  background: #b3d7ed !important;
}
.tableData ::v-deep .v-data-table tbody tr td {
  font-size: 16px;
  cursor: pointer;
  height: 30px;
}
.tableData ::v-deep .primary--text:not(.v-label) {
  color: #bfbfbf !important;
}
.tableData ::v-deep .v-data-table table tr.active {
  background: #b3d7ed !important;
  font-weight: normal;
}
.tableData ::v-deep .v-data-table table tr {
  border-bottom:  none;
}
</style>