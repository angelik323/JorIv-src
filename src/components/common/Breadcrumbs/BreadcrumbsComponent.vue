<script lang="ts" setup>
import { PropType } from 'vue'
import Icon from '@/components/common/Icon/Icon.vue'
import { defaultIconsLucide } from '@/utils'

defineProps({
  breadcrumbs: {
    type: Array as PropType<
      {
        label: string
        route?: string
        params?: object
        id?: number
      }[]
    >,
    required: true,
  },
})
</script>

<template>
  <div class="containerBreadCums">
    <q-breadcrumbs
      class="text-orange"
      active-color="grey-7"
      :gutter="$q.screen.lt.sm ? 'xs' : 'md'"
    >
      <template #separator>
        <Icon
          class="vertical-middle"
          :name="defaultIconsLucide.next"
          :size="18"
          color="#757575"
          aria-hidden="true"
        />
      </template>

      <q-breadcrumbs-el
        v-for="(breadcrumb, index) in breadcrumbs"
        :label="breadcrumb.label"
        :to="{
          name: breadcrumb.route,
          params: breadcrumb.params ?? { id: breadcrumb.id },
        }"
        :key="index"
      />
    </q-breadcrumbs>
  </div>
</template>

<style lang="scss" src="./BreadcrumbsComponent.scss" scoped />
