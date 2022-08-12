<script setup>
import { mountApp, unmountApp } from 'flatpad';

function routeTo(app) {
  mountApp(app);
}

function unregister(name) {
  unmountApp(name);
}
</script>

<template>
  <div>Vue App</div>
  <!-- <button @click="routeTo('app1')">App1</button>
  <button @click="routeTo('app2')">App2</button>
  <button @click="routeTo('app3')">App3</button>
  <button @click="routeTo('operation')">Operation</button> -->
  <button @click="routeTo('child')">child</button>
  
  <br>

  <button @click="unregister('app1')">unregister</button>
  <main id="__flatpad_root__"></main>
</template>
