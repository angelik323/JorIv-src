<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="showBackButton"
      @on-back="$emit('back')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-pa-lg">
              <slot name="form"></slot>

              <div class="row justify-end q-gutter-md">
                <Button
                  :label="buttonLabel"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$emit('submit')"
                />
              </div>
            </div>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IHeaderProps } from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

withDefaults(
  defineProps<{
    headerProps: IHeaderProps
    tabs: ITabs[]
    tabActive: string
    tabActiveIdx: number
    buttonLabel: string
    showBackButton?: boolean
  }>(),
  {
    showBackButton: true
  }
)

defineEmits<{
  submit: []
  back: []
}>()
</script>
