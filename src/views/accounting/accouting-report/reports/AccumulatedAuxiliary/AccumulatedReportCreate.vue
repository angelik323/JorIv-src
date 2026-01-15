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
              <AccumulatedAuxiliaryForm
                ref="openingReportForm"
                action="create"
                @valid="isFormValid = $event"
                @enable-preview-tab="showPreviewTab"
              />
            </div>
            <div v-if="activeTab === 'preview'" class="q-pa-md">
              <div class="row items-center justify-between q-mb-md q-mx-md">
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

              <div class="q-ma-md">
                <div
                  v-for="(table, i) in sectionTables"
                  :key="`${table.title}-${i}`"
                  class="q-pa-none mb-4"
                >
                  <template v-if="table.rows && table.rows.length">
                    <!-- Título de la cuenta -->
                    <div class="q-mb-sm text-weight-bold text-subtitle1">
                      {{ i + 1 }}. {{ table.title }}
                    </div>

                    <!-- Resumen de saldos de la cuenta -->
                    <div class="row q-col-gutter-md q-mb-md">
                      <div class="col-12 col-sm-6 col-md-3">
                        <div class="text-caption text-grey-7">
                          Saldo inicial
                        </div>
                        <div class="text-body1 text-weight-bold">
                          {{ formatMoney(table.header.initial_balance) }}
                        </div>
                      </div>

                      <div class="col-12 col-sm-6 col-md-3">
                        <div class="text-caption text-grey-7">Saldo final</div>
                        <div class="text-body1 text-weight-bold">
                          {{ formatMoney(table.header.final_balance) }}
                        </div>
                      </div>

                      <div class="col-12 col-sm-6 col-md-3">
                        <div class="text-caption text-grey-7">
                          Saldo inicial moneda extranjera
                        </div>
                        <div class="text-body1 text-weight-bold">
                          {{
                            formatMoney(table.header.initial_foreign_balance)
                          }}
                        </div>
                      </div>

                      <div class="col-12 col-sm-6 col-md-3">
                        <div class="text-caption text-grey-7">
                          Saldo final moneda extranjera
                        </div>
                        <div class="text-body1 text-weight-bold">
                          {{ formatMoney(table.header.final_foreign_balance) }}
                        </div>
                      </div>

                      <div class="col-12 col-sm-6 col-md-3">
                        <div class="text-caption text-grey-7">Débito</div>
                        <div class="text-body1 text-weight-bold">
                          {{ formatMoney(table.header.debit) }}
                        </div>
                      </div>

                      <div class="col-12 col-sm-6 col-md-3">
                        <div class="text-caption text-grey-7">Crédito</div>
                        <div class="text-body1 text-weight-bold">
                          {{ formatMoney(table.header.credit) }}
                        </div>
                      </div>
                    </div>

                    <section class="">
                      <!-- Tabla de movimientos -->
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
                          <q-tr class="bg-grey-2">
                            <q-td
                              :colspan="6"
                              class="text-right text-weight-bold"
                            >
                              Total
                            </q-td>
                            <q-td class="text-right text-weight-bold">
                              {{ formatMoney(table.totals.debit) }}
                            </q-td>
                            <q-td class="text-right text-weight-bold">
                              {{ formatMoney(table.totals.credit) }}
                            </q-td>
                          </q-tr>
                        </template>
                      </TableList>
                    </section>
                  </template>
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
import useAccumulatedReportCreate from './AccumulatedReportCreate'
import { ref } from 'vue'
import { OpeningRecordFormExpose } from '@/interfaces/customs'
import AccumulatedAuxiliaryForm from '@/components/Forms/Accounting/AccoutingReport/AccumulatedAuxiliary/AccumulatedAuxiliaryForm.vue'
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
} = useAccumulatedReportCreate(openingRecordForm)
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
