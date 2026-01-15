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
              <LegacyReportForm
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

              <div class="rounded-borders">
                <div class="text-subtitle1 text-bold q-mb-sm">
                  Saldos a inicios del periodo
                </div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-sm-6">
                    <div class="text-caption text-weight-bold">Periodo</div>
                    <div>
                      {{ formatMoney(headerBalances.initial.period) }}
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="text-caption text-weight-bold">Comparativo</div>
                    <div>
                      {{ formatMoney(headerBalances.initial.comparative) }}
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-my-md" />

              <div class="column q-gutter-lg">
                <div v-for="table in sectionTables" :key="table.title">
                  <template v-if="table.rows && table.rows.length">
                    <div class="q-mb-sm text-weight-bold text-subtitle1">
                      {{ table.title }}
                    </div>

                    <q-card flat bordered class="q-pa-sm q-mb-md rounded-wrap">
                      <TableList
                        :loading="tableProps.loading"
                        :columns="table.columns"
                        :rows="table.rows"
                        row-key="id"
                        :customColumns="[]"
                        :hidePagination="true"
                        :hideBottom="true"
                      />
                    </q-card>
                  </template>
                </div>
              </div>

              <div class="rounded-borders">
                <div class="text-subtitle1 text-bold q-mb-sm">
                  Saldos al final del periodo
                </div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-sm-6">
                    <div class="text-caption text-weight-bold">
                      Total periodo
                    </div>
                    <div>
                      {{ formatMoney(headerBalances.final.period) }}
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="text-caption text-weight-bold">
                      Total comparativo
                    </div>
                    <div>
                      {{ formatMoney(headerBalances.final.comparative) }}
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-my-md" />
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
import useLegacyReportCreate from './LegacyReportCreate'
import { ref } from 'vue'
import { OpeningRecordFormExpose } from '@/interfaces/customs'
import LegacyReportForm from '@/components/Forms/Accounting/AccoutingReport/LegacyStatus/LegacyReportForm.vue'
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
  headerBalances,
} = useLegacyReportCreate(openingRecordForm)
</script>

<style scoped lang="scss">
.rounded-wrap {
  border-radius: 12px;
  overflow: hidden;
}

.rounded-borders {
  margin-top: 24px;
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
