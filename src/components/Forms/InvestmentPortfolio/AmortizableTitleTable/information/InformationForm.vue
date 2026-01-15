<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-6']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.mnemonic"
            :placeholder="'Inserte'"
            :disabled="action !== 'create'"
            :label="'Nemotécnico'"
            :rules="[
              (val) => useRules().is_required(val, 'El campo es requerido'),
              (val) => useRules().min_length(val, 1),
              (val) => useRules().max_length(val, 12),
              (val) => useRules().no_consecutive_spaces(val),
            ]"
            @update:model-value="(val) => (models.mnemonic = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-6']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.payment_frequency"
            :manual_option="periodicityOptions"
            map_options
            :placeholder="'Inserte'"
            :label="'Periodicidad de pago'"
            required
            :auto_complete="true"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La periodicidad de pago es requerida'
                ),
            ]"
            @update:model-value="(val) => (models.payment_frequency = val)"
          />
        </div>

        <div class="self-end flex justify-between col-12 col-md-12 col-sm-12">
          <p class="text-weight-medium mb-0 mt-2">Modalidad *</p>
          <RadioYesNo
            v-model="models.modality"
            title-radio-true="Anticipada"
            title-radio-false="Vencida"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="self-end flex justify-between col-12 col-md-12 col-sm-12">
        <p class="text-weight-medium mb-0 mt-2">Tipo de flujo *</p>
        <RadioYesNo
          v-model="flowTypeBoolean"
          title-radio-true="Regular"
          title-radio-false="Irregular"
        />
      </div>

      <q-separator class="q-my-md" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-6']">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.issue_date"
            :disabled="action !== 'create'"
            :placeholder="''"
            :label="'Fecha de emisión'"
            required
            :rules="[
              (val) =>
                useRules().is_required(val, 'La fecha de emisión es requerida'),
            ]"
            @update:model-value="(val) => (models.issue_date = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-6']">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.maturity_date"
            :disabled="action !== 'create'"
            :placeholder="''"
            :label="'Fecha de vencimiento'"
            required
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La fecha de vencimiento es requerida'
                ),
            ]"
            @update:model-value="(val) => (models.maturity_date = val)"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-4']">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :key="dateInputKey"
            :default_value="models.date"
            :placeholder="'Inserte'"
            :label="'Fecha'"
            :disabled="isDateDisabled"
            required
            :rules="[
              (val) => useRules().is_required(val, 'La fecha es requerida'),
              (val) => dateInRangeRule(val),
              (val) => periodicityRule(val),
            ]"
            @update:model-value="(val) => coerceDateOnInput(val)"
          />
        </div>
        <div :class="['col-12', 'col-md-4']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.percentage"
            :placeholder="'Inserte'"
            :label="'Porcentaje'"
            required
            :rules="[
              (val) => useRules().only_number_with_decimals(val),
              (val) =>
                useRules().is_required(val, 'El porcentaje es requerido'),
            ]"
            @update:model-value="(val) => (models.percentage = val)"
          />
        </div>
      </div>

      <section>
        <div
          class="flex justify-between col-12 col-md-12 col-sm-12 items-center"
        >
          <h6>Tabla</h6>
          <div>
            <Button
              :outline="true"
              label="Importar"
              size="md"
              unelevated
              color="orange"
              colorIcon="black"
              :left-icon="defaultIconsLucide.cloudUpload"
              @click="openModal"
            />
            <Button
              :outline="false"
              label="Agregar"
              size="md"
              colorIcon="white"
              :class-custom="'q-mx-sm'"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              @click="createDataTables"
            />
          </div>
        </div>
      </section>

      <VCard class="q-mt-md">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              :title="tableProps.title"
              :loading="tableProps.loading"
              :rows="tableProps.rows"
              :columns="tableProps.columns"
              :custom-columns="['status', 'actions']"
            >
              <template #custom-no-data>
                <div class="row justify-center mt-4">
                  <div>
                    <img
                      src="@/assets/images/icons/no_data_accounting.svg"
                      alt="Helion"
                    />
                  </div>
                </div>
                <p class="text-weight-bold text-h6 text-center">
                  Actualmente no hay títulos amortizables
                </p>
                <p class="text-weight-light text-h6 text-center">
                  Por favor, importe o agregue uno para continuar con el proceso
                </p>
              </template>

              <template #actions="{ row }">
                <Button
                  :right-icon="defaultIconsLucide.delete"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="removeDataTableRow(row.id)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <ModalComponent
      v-model="showModal"
      :openDialog="showModal"
      :title="'Cargar tabla de amortización'"
      width="600"
      :height="400"
      :showBtnConfirm="false"
      :showBtnCancel="false"
      :showImgDefault="false"
      :showCloseBtn="true"
    >
      <template #content-modal>
        <div class="flex justify-end">
          <Button
            :outline="true"
            label="Descargar excel"
            :leftImg="excelIcon"
            tooltip="Descargar excel"
            :class="'self-end items-end'"
            @click="downloadTemplateExcel"
          />
        </div>

        <section class="mx-4 mb-4">
          <div class="flex justify-between items-center">
            <p>Origen*</p>
            <RadioYesNo
              v-model="isOriginUpload"
              title-radio-true="Proveedor precios"
              title-radio-false="Titularizadora"
            />
          </div>

          <div v-if="UploadShow">
            <UploadFile
              ref="attachDocumentRef"
              :title="uploadProps.title"
              :styles-customs="uploadProps.styleCustom"
              :multiple-files="uploadProps.multiple"
              :label-upload-btn="uploadProps.labelBtn"
              :bordered="uploadProps.bordered"
              :accept="uploadProps.accept"
              color-icon="orange"
              @added="validateImportFile"
              @removed="deleteFiles"
              @rejected="rejectedFiles"
            />
          </div>

          <div v-else class="q-mt-md">
            <TableList
              :title="tableProps.title"
              :loading="tableProps.loading"
              :rows="tableProps.rows"
              :columns="tableProps.columns"
              :custom-columns="['actions']"
            >
              <template #actions="{ row }">
                <Button
                  :right-icon="defaultIconsLucide.delete"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="removeDataTableRow(row.id)"
                />
              </template>
            </TableList>
          </div>

          <div class="flex justify-center items-center">
            <Button
              :outline="true"
              label="Cancelar"
              unelevated
              color="orange"
              colorText="black"
              class="text-capitalize btn-filter custom q-mr-xs"
              style="margin-right: 10px"
              @click="cancelFunction"
            />
            <Button
              :outline="false"
              label="Cargar"
              unelevated
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="cancelFunction"
            />
          </div>
        </section>
      </template>
    </ModalComponent>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          :key="totalPercentage"
          :default_value="totalPercentage"
          :placeholder="''"
          :label="'Porcentaje total'"
          disabled
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'

import excelIcon from '@/assets/images/excel.svg'

import { useRules } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { useInformationForm } from './InformationForm'
import { IAmortizationTitleTable } from '@/interfaces/customs/'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IAmortizationTitleTable[]
  }>(),
  { action: 'create' }
)

const {
  tableProps,
  models,
  showModal,
  flowTypeBoolean,
  periodicityOptions,
  uploadProps,
  isOriginUpload,
  UploadShow,
  totalPercentage,
  createDataTables,
  downloadTemplateExcel,
  cancelFunction,
  openModal,
  removeDataTableRow,
  deleteFiles,
  rejectedFiles,
  validateImportFile,
  dateInputKey,
  isDateDisabled,
  dateInRangeRule,
  periodicityRule,
  coerceDateOnInput,
} = useInformationForm(props)
</script>
