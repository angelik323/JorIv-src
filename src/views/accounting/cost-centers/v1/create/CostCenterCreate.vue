<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerCenterCost.title"
      :breadcrumbs="headerCenterCost.breadcrumbs"
      :show-back-btn="headerCenterCost.showBackBtn"
      @on-back="goToURL('CostCenterList')"
    >
      <section class="q-my-md q-pl-lg">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="activeTabIdx"
          @update:tab-active="activeTab = $event"
        />
        <VCard>
          <template #content-card>
            <div v-show="activeTab === 'basic_data'">
              <CostCenterForm ref="costCenterForm" action="create" />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  color="orange"
                  class-custom="custom"
                  label="Crear"
                  size="md"
                  @click="onCreate"
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
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import CostCenterForm from '@/components/Forms/Accounting/CostCenter/CostCenterForm.vue'
import { useGoToUrl } from '@/composables/useGoToUrl'
import useCostCenterCreate from '@/views/accounting/cost-centers/v1/create/CostCenterCreate'

const { goToURL } = useGoToUrl()

const {
  headerCenterCost,
  tabs,
  activeTab,
  activeTabIdx,
  costCenterForm,
  onCreate,
} = useCostCenterCreate()
</script>

<style scoped lang="scss">
.containerForm {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 40px;

  .formContent {
    width: 100%;
    border-radius: 15px;
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
