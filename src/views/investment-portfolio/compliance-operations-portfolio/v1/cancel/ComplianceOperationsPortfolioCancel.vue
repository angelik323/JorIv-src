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
        />
        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-md q-pt-lg">
              <section>
                <BasicData
                  ref="basicDataFormRef"
                  v-if="tabActive === 'basic_data'"
                  action="cancel"
                />
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import BasicData from '@/components/Forms/InvestmentPortfolio/ComplianceOperationsPortfolio/BasicData/BasicData.vue'
import useComplianceOperationsPortfolioCancel from '@/views/investment-portfolio/compliance-operations-portfolio/v1/cancel/ComplianceOperationsPortfolioCancel'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  goToURL,
} = useComplianceOperationsPortfolioCancel()
</script>
