<script setup lang="ts">
import { ITabs } from '@/interfaces/customs/Tab'
import { ref, onMounted, watch } from 'vue'
import Icon from '@/components/common/Icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    tabActive: string
    tabs: ITabs[]
    tabActiveIdx: number
    disable?: boolean
  }>(),
  {
    disable: false,
  }
)
const emit = defineEmits(['update:tabActive', 'update:tabActiveIdx'])

const tabsRemotes = ref<ITabs[]>([])
const tabActiveRemote = ref('')

const className = (tab: ITabs) => {
  let className = 'p-3'
  className +=
    tab.name === props.tabActive ? ' selected-tab' : ' no-selected-tab'
  className += tab.required ? ' required-tab' : ' not-required-tab'
  return className
}

const updateTab = (tab: ITabs, idx: number) => {
  emit('update:tabActive', tab.name)
  emit('update:tabActiveIdx', idx)

  tabsRemotes.value = tabsRemotes.value.map((item) => ({
    ...item,
    outlined: true,
  }))

  tabsRemotes.value = tabsRemotes.value.map((item, i) => ({
    ...item,
    outlined: i >= idx,
  }))
}

const setTabs = () => {
  tabsRemotes.value = [...props.tabs]
  tabActiveRemote.value = props.tabActive
}

watch(
  () => props.tabActiveIdx,
  (val) => {
    if (tabsRemotes.value[val]) {
      tabsRemotes.value = tabsRemotes.value.map((item, i) => ({
        ...item,
        outlined: i >= val,
      }))
    }
  }
)

watch(
  () => props.tabs,
  () => setTabs(),
  { deep: true }
)

onMounted(() => {
  setTabs()
})
</script>

<template>
  <div
    class="row no-wrap q-pb-sm tabs-custom-v3 horizontal-scrollable no-printed"
  >
    <q-chip
      v-for="(tab, i) in tabsRemotes"
      :id="tab.name"
      :key="i"
      :name="tab.name"
      :disable="disable || tab.disable"
      :color="!tab.outlined ? 'orange-1' : 'orange-10'"
      :text-color="!tab.outlined ? 'orange-10' : 'white'"
      :class="className(tab)"
      square
      clickable
      :style="{ display: tab.show ? '' : 'none' }"
      :outline="tab.outlined"
      :aria-label="tab.name"
      :aria-disabled="tab.disable ? 'true' : 'false'"
      @click="updateTab(tab, i)"
    >
      <template #default>
        <Icon
          :name="tab.icon"
          :size="18"
          :color="tab.name === props.tabActive ? '#762344' : '#757575'"
          aria-hidden="true"
        />

        <p class="q-mx-xs mb-0">
          {{ tab.label }}<span v-if="tab.required" aria-hidden="true">*</span>
        </p>
      </template>
    </q-chip>
  </div>
</template>

<style lang="scss" src="./TabsComponent.scss" scoped />
