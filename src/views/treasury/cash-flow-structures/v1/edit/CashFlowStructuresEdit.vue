<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('CashFlowStructuresList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <FormCashFlowStructures
              v-if="activeTab === 'basic_data'"
              action="edit"
              :data="cash_flow_structures_request"
            />
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Actualizar"
                  size="md"
                  color="orange"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FormCashFlowStructures from '@/components/Forms/Treasury/CashFlowStructures/BasicData/BasicDataForm.vue'

import useCashFlowStructuresEdit from './CashFlowStructuresEdit'

const {
  cash_flow_structures_request,
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  handlerGoTo,
  onSubmit,
} = useCashFlowStructuresEdit()
</script>
