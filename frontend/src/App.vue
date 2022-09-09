<template>
  <v-app>
    <div id="app">
        <router-view />
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