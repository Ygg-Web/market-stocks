<template>
  <v-app>
    <div id="app">
      <v-container>
        <router-view />
      </v-container>
    </div>
  </v-app>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from 'vue-property-decorator';

  @Component
  export default class extends Vue {}
</script>