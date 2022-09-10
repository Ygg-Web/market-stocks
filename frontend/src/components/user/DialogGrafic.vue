<template>
  <div>
    <v-dialog transition="dialog-top-transition" max-width="800">
      <template v-slot:activator="{ on, attrs }">
        <v-btn 
            color='info'
            outlined
            v-bind="attrs"
            v-on="on"
            width='40px'
        ><v-icon>mdi-chart-bell-curve-cumulative</v-icon></v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card class='px-5 pt-7'>        
          <area-chart :data="history"></area-chart>         
          <v-card-actions class='justify-end px-0 pb-4'>
            <v-btn 
                outlined
                @click='dialog.value = false'
            >Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop(Array) historyPrice!: []
  @Prop(Array) historyTime!: []
  chartDate: {} = {}

  get history(): {} {
    for (let i = 0; i <= this.historyPrice.length; i++) {
      if (this.historyTime[i] && this.historyPrice[i]) {
        this.$set(this.chartDate, this.historyTime[i], this.historyPrice[i])
      }
    }
    return this.chartDate
  }
}
</script>