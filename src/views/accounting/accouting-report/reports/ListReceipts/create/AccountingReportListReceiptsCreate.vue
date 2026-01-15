<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'AccoutingReportList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-show="tabActive === 'information'"
              ref="informationFormRef"
              :action="'create'"
            />
            <TableList
              v-show="tabActive === 'receipt'"
              ref="receiptFormRef"
              :title="tableReceiptProps.title"
              :loading="tableReceiptProps.loading"
              :columns="tableReceiptProps.columns"
              :rows="tableReceiptProps.rows"
              :pages="tableReceiptProps.pages"
              :custom-columns="['status', 'actions']"
              :selection="'multiple'"
              @selected="selectAllRows"
              @update-page="updatePage"
              @update-rows-per-page="updateRows"
              class="q-py-md q-px-md"
            >
              <template #status="{ row }">
                <ShowStatus :type="Number(row.status_id ?? 1)" />
              </template>

              <template #actions="{ row }">
                <Button
                  v-if="row.id"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  left-icon="Download"
                  @click="onGenerateIndividual(row.id)"
                />
              </template>
            </TableList>
            <template v-if="tabActive === 'receipt'">
              <section class="mx-4 mb-4 row justify-between">
                <div class="row justify-end q-gutter-md">
                  <p class="text-weight-medium mb-0 text-black-10">
                    Descarga masiva*
                  </p>
                </div>
                <div class="row justify-end q-gutter-md">
                  <RadioYesNo
                    :modelValue="downloadType"
                    @update:modelValue="
                    (val:number) => (downloadType = val)
                  "
                    :options="[
                      { label: 'Excel', value: 1 },
                      { label: 'Pdf', value: 2 },
                      { label: 'Ambos', value: '3' },
                    ]"
                  />
                </div>
              </section>
            </template>

            <section class="mx-4 mb-4">
              <q-separator class="q-mb-md" />

              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="tabActiveIdx > 0"
                  label="Atrás"
                  size="md"
                  unelevated
                  :outline="true"
                  color="grey-7"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="tabActiveIdx < tabs.length - 1"
                  label="Continuar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onListingReport"
                />

                <Button
                  v-if="tabActiveIdx === tabs.length - 1"
                  label="Generar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onGenerate"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/Accounting/AccountingReportListReceipts/Information/InformationForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useAccountingReportListReceiptsCreate from '@/views/accounting/accouting-report/reports/ListReceipts/create/AccountingReportListReceiptsCreate'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

const {
  informationFormRef,
  tableReceiptProps,
  receiptFormRef,
  downloadType,
  tabActiveIdx,
  headerProps,
  tabActive,
  tabs,
  onGenerateIndividual,
  onListingReport,
  onGenerate,
  updatePage,
  updateRows,
  backTab,
  selectAllRows,
} = useAccountingReportListReceiptsCreate()
</script>
