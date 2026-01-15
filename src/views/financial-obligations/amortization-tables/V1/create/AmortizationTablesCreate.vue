<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AmortizationTablesList')"
    />

    <FiltersV2
      :fields="filterConfig"
      @filter="handlerSearchFilter"
      @clear-filters="resetSetAmortizationData"
    />

    <div class="q-pt-none">
      <TabsComponent
        :tab-active="tabActive"
        :tabs="filteredTabs"
        :tab-active-idx="tabActiveIdx"
        @update:tab-active="tabActive = $event"
      />
    </div>

    <VCard>
      <template #content-card>
        <q-card-section>
          <BaiscAmortizationForm action="create" />
        </q-card-section>
      </template>
    </VCard>
  </div>
</template>

<script lang="ts" setup>
import FiltersV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import BaiscAmortizationForm from '@/components/Forms/FinancialObligations/AmortizationForms/BasicForm/AmortizationBasicForm.vue'

import useAmortizationTablesCreate from '@/views/financial-obligations/amortization-tables/V1/create/AmortizationTablesCreate'

const {
  headerProps,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  handlerSearchFilter,
  filterConfig,
  goToURL,
  resetSetAmortizationData,
} = useAmortizationTablesCreate()
</script>
