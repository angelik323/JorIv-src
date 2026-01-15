<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToBack"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <InformationForm
          v-show="tabActive === 'information'"
          ref="informationFormRef"
          :action="'view'"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <TableList
                :title="tableValidOperationsProps.title"
                :loading="tableValidOperationsProps.loading"
                :rows="tableValidOperationsProps.rows"
                :columns="tableValidOperationsProps.columns"
                :pages="tableValidOperationsProps.pages"
                :custom-columns="['status']"
                @update-page="updatePageValidOperations"
                @update-rows-per-page="updatePerPageValidOperations"
              >
                <template #custom-header-action>
                  <q-btn
                    outline
                    unelevated
                    class="text-capitalize btn-filter custom"
                    size="100%"
                    color="orange"
                    :tooltip="'Descargar excel'"
                    :disable="tableValidOperationsProps.rows.length === 0"
                    @click="exportExcel"
                  >
                    <div class="text-black flex align-center">
                      <img
                        class="image-excel q-mr-sm"
                        src="@/assets/images/excel.svg"
                        alt="Excel Icon"
                      />
                      Descargar excel
                    </div>
                  </q-btn>
                </template>

                <template #status="{ row }">
                  <ShowStatus
                    :type="row.status?.id ?? ''"
                    statusType="ficsBulkUpload"
                  />
                </template>
              </TableList>
            </section>
          </template>
        </VCard>

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <TableList
                :title="tableOpePercentProps.title"
                :loading="tableOpePercentProps.loading"
                :rows="tableOpePercentProps.rows"
                :pages="tableOpePercentProps.pages"
                :columns="tableOpePercentProps.columns"
                :custom-columns="['status']"
                @update-page="updatePageOpePercent"
                @update-rows-per-page="updatePerPageOpePercent"
              >
                <template #status="{ row }">
                  <ShowStatus
                    :type="row.status.id ? Number(row.status.id) : 0"
                    statusType="ficsBulkUpload"
                  />
                </template>
              </TableList>
            </section>

            <section class="mx-1 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleGoToBack"
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
import InformationForm from '@/components/Forms/Fics/BulkUpload/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useBulkUploadView from '@/views/fics/bulk-upload/v1/view/BulkUploadView'

const {
  tabs,
  tabActive,
  headerProps,
  exportExcel,
  tabActiveIdx,
  handleGoToBack,
  informationFormRef,
  updatePageOpePercent,
  tableOpePercentProps,
  updatePerPageOpePercent,
  updatePageValidOperations,
  tableValidOperationsProps,
  updatePerPageValidOperations,
} = useBulkUploadView()
</script>
