<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'OperationalETFList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <OperationalETFForm
                ref="OperationalETFFormRef"
                :action="'edit'"
                :id="OperationalETFId"
                :has-loaded-data="hasLoadedData"
              />
            </div>
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
import OperationalETFForm from '@/components/Forms/InvestmentPortfolio/OperationalETF/InformationForm.vue'

import useOperationalETFEdit from '@/views/investment-portfolio/operational-etf/v1/edit/OperationalETFEdit'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  OperationalETFFormRef,
  OperationalETFId,
  hasLoadedData,
  onSubmit,
} = useOperationalETFEdit()
</script>
