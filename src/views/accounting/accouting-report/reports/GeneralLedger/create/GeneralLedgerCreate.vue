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
              <GeneralResultsForm
                ref="openingReportForm"
                action="create"
                @valid="isFormValid = $event"
                @enable-preview-tab="showPreviewTab"
              />
            </div>
            <div v-if="activeTab === 'preview'" class="q-pa-md">
              <div class="row items-center justify-between q-mb-md">
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

              <div class="column q-gutter-lg scroll-x q-ma-sm">
                <div
                  v-for="(table, i) in sectionTables"
                  :key="`${table.title}-${i}`"
                >
                  <div class="q-mb-sm text-weight-bold text-subtitle1">
                    {{ table.title }}
                  </div>

                  <div class="row q-col-gutter-md q-mb-md">
                    <div class="col-3">
                      <div class="text-weight-bold">Saldo inicial</div>
                      <div>
                        {{ formatMoney(table.header.initial_balance) }}
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="text-weight-bold">
                        Saldo inicial moneda extranjera
                      </div>
                      <div>
                        {{ formatMoney(table.header.initial_foreign_currency) }}
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="text-weight-bold">Saldo final</div>
                      <div>
                        {{ formatMoney(table.header.final_balance) }}
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="text-weight-bold">
                        Saldo final moneda extranjera
                      </div>
                      <div>
                        {{ formatMoney(table.header.final_foreign_currency) }}
                      </div>
                    </div>
                  </div>
                  <q-separator />
                  <div class="scroll-x">
                    <TableList
                      :loading="tableProps.loading"
                      :columns="table.columns"
                      :rows="table.rows"
                      row-key="id"
                      :hidePagination="true"
                      :hideBottom="true"
                    >
                      <template #custom-bottom-row>
                        <q-tr class="bg-grey-2">
                          <q-td
                            :colspan="table.columns.length - 2"
                            class="text-right text-weight-bold"
                          >
                            Totales
                          </q-td>
                          <q-td class="text-right">{{
                            formatMoney(table.totals.debit)
                          }}</q-td>
                          <q-td class="text-right">{{
                            formatMoney(table.totals.credit)
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
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useGoToUrl } from '@/composables/useGoToUrl'
import useGeneralLedgerReportCreate from './GeneralLedgerCreate'
import { ref } from 'vue'
import { OpeningRecordFormExpose } from '@/interfaces/customs'
import GeneralResultsForm from '@/components/Forms/Accounting/AccoutingReport/GeneralLedger/GeneralLedgerForm.vue'
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'
const { goToURL } = useGoToUrl()
const openingRecordForm = ref<OpeningRecordFormExpose | null>(null)
const {
  headerOpeningRecord,
  tabs,
  activeTab,
  activeTabIdx,
  isFormValid,
  showPreviewTab,
  downloadExcel,
  downloadPdf,
  tableProps,
  sectionTables,
  formatMoney,
} = useGeneralLedgerReportCreate(openingRecordForm)
</script>

<style scoped lang="scss">
.scroll-x {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
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
