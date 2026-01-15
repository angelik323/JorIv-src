<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addBefore>
        <div class="row q-gutter-sm">
          <Button
            v-if="
              validateRouter(
                'BusinessTrust',
                'AmortizationTablesList',
                'create'
              )
            "
            :outline="false"
            label="Crear"
            color-icon="#FFFFFF"
            :styleContent="{ 'place-items': 'center' }"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            @click="handlerResetForm"
          />
        </div>
      </template>
    </ContentComponent>

    <FiltersV2
      :fields="filterConfig"
      @filter="handlerSearchFilter"
      @clear-filters="handlerAmortizationClearFilters"
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
        <BaiscAmortizationForm action="default" />
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

import Button from '@/components/common/Button/Button.vue'

import useAmortizationTablesList from '@/views/financial-obligations/amortization-tables/V1/list/AmortizationTablesList'

const {
  headerProps,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  handlerSearchFilter,
  filterConfig,
  handlerResetForm,
  defaultIconsLucide,
  handlerAmortizationClearFilters,
  validateRouter,
} = useAmortizationTablesList()
</script>
