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
              <CostCenterForm
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
                :rows="rows"
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
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useGoToUrl } from '@/composables/useGoToUrl'
import useCostCenterCreate from './CostCenterCreate'
import { ref } from 'vue'
import { OpeningRecordFormExpose } from '@/interfaces/customs'
import CostCenterForm from '@/components/Forms/Accounting/AccoutingReport/CostCenter/CostCenterForm.vue'
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
  rows,
} = useCostCenterCreate(openingRecordForm)
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
