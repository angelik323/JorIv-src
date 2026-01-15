<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue'

const emits = defineEmits(['update:tabActive'])

const props = defineProps({
  tabActive: {
    type: String,
    required: true,
  },
  tabs: {
    type: Array as PropType<object[]>,
    required: true,
  },
  tabActiveIdx: {
    type: [Number, String],
    required: false,
  },
  disable: {
    type: Boolean,
    required: false,
  },
})

const tabsRemotes = ref()
const tabActiveRemote = ref('')

onMounted(() => {
  tabsRemotes.value = [...props.tabs]
  tabActiveRemote.value = props.tabActive
})

watch(tabActiveRemote, (val) => {
  emits('update:tabActive', val)
})

watch(
  () => props.tabActive,
  (val) => {
    tabActiveRemote.value = val
  }
)
</script>
<template>
  <q-tabs
    v-model="tabActiveRemote"
    indicator-color="transparent"
    active-color="white"
    active-bg-color="primary"
    class="text-grey-5 q-gutter-md"
    align="left"
    outside-arrows
    no-caps
    dense
  >
    <q-tab
      v-for="(tab, i) in tabsRemotes"
      :key="i"
      :style="{ display: tab.show ? '' : 'none' }"
      :name="tab.name"
      :label="tab.label"
      :disable="disable || tab.disable"
      class="mr-2"
    />
  </q-tabs>
</template>
<style lang="scss" scoped>
.q-tabs--dense .q-tab {
  border-radius: 10px 10px 0px 0px;
}
.q-tab--inactive {
  background: #e8eaf6 !important;
  color: #1f2654;
}
</style>
