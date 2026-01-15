<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :rows="tableProperties.rows"
          :custom-columns="[
            'radio_button',
            'status',
            'actions',
            'bank_name',
            'account_name',
            'movement_code',
            'nature',
            'total_value_formatted',
            'beneficiary_nit',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header>
            <div
              class="row justify-between items-end q-col-gutter-x-md q-col-gutter-y-sm"
              style="width: 100%"
            >
              <div class="col-auto">
                <p class="q-table__title no-margin">
                  {{ tableProperties.title }}
                </p>
              </div>

              <div class="col-auto flex q-gutter-x-md q-gutter-y-sm">
                <q-radio
                  v-for="option in BULK_UPLOAD_OPTIONS['table']"
                  :key="option.value"
                  v-model="selectedType"
                  :val="option.value"
                  :label="option.label"
                  color="orange"
                />
              </div>
            </div>
          </template>

          <template #radio_button="{ row }">
            <q-radio
              :model-value="selectedRowId"
              :val="row.id"
              dense
              color="orange"
              @update:model-value="() => onSelectRow(row)"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus :type="row.basic_data?.status?.id ?? 55" status-type="treasury" />
          </template>

          <template #bank_name="{ row }">
            <SubReceiptCell
              v-if="row.basic_data?.origin && row.basic_data?.destination"
              :items="[row.basic_data.origin, row.basic_data.destination]"
            >
              <template #default="{ element }">
                {{ element?.bank.name ?? '' }}
              </template>
            </SubReceiptCell>
            <p class="mb-0" v-else>
              {{ row.basic_data?.bank?.name ?? '-' }}
            </p>
          </template>

          <template #account_name="{ row }">
            <SubReceiptCell
              v-if="row.basic_data?.origin && row.basic_data?.destination"
              :items="[row.basic_data.origin, row.basic_data.destination]"
            >
              <template #default="{ element }">
                {{ element?.bank_account.account_name ?? '' }}
              </template>
            </SubReceiptCell>
            <p class="mb-0" v-else>
              {{ row.basic_data?.bank_account?.account_name ?? '-' }}
            </p>
          </template>

          <template #movement_code="{ row }">
            <SubReceiptCell
              v-if="row.basic_data?.origin && row.basic_data?.destination"
              :items="[row.basic_data.origin, row.basic_data.destination]"
            >
              <template #default="{ element }">
                {{ element?.movement.code ?? '' }}
              </template>
            </SubReceiptCell>
            <p class="mb-0" v-else>
              {{ row.basic_data?.movement_code?.code ?? '-' }}
            </p>
          </template>

          <template #nature="{ row }">
            <SubReceiptCell
              v-if="row.basic_data?.origin && row.basic_data?.destination"
              :items="[row.basic_data.origin, row.basic_data.destination]"
            >
              <template #default="{ element }">
                {{ element?.movement.nature ?? '' }}
              </template>
            </SubReceiptCell>
            <p class="mb-0" v-else>
              {{ row.basic_data?.nature ?? '-' }}
            </p>
          </template>

          <template #beneficiary_nit="{ row }">
            <SubReceiptCell
              v-if="row.basic_data?.origin && row.basic_data?.destination"
              :items="[row.basic_data.origin, row.basic_data.destination]"
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
                `${row.basic_data?.beneficiary?.nit ?? ''} - ${
                  row.basic_data?.beneficiary?.name ?? ''
                }`
              }}
            </p>
          </template>

          <template #total_value_formatted="{ row }">
            <SubReceiptCell
              v-if="row.basic_data?.origin && row.basic_data?.destination"
              :items="[row.basic_data.origin, row.basic_data.destination]"
            >
              <template #default="{ element }">
                {{ element?.values.value_formatted ?? '' }}
              </template>
            </SubReceiptCell>
            <p class="mb-0" v-else>
              {{ formatCurrency(row.basic_data?.value?.local_currency) ?? '-' }}
            </p>
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL('BulkUploadView', {
                  bulkUploadId: row.bulk_upload_id,
                  recordId: row.id,
                })
              "
            />
          </template>
        </TableList>
      </section>

      <section class="q-mt-lg q-mb-xl" aria-label="Acciones">
        <div class="row justify-end q-gutter-md">
          <Button
            label="Validar errados"
            no-caps
            :outline="false"
            :disabled="isDisabled"
            @click="handleValidateErrors(selectedBulkUploadId!)"
          />

          <Button
            class="custom"
            label="Log de errores"
            color="grey"
            no-caps
            :outline="false"
            :disabled="!selectedRowId"
            @click="handleDownloadErrorsLog(selectedBulkUploadId!)"
          />

          <Button
            class="custom"
            label="Eliminar cargue"
            color="orange"
            no-caps
            outline
            :left-icon="defaultIconsLucide.trash"
            color-icon="#f45100"
            :styleContent="{
              'place-items': 'center',
              color: 'black',
            }"
            :disabled="!selectedRowId"
            @click="handleDeleteBulkUpload(selectedBulkUploadId!)"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import SubReceiptCell from '@/components/common/SubReceiptCell/SubReceiptCell.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBulkUploadHistory from '@/views/treasury/bulk-upload/v1/history/BulkUploadHistory'

const {
  BULK_UPLOAD_OPTIONS,
  defaultIconsLucide,
  selectedType,
  selectedRowId,
  selectedBulkUploadId,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  isDisabled,
  filterComponentRef,
  filterConfig,
  tableProperties,
  goToURL,
  onSelectRow,
  handleValidateErrors,
  handleDownloadErrorsLog,
  handleDeleteBulkUpload,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  formatCurrency,
} = useBulkUploadHistory()
</script>
