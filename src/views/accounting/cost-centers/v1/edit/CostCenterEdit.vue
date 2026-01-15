<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'CostCenterList' })"
    >
      <section class="q-my-md q-pl-lg">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'basic_data'" class="q-mt-xl q-mb-lg q-px-lg">
              <CostCenterForm ref="costCenterForm" :data="model" :action="'edit'" @update="handleFormUpdate" />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="filteredTabs.findIndex((tab) => tab.name === tabActive) === filteredTabs.length - 1"
                  :outline="false"
                  :class-custom="'custom'"
                  label="Actualizar"
                  size="md"
                  color="orange"
                  :disabled="!isValidCatalog"
                  @click="onUpdate"
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
import CostCenterForm from '@/components/Forms/Accounting/CostCenter/CostCenterForm.vue'
import useCostCenterEdit from '@/views/accounting/cost-centers/v1/edit/CostCenterEdit'

const {
  model,
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  costCenterForm,
  isValidCatalog,
  handleFormUpdate,
  onUpdate,
} = useCostCenterEdit()
</script>
