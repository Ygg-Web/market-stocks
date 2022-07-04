<template>
  <v-data-iterator :items="stocks" hide-default-footer>
    <template>
      <v-row>
        <v-col v-for="stock in stocks" :key="stock.id" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-card>
            <v-card-title class="subheading font-weight-bold flex-column">
              {{ stock.name }}
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-item v-for="(field, index) in filteredFieldNames" :key="index">
                <v-list-item-content >
                  {{ fields(field) }}
                </v-list-item-content>
                <v-list-item-content class="align-end justify-center">
                  {{ stock[field] }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-card-actions class="pa-5">
              <DialogStocks v-if="type === 'sell'" @onSell="$emit('onSell', $event)" :max="stock.count"
                :stockId="stock.id" :price="stock.price" :type="type" />
              <v-layout v-else-if="type === 'buy'" align-center justify-center column class="mb-3">
                <DialogStocks  @onBuy="$emit('onBuy', $event)" :max="stock.count"
                :stockId="stock.id" :price="stock.price" :type="type" :userBalance="userBalance" />
                <DialogGrafic :historyPrice="stock.historyPrice" :historyTime="stock.historyTime"/>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
  import { IStock } from "@/types";
  import { Component, Prop, Vue } from "vue-property-decorator";
  import DialogStocks from "./DialogStocks.vue";
  import DialogGrafic from "./DialogGrafic.vue";

  @Component({
    components: {
      DialogStocks,
      DialogGrafic
    },
  })
  export default class extends Vue {
    @Prop(Array) stocks!: IStock[];
    @Prop(Number) userBalance!: number;
    @Prop(String) type!: string;
    @Prop(Function) onSell!: void;
    @Prop(Function) onBuy!: void;
    
    filedNames: string[] = ["name", "count", "price"];

    mounted() {
      this.type === "sell" && this.filedNames.push("profit");
    }

    fields(field: string): string | void {
      switch (field) {
        case "name":
          return " ";
        case "count":
          return "Количество";
        case "price":
          return "Цена $";
        case "profit":
          return "Прибыль(↑↓) ";
      }
    } 
            
    get filteredFieldNames(): string[] {
      return this.filedNames.filter((field) => field !== "name");
    }
  }
</script>