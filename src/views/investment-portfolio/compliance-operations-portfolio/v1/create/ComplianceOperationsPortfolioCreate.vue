<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      @on-back="goToURL('ComplianceOperationsPortfolioList')"
      show-back-btn
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-md q-pt-lg">
              <section>
                <BasicData
                  ref="basicDataFormRef"
                  v-if="tabActive === 'basic_data'"
                  action="create"
                />
              </section>
              <section
                class="mx-1 mb-2"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="
                      tabs.findIndex((tab) => tab.name === tabActive) ===
                      tabs.length - 1
                    "
                    :outline="false"
                    label="Crear"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="onSubmit"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import BasicData from '@/components/Forms/InvestmentPortfolio/ComplianceOperationsPortfolio/BasicData/BasicData.vue'
import useComplianceOperationsPortfolioCreate from '@/views/investment-portfolio/compliance-operations-portfolio/v1/create/ComplianceOperationsPortfolioCreate'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  goToURL,
  onSubmit,
} = useComplianceOperationsPortfolioCreate()
</script>
