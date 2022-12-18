<template>
  <k-status class="version">
    Koishi v{{ store.envinfo.koishi.Core }}
    <template #tooltip>
      <div class="section" v-for="(data, key) in store.envinfo">
        <p class="title">{{ capitalize(key) }}:</p>
        <p class="info" v-for="(value, key) in data" :key="key">
          {{ key }}: {{ value }}
        </p>
      </div>
    </template>
  </k-status>
</template>

<script lang="ts" setup>

import { capitalize, store } from '@koishijs/client'

</script>

<style lang="scss" scoped>

p {
  margin: 8px;
  padding: 0 6px;
  font-size: 12px;
  line-height: 1;
}

.info {
  padding-left: 20px;
}

</style>
