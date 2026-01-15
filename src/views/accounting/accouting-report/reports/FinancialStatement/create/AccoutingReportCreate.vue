<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerOpeningRecord.title"
      :breadcrumbs="headerOpeningRecord.breadcrumbs"
      :show-back-btn="headerOpeningRecord.showBackBtn"
      @on-back="goToURL('AccoutingReportList')"
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
            <div v-if="activeTab === 'basic_data'">
              <AccoutingReportForm
                ref="openingReportForm"
                action="create"
                @valid="isFormValid = $event"
                @enable-preview-tab="showPreviewTab"
              />
            </div>
            <div v-if="activeTab === 'preview'" class="q-pa-md">
              <div class="row items-center justify-between q-ma-md">
                <p class="text-subtitle1 text-bold q-mb-none">Reporte</p>

                <div class="row q-gutter-sm">
                  <Button
                    :outline="true"
                    label="Descargar PDF"
                    :leftImg="pdfIcon"
                    tooltip="Descargar PDF"
                    @click="downloadPdf"
                  />
                  <Button
                    :outline="true"
                    label="Descargar Excel"
                    :leftImg="excelIcon"
                    tooltip="Descargar Excel"
                    @click="downloadExcel"
                  />
                </div>
              </div>

              <div class="mx-1 q-mt-lg q-gutter-lg">
                <div
                  v-for="table in sectionTables"
                  :key="table.title"
                  class="q-pa-none"
                >
                  <div>
                    <div class="q-mb-sm text-weight-bold text-subtitle1">
                      {{ table.title }}
                    </div>

                    <TableList
                      :loading="tableProps.loading"
                      :columns="table.columns"
                      :rows="table.rows"
                      row-key="id"
                      :customColumns="[]"
                      :hidePagination="true"
                      :hideBottom="true"
                    >
                      <template #custom-bottom-row>
                        <q-tr>
                          <q-td colspan="2" class="text-right text-weight-bold"
                            >Total</q-td
                          >
                          <q-td class="text-center">{{
                            formatMoney(table.totals.current_period)
                          }}</q-td>
                          <q-td class="text-center">{{
                            formatMoney(table.totals.previous_period)
                          }}</q-td>
                          <q-td class="text-center">{{
                            formatMoney(table.totals.variation)
                          }}</q-td>
                        </q-tr>
                      </template>
                    </TableList>
                  </div>
                </div>
              </div>
            </div>

            <section v-if="activeTab === 'preview'" class="mx-2 mb-4">
              <div class="row justify-end">
                <Button
                  :outline="false"
                  class-custom="custom"
                  color="orange"
                  label="Finalizar"
                  size="md"
                  @click="goToURL('AccoutingReportList')"
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
//Components
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AccoutingReportForm from '@/components/Forms/Accounting/AccoutingReport/FinancialStatement/AccoutingReportForm.vue'
//Assets & Composables
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

//logic
import useAccoutingReportCreate from '@/views/accounting/accouting-report/reports/FinancialStatement/create/AccoutingReportCreate'

const {
  headerOpeningRecord,
  tabs,
  activeTab,
  activeTabIdx,
  isFormValid,
  tableProps,
  sectionTables,
  showPreviewTab,
  downloadExcel,
  downloadPdf,
  formatMoney,
  goToURL,
} = useAccoutingReportCreate()
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
