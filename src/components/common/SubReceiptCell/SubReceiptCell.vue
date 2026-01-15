<template>
  <table class="sub-receipt-table">
    <q-tr class="text-left" v-for="(element, index) in items">
      <q-td
        :style="{
          borderBottom:
            index === items.length - 1
              ? 'none'
              : '1px solid #e0e0e0 !important',
        }"
        class="sub-receipt-cell"
      >
        <slot name="default" :element="element"></slot>
      </q-td>
    </q-tr>
  </table>
</template>

<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
}>()
</script>
<style scoped>
* {
  border: none !important;
}
.sub-receipt-table {
  border-collapse: collapse;
  width: 100%;
}
.sub-receipt-cell {
  padding-left: 2px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  height: 40px;
  vertical-align: middle;
}
</style>
