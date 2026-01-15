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
              <PeriodStatementForm
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
              <TableList
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :pages="tableProps.pages"
                :rows="tableProps.rows"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              />
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
import Button from '@/components/common/Button/Button.vue'
import { useGoToUrl } from '@/composables/useGoToUrl'
import usePeriodStatementCreate from './PeriodStatementCreate'
import { ref } from 'vue'
import { OpeningRecordFormExpose } from '@/interfaces/customs'
import PeriodStatementForm from '@/components/Forms/Accounting/AccoutingReport/PeriodStatement/PeriodStatementForm.vue'
import excelIcon from '@/assets/images/excel.svg'
import TableList from '@/components/table-list/TableList.vue'
import pdfIcon from '@/assets/images/pdf.svg'
const { goToURL } = useGoToUrl()
const openingRecordForm = ref<OpeningRecordFormExpose | null>(null)
const {
  headerOpeningRecord,
  tabs,
  activeTab,
  tableProps,
  activeTabIdx,
  isFormValid,
  showPreviewTab,
  downloadExcel,
  downloadPdf,
  updatePerPage,
  updatePage,
} = usePeriodStatementCreate(openingRecordForm)
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
