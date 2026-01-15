<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                action="create"
                name-report="Libro mayor y balances"
                type-report="Libros oficiales"
              />

              <ReportForm
                v-show="tabActive === 'report'"
                :reportResult="reportResult"
                :filtersFormat="filtersFormat"
                :reportFilters="reportFilters"
                :reportModels="reportModels"
              />
            </div>
          </template>
        </VCard>

        <div class="row justify-end q-mb-lg">
          <Button
            :outline="false"
            class-custom="custom"
            color="orange"
            :label="tabActive === 'report' ? 'Finalizar' : 'Generar'"
            size="md"
            @click="
              tabActive === 'report' ? handleGoToList() : handleSubmitForm()
            "
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/Accounting/AccoutingReport/v2/AccountingReportForm/InformationForm/InformationForm.vue'
import ReportForm from '@/components/Forms/Accounting/AccoutingReport/v2/AccountingReportForm/ReportForm/ReportForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useGeneralLedgerBalancesCreate from '@/views/accounting/accouting-report/v2/reports/GeneraLedgerBalances/create/GeneralLedgerBalancesCreate'

const {
  tabActive,
  headerProps,
  filteredTabs,
  tabActiveIdx,
  reportResult,
  reportModels,
  filtersFormat,
  reportFilters,
  handleGoToList,
  handleSubmitForm,
  informationFormRef,
} = useGeneralLedgerBalancesCreate()
</script>
