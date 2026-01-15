<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section class="q-mx-lg q-mt-lg">
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            label="Proveedor de precios"
            :default_value="models.issuers_counterparty_id"
            :manual_option="price_provider_issuers"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Proveedor de precios es requerido'),
              ]"
            @update:model-value="handlerIssuersCounterpartyId($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            label="Descripción"
            placeholder="-"
            disabled
            :default_value="models.description"
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Descripción es requerido'),
              ]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericDateInputComponent
            label="Fecha de cargue"
            :default_value="models.upload_date"
            :mask="'YYYY-MM-DD'"
            :placeholder="'YYYY-MM-DD'"
            :required="true"
            :rules="[
            (v: string) => useRules().is_required(v, 'El campo Fecha de cargue es requerido'),
          ]"
            @update:model-value="models.upload_date = $event"
          />
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />

      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Archivos a cargar
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-if="checkboxConfigs.length > 0"
            v-model="allChecked"
            :label="'Todos'"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
          />
          <div v-else>
            <p>No hay archivos para cargar</p>
          </div>
        </div>

        <div
          v-for="config in checkboxConfigs"
          :key="config.key"
          class="col-xs-12 col-sm-12 col-md-4"
        >
          <RadioYesNo
            :model-value="checkboxStates[config.key] || false"
            @update:model-value="(val) => handleCheckboxChange(config.key, val)"
            :label="config.title"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
          />
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />

      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Cargue de archivos
        </p>
      </div>

      <section class="q-mx-sm mb-2">
        <UploadFile
          v-if="models.documents.length === 0"
          ref="attachDocumentRef"
          :title="uploadProps.title"
          :styles-customs="uploadProps.styleCustom"
          :multiple-files="uploadProps.multiple"
          :label-upload-btn="uploadProps.labelBtn"
          :bordered="uploadProps.bordered"
          :accept="uploadProps.accept"
          color-icon="orange"
          @added="addedFiles"
          @rejected="rejectedFiles"
          @removed="deleteFiles"
        />

        <div v-else>
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['actions', 'status_id', 'name']"
            :hide-bottom="true"
          >
            <template #name="{ row }">
              <div class="q-pa-md row items-center justify-center">
                <img
                  class="image-excel q-mr-sm"
                  src="@/assets/images/excel.svg"
                  alt="Excel Icon"
                />
                {{ row.name }}
              </div>
            </template>

            <template #status_id="{ row }">
              <div
                class="q-pa-md row items-center"
                :class="row.status_id !== 68 ? 'justify-center' : ''"
              >
                <div class="q-mr-md">
                  <ShowStatus
                    :type="Number(row?.status_id ?? 65)"
                    :statusType="'investmentPortfolio'"
                  />
                </div>
                <q-linear-progress
                  v-if="row.status_id === 68"
                  :value="progressValue"
                  :color="'primary_fiduciaria'"
                  size="7px"
                  style="flex: 1; border-radius: 9999px; overflow: hidden"
                />
              </div>
            </template>

            <template #actions="{ row }">
              <Button
                v-if="row.status_id === 65"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="'Eliminar'"
                @click="deleteFiles(row.id)"
              />
            </template>
          </TableList>
        </div>
      </section>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import { defaultIconsLucide } from '@/utils'
import { useRules } from '@/composables'
import useInformationForm from './InformationForm'

defineProps<{
  progressValue: number
}>()

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})

const {
  formElementRef,
  attachDocumentRef,
  models,
  checkboxConfigs,
  allChecked,
  uploadProps,
  tableProps,
  checkboxStates,
  price_provider_issuers,

  addedFiles,
  rejectedFiles,
  deleteFiles,
  handleCheckboxChange,
  handlerIssuersCounterpartyId,
} = useInformationForm()
</script>
