<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <template #addBefore>
        <Button
          label="Estructura de cargue"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          color-icon="white"
          :outline="false"
          tooltip="Opciones"
          class="btn-header"
          :dropdown-options="bulk_upload_options['button']"
        />
      </template>

      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <BulkUploadForm ref="bulkUploadFormRef" />
          </template>
        </VCard>

        <div
          v-if="bulkUploadStatus !== 73"
          class="row items-center justify-between"
        >
          <div class="col-12 col-md-6">
            <h2 class="text-h5 text-weight-medium">
              {{ tableProperties.title }}
            </h2>
          </div>

          <div class="col-12 col-md-6 text-right">
            <q-radio
              v-for="option in bulk_upload_options['table']"
              :key="option.value"
              v-model="selectedType"
              :val="option.value"
              :label="option.label"
              color="orange"
            />
          </div>

          <div class="col-12">
            <TableList
              :loading="tableProperties.loading"
              :columns="tableProperties.columns"
              :pages="tableProperties.pages"
              :rows="tableProperties.rows"
              :custom-columns="[
                'status',
                'actions',
                'bank_name',
                'account_name',
                'movement_code',
                'nature',
                'total_value_formatted',
                'beneficiary_nit',
              ]"
              @update-page="handleUpdatePage"
              @update-rows-per-page="handleUpdatePerPage"
            >
              <template #status="{ row }">
                <ShowStatus
                  :type="Number(row?.status?.id ?? 1)"
                  :clickable="false"
                />
              </template>

              <template #bank_name="{ row }">
                <SubReceiptCell
                  v-if="row.record_data?.origin && row.record_data?.destination"
                  :items="[row.record_data.origin, row.record_data.destination]"
                >
                  <template #default="{ element }">
                    {{ element?.bank.name ?? '' }}
                  </template>
                </SubReceiptCell>
                <p class="mb-0" v-else>
                  {{ row.record_data?.bank?.name ?? '-' }}
                </p>
              </template>

              <template #account_name="{ row }">
                <SubReceiptCell
                  v-if="row.record_data?.origin && row.record_data?.destination"
                  :items="[row.record_data.origin, row.record_data.destination]"
                >
                  <template #default="{ element }">
                    {{ element?.bank_account.account_name ?? '' }}
                  </template>
                </SubReceiptCell>
                <p class="mb-0" v-else>
                  {{ row.record_data?.bank_account?.account_name ?? '-' }}
                </p>
              </template>

              <template #movement_code="{ row }">
                <SubReceiptCell
                  v-if="row.record_data?.origin && row.record_data?.destination"
                  :items="[row.record_data.origin, row.record_data.destination]"
                >
                  <template #default="{ element }">
                    {{ element?.movement.code ?? '' }}
                  </template>
                </SubReceiptCell>
                <p class="mb-0" v-else>
                  {{ row.record_data?.movement?.code ?? '-' }}
                </p>
              </template>

              <template #nature="{ row }">
                <SubReceiptCell
                  v-if="row.record_data?.origin && row.record_data?.destination"
                  :items="[row.record_data.origin, row.record_data.destination]"
                >
                  <template #default="{ element }">
                    {{ element?.movement.nature ?? '' }}
                  </template>
                </SubReceiptCell>
                <p class="mb-0" v-else>
                  {{ row.record_data?.movement?.nature ?? '-' }}
                </p>
              </template>

              <template #beneficiary_nit="{ row }">
                <SubReceiptCell
                  v-if="row.record_data?.origin && row.record_data?.destination"
                  :items="[row.record_data.origin, row.record_data.destination]"
                >
                  <template #default="{ element }">
                    {{
                      `${element?.beneficiary?.identification_number ?? ''} - ${
                        element?.beneficiary?.name ?? ''
                      }`
                    }}
                  </template>
                </SubReceiptCell>
                <p class="mb-0" v-else>
                  {{
                    `${
                      row.record_data?.beneficiary?.identification_number ?? ''
                    } - ${row.record_data?.beneficiary?.name ?? ''}`
                  }}
                </p>
              </template>

              <template #total_value_formatted="{ row }">
                <SubReceiptCell
                  v-if="row.record_data?.origin && row.record_data?.destination"
                  :items="[row.record_data.origin, row.record_data.destination]"
                >
                  <template #default="{ element }">
                    {{ element?.values.value_formatted ?? '' }}
                  </template>
                </SubReceiptCell>
                <p class="mb-0" v-else>
                  {{ row.record_data?.values?.detail_value_formatted ?? '-' }}
                </p>
              </template>

              <template #actions="{ row }">
                <Button
                  :left-icon="defaultIconsLucide.eye"
                  color-icon="#f45100"
                  :class-custom="'custom'"
                  :outline="false"
                  flat
                  tooltip="Ver"
                  :disabled="row.status.id === 30"
                  @click="handleGoTo('BulkUploadView', row.id)"
                />
              </template>
            </TableList>
          </div>
        </div>

        <section class="mx-1 my-2">
          <div class="row justify-end q-gutter-md">
            <Button
              :outline="false"
              label="Log de errores"
              :disabled="!bulkUploadId || bulkUploadStatus === 73"
              class="text-capitalize btn-filter"
              @click="handleDownloadErrorsLog(bulkUploadId)"
            />

            <Button
              :outline="false"
              label="Eliminar cargue"
              color="orange"
              :disabled="!bulkUploadId"
              class="text-capitalize btn-filter custom"
              @click="handleDeleteBulkUpload(bulkUploadId)"
            />
          </div>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import SubReceiptCell from '@/components/common/SubReceiptCell/SubReceiptCell.vue'
import BulkUploadForm from '@/components/Forms/Treasury/BulkUpload/BulkUploadForm/BulkUploadForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useBulkUploadCreate from '@/views/treasury/bulk-upload/v1/create/BulkUploadCreate'

const {
  tabs,
  tabActive,
  handleGoTo,
  tabActiveIdx,
  bulkUploadId,
  selectedType,
  tableProperties,
  headerProperties,
  handleUpdatePage,
  bulkUploadStatus,
  bulkUploadFormRef,
  defaultIconsLucide,
  bulk_upload_options,
  handleUpdatePerPage,
  handleDeleteBulkUpload,
  handleDownloadErrorsLog,
} = useBulkUploadCreate()
</script>
