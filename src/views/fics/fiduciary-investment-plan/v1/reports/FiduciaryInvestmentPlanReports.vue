<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      show-back-btn
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="goToURL('FiduciaryInvestmentPlanList')"
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="activeTab"
          :tab-active-idx="activeTabIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-mx-lg q-my-lg">
              <section class="row justify-between items-center">
                <p class="text-weigth-medium no-margin">Reporte</p>

                <RadioYesNo
                  :model-value="selectedReportOption"
                  :options="fics_fiduciary_investment_plans_report_options"
                  @update:model-value="selectedReportOption = $event"
                />
              </section>

              <section class="q-mt-md" v-if="selectedReportOption">
                <q-separator class="q-my-md q-mb-lg" />

                <CanceledPlansList
                  v-if="selectedReportOption === 'canceled_plans'"
                />

                <OpenPlansList v-if="selectedReportOption === 'open_plans'" />
              </section>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import CanceledPlansList from '@/components/Lists/Fics/FiduciaryInvestmentPlan/v1/Reports/CanceledPlans/CanceledPlansList.vue'
import OpenPlansList from '@/components/Lists/Fics/FiduciaryInvestmentPlan/v1/Reports/OpenPlans/OpenPlansList.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useFiduciaryInvestmentPlansReports from '@/views/fics/fiduciary-investment-plan/v1/reports/FiduciaryInvestmentPlanReports'

const {
  tabs,
  goToURL,
  activeTab,
  headerProps,
  activeTabIdx,
  selectedReportOption,
  fics_fiduciary_investment_plans_report_options,
} = useFiduciaryInvestmentPlansReports()
</script>
