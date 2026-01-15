<template>
  <q-form ref="filterFormElementRef" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelector
              label="Banco"
              :default_value="models.bank_id"
              :manual_option="banks_label_code"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo banco es requerido'),
              ]"
              @update:model-value="handleSelectedBank($event)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              label="Nombre banco"
              :default_value="models.bank_name"
              placeholder="-"
              disabled
              :required="false"
              :rules="[]"
              @update:model-value="models.bank_name = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12">
            <GenericSelector
              label="Tipo de proceso"
              :default_value="models.file_type"
              :manual_option="response_bank_file_types"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(
                    v,
                    'El campo tipo de proceso es requerido'
                  ),
              ]"
              @update:model-value="selectedProcessType = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelector
              v-if="selectedProcessType === 'Archivo'"
              label="Formato"
              :default_value="models.bank_structure_id"
              :manual_option="response_bank_formats"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="selectedProcessType === 'Archivo'"
              :rules="
                selectedProcessType === 'Archivo'
                  ? [
                      (v: string) =>
                        useRules().is_required(
                          v,
                          'El campo formato es requerido'
                        ),
                    ]
                  : []
              "
              @update:model-value="handleSelectedFormat($event)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              v-if="selectedProcessType === 'Archivo'"
              label="Descripción formato"
              :default_value="models.description_format"
              :required="selectedProcessType === 'Archivo'"
              disabled
              placeholder="-"
              :rules="
                selectedProcessType === 'Archivo'
                  ? [
                      (v: string) =>
                        useRules().is_required(
                          v,
                          'El campo descripción formato es requerido'
                        ),
                    ]
                  : []
              "
              @update:model-value="models.description_format = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericDateInput
              label="Fecha dispersión"
              :default_value="models.dispersal_date"
              :required="selectedProcessType === 'Manual'"
              :mask="'YYYY-MM-DD'"
              :placeholder="'YYYY-MM-DD'"
              :rules="
                selectedProcessType === 'Manual'
                  ? [
                      (v: string) =>
                        useRules().date_before_or_equal_to_the_current_date(v),
                      (v: string) => useRules().date_is_not_weekend(v),
                      (v: string) =>
                        useRules().is_required(
                          v,
                          'El campo fecha dispersión es requerido'
                        ),
                    ]
                  : []
              "
              @update:modelValue="handleSelectedDispersionDate($event)"
              :option_calendar="($event) => isDateAllowed($event, holidays)"
              :onNavigation="({ year }) => handlerHolidays(year)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelector
              label="Grupo dispersión"
              :default_value="models.dispersion_group_id"
              :manual_option="response_bank_dispersion_groups"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="selectedProcessType === 'Manual'"
              :rules="
                selectedProcessType === 'Manual'
                  ? [
                      (v: string) =>
                        useRules().is_required(
                          v,
                          'El campo grupo dispersión es requerido'
                        ),
                    ]
                  : []
              "
              @update:model-value="models.dispersion_group_id = $event"
            />
          </div>
        </div>
      </div>
    </section>

    <BankResponseUploadFileList
      ref="uploadFileListRef"
      v-if="selectedProcessType === 'Archivo'"
      :form-ref="filterFormElementRef"
      @validate-upload-file="handleValidateBankResponseUploadFile"
    />

    <section>
      <div class="row justify-end q-gutter-md">
        <Button
          label="Limpiar"
          color="primary_fiduciaria_minus"
          class="menu__action--bg-white text-capitalize"
          color-icon="#762343"
          outline
          :left-icon="defaultIconsLucide.reload"
          @click="handleClear()"
        />
        <Button
          :disabled="
            selectedProcessType === 'Archivo' && !bank_response_document?.file
          "
          label="Buscar"
          color="primary_fiduciaria_minus"
          color-icon="white"
          :outline="false"
          :class-custom="'items-center'"
          :left-icon="defaultIconsLucide.magnify"
          @click="handleSearch()"
        />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import BankResponseUploadFileList from '@/components/Lists/Treasury/BankResponse/BankResponseUploadFile/BankResponseUploadFileList.vue'

import useBankResponseFilterForm from '@/components/Forms/Treasury/BankResponse/BankResponseFilter/BankResponseFilterForm'

const emits = defineEmits<{
  (e: 'update:processType', value: string): void
  (e: 'search'): void
}>()

const props = defineProps<{
  processType: string
}>()

defineExpose({
  validateForm: () => filterFormElementRef.value?.validate(),
})

const {
  defaultIconsLucide,
  models,
  filterFormElementRef,
  bank_response_document,
  uploadFileListRef,
  selectedProcessType,
  banks_label_code,
  response_bank_file_types,
  response_bank_formats,
  response_bank_dispersion_groups,
  holidays,

  handleSelectedBank,
  handleSelectedFormat,
  handleSelectedDispersionDate,
  handleValidateBankResponseUploadFile,
  handleClear,
  handleSearch,
  useRules,
  handlerHolidays,
  isDateAllowed,
} = useBankResponseFilterForm(props, emits)
</script>
