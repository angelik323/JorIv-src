<template>
  <q-form class="q-pa-lg" ref="formBulkUpload">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <div class="col-12">
        <p class="text-weight-bold text-black-90">Tipo de operación</p>
        <q-radio
          v-for="type in bulk_upload_type"
          :key="type.value"
          v-model="formData.type"
          :val="type.value"
          :label="type.label"
          color="orange"
        />
      </div>

      <div class="col-12">
        <q-separator class="q-my-md" />
      </div>

      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          :default_value="formData.id_office"
          :manual_option="selectOptions.offices"
          label="Oficina"
          map_options
          auto_complete
          :required="false"
          :rules="[]"
          @update:model-value="formData.id_office = $event"
        />
      </div>

      <div class="col-12 col-md-6">
        <GenericInputComponent
          :default_value="formData.name_office"
          label="Nombre oficina"
          placeholder="-"
          type="text"
          disabled
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericSelectorComponent
          :default_value="formData.id_business"
          :manual_option="selectOptions.business"
          label="Negocio"
          map_options
          auto_complete
          :required="false"
          :rules="[]"
          @update:model-value="formData.id_business = $event"
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericInputComponent
          :default_value="formData.name_business"
          label="Nombre negocio"
          placeholder="-"
          type="text"
          disabled
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericSelectorComponent
          :default_value="formData.id_bank"
          :manual_option="selectOptions.banks"
          label="Banco"
          map_options
          auto_complete
          :required="false"
          :rules="[]"
          :disabled="!formData.id_business"
          @update:model-value="formData.id_bank = $event"
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericInputComponent
          :default_value="formData.name_bank"
          label="Nombre banco"
          placeholder="-"
          type="text"
          disabled
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericSelectorComponent
          :default_value="formData.id_bank_account"
          :manual_option="selectOptions.bank_accounts"
          label="Cuenta bancaria"
          map_options
          auto_complete
          :required="false"
          :rules="[]"
          :disabled="!formData.id_bank"
          @update:model-value="formData.id_bank_account = $event"
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericInputComponent
          :default_value="formData.name_bank_account"
          label="Nombre cuenta bancaria"
          placeholder="-"
          type="text"
          disabled
        />
      </div>

      <div class="col-12 col-md-6">
        <GenericDateInputComponent
          :default_value="formData.date"
          label="Fecha"
          placeholder="YYYY-MM-DD"
          mask="YYYY-MM-DD"
          :required="false"
          :rules="[]"
          @update:model-value="formData.date = $event"
          :navigation_max_year="new Date().getFullYear().toString()"
          :navigation_min_year="'1000/01'"
          :option_calendar="
            ($event) => useUtils().isDateAllowed($event, holidays)
          "
          :onNavigation="handlerHolidays"
        />
      </div>
    </div>

    <div
      class="row q-my-md q-col-gutter-x-lg q-col-gutter-y-sm"
      aria-label="Sección de carga de archivos"
    >
      <div class="col-12">
        <UploadFile
          ref="attachDocumentRef"
          title="Archivo"
          labelUploadBtn="Seleccione los archivos para subir"
          stylesCustoms="width: 100%"
          :bordered="false"
          accept=".csv"
          @added="onFileAdded"
        />
      </div>

      <div class="col-12" v-if="tableProperties.rows.length > 0">
        <TableList
          hidePagination
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :custom-columns="['filename', 'status']"
        >
          <template #filename="{ row }">
            <div class="row items-center justify-start">
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/excel.svg"
                alt="Excel Icon"
              />
              {{ row.filename }}
            </div>
          </template>

          <template #status="{ row }">
            <div
              :class="row.status.id !== 20 ? 'justify-center items-center' : ''"
            >
              <div class="q-mr-md">
                <ShowStatus :type="Number(row?.status.id ?? 20)" />
              </div>

              <q-linear-progress
                v-if="row.status.id === 20"
                :value="progressValue"
                color="primary_fiduciaria"
                size="7px"
                class="progress-bar-rounded"
              />
            </div>
          </template>
        </TableList>
      </div>
    </div>

    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-lg">
      <div class="col-12 col-md-3">
        <GenericInputComponent
          :default_value="formData.load_number"
          label="Número de cargue"
          placeholder="-"
          type="text"
          disabled
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericInputComponent
          :default_value="formData.status"
          label="Estado cargue"
          placeholder="-"
          type="text"
          disabled
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericInputComponent
          :default_value="formData.total_records"
          label="Número de registros"
          placeholder="-"
          type="text"
          disabled
        />
      </div>

      <div class="col-12 col-md-3">
        <GenericInputComponent
          :default_value="formData.total_value"
          label="Valor total"
          placeholder="-"
          type="text"
          disabled
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

import { bulk_upload_type } from '@/constants'

import useBulkUploadForm from './BulkUploadForm'

const {
  formData,
  resetForm,
  setValues,
  onFileAdded,
  useUtils,
  handlerHolidays,
  holidays,
  selectOptions,
  progressValue,
  tableProperties,
  attachDocumentRef,
} = useBulkUploadForm()

defineExpose({
  resetForm,
  setValues,
  getValues: () => formData.value,
})
</script>

<style lang="scss" src="./BulkUploadForm.scss"></style>
