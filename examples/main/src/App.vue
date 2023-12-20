<script setup lang="ts">
function routeTo(app: string) {
  history.pushState({}, '', location.origin + app);
}
</script>

<template>
  <div>Vue App</div>
  <button @click="routeTo('/app1')">app1</button>
  <button @click="routeTo('/app2')">app2</button>

  <main id="__flatpad_root__"></main>
</template>
