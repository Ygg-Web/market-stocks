<template>
  <v-row justify="center">
    <v-dialog transition="dialog-top-transition" max-width="800">
      <template v-slot:activator="{ on, attrs }">
        <v-btn 
            color="primary" 
            v-bind="attrs"
            v-on="on" 
            max-width="170"
        >Изменение цены</v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-card-text>
            <div class="text-h2 pt-10">
              <area-chart :data="history"></area-chart>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn 
                text 
                @click="dialog.value = false" 
                color="green" dark
            >Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-row>
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