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
              <GBTOtherCurrenciesForm
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
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              >
                <template #custom-bottom-row>
                  <tr class="bg-grey-3 text-bold">
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td class="text-right">
                      {{
                        useUtils().formatCurrencyString(
                          tableTotals.initial_balance
                        )
                      }}
                    </td>
                    <td class="text-right">
                      {{ useUtils().formatCurrencyString(tableTotals.debit) }}
                    </td>
                    <td class="text-right">
                      {{ useUtils().formatCurrencyString(tableTotals.credit) }}
                    </td>
                    <td class="text-right">
                      {{ useUtils().formatCurrencyString(tableTotals.total) }}
                    </td>
                  </tr>
                </template>
              </TableList>

              <section class="q-mt-md">
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
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import GBTOtherCurrenciesForm from '@/components/Forms/Accounting/AccoutingReport/GBTOtherCurrencies/GBTOtherCurrenciesForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables'
import { OpeningRecordFormExpose } from '@/interfaces/customs'
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'
import { ref } from 'vue'
import useBGPOtherCurrenciesCreate from './BGPOtherCurrenciesCreate'

const { goToURL } = useGoToUrl()
const openingRecordForm = ref<OpeningRecordFormExpose | null>(null)
const {
  headerOpeningRecord,
  tabs,
  activeTab,
  activeTabIdx,
  isFormValid,
  tableProps,
  tableTotals,
  showPreviewTab,
  downloadExcel,
  downloadPdf,
  updatePage,
  updatePerPage,
} = useBGPOtherCurrenciesCreate(openingRecordForm)
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
