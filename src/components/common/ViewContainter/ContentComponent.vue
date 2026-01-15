<script lang="ts" setup>
import { useContentComponent } from '@/components/common/ViewContainter/ContentComponent'
import HeaderComponent from '@/components/common/Header/HeaderComponent.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    breadcrumbs: {
      label: string
      route?: string
    }[]
    btnLabel?: string
    btnSize?: string
    btnClass?: string
    btnIcon?: string
    btnDisable?: boolean
    btnOutline?: boolean
    btnColor?: string
    btnTextColor?: string
    indentation?: boolean
    contentIndentation?: boolean
    showBackBtn?: boolean
    btnOptions?: { label: string; route: string }[]
    imgIcon?: string
  }>(),
  {
    btnSize: 'md',
    btnClass: 'btn-header',
    btnIcon: undefined,
    btnDisable: false,
    btnOutline: false,
    btnColor: 'primary',
    btnTextColor: 'white',
    indentation: false,
  }
)

const emits = defineEmits(['to', 'onBack', 'btnSelect'])

const { to } = useContentComponent(emits)
</script>

<template>
  <main>
    <HeaderComponent
      v-bind="props"
      @to="to"
      :backBtn="showBackBtn"
      @onBack="() => emits('onBack')"
      @btnSelect="(option: any) => emits('btnSelect', option)"
    >
      <template #addBefore>
        <slot name="addBefore"></slot>
      </template>
      <template #addAfter>
        <slot name="addAfter"></slot>
      </template>
    </HeaderComponent>

    <div :class="contentIndentation ? 'q-ml-sm' : ''">
      <slot></slot>
    </div>
  </main>
</template>
<style lang="scss" src="./ContentComponent.scss" scoped />
