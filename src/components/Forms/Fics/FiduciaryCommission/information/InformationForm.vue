<template>
  <q-form ref="informationFormRef" aria-label="Formulario de información">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="formData.code"
            label="Código de comisión"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El código es requerido.'),
              (val: string) => useRules().max_length(val, 3),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
            :disabled="!isCreate"
            @update:modelValue="formData.code = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="formData.description"
            label="Descripción de comisión"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La descripción es requerida.'),
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => useRules().max_length(val, 100),
              (val: string) => useRules().min_length(val, 1),
            ]"
            @update:modelValue="formData.description = $event"
          />
        </div>

        <div class="col-12">
          <div class="row items-center justify-between q-px-md">
            <p class="q-mb-none mt-1 text-weight-medium">Base de liquidación</p>

            <RadioYesNo
              class="q-mt-none"
              :titleRadioTrue="'Saldo inicial fondo (SIF)'"
              :titleRadioFalse="'Saldo final fondo (SFF)'"
              v-model="liquidationBaseBoolean"
            />
          </div>
          <q-separator class="q-mt-lg q-mb-sm" />
        </div>

        <div class="col-12">
          <div class="row items-center justify-between q-px-md">
            <p class="q-mb-none mt-1 text-weight-medium">Tipo de tasa</p>

            <RadioYesNo
              class="q-mt-none"
              :titleRadioTrue="'Nominal (NO)'"
              :titleRadioFalse="'Efectiva (EF)'"
              v-model="rateTypeBoolean"
            />
          </div>
          <q-separator class="q-mt-lg q-mb-sm" />
        </div>

        <div class="col-12">
          <div class="row items-center justify-between q-px-md">
            <p class="q-mb-none mt-1 text-weight-medium">Tipo de comisión</p>

            <RadioYesNo
              v-if="isCreate"
              class="q-mt-none"
              :titleRadioTrue="'Fija (FI)'"
              :titleRadioFalse="'Variable (VA)'"
              v-model="commissionTypeBoolean"
            />

            <p v-else class="text-grey-8 mb-0">
              {{
                formData.type === 1
                  ? 'Fija (FI)'
                  : formData.type === 2
                  ? 'Variable (VA)'
                  : 'No registrado'
              }}
            </p>
          </div>
          <q-separator class="q-my-lg" />
        </div>

        <div v-if="commissionTypeBoolean" class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="formData.fixed_rate_percentage"
            label="Porcentaje de tasa"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La tasa es requerida.'),
              (val: string) => useRules().only_number_with_decimals(val),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 2, 2),
            ]"
            :disabled="isView"
            @update:modelValue="formData.fixed_rate_percentage = $event"
          />
        </div>

        <div v-else class="col-12">
          <div class="row items-center justify-between q-my-lg">
            <p class="q-mb-none text-black-10 text-h6 text-weight-bold">
              Comisión variable
            </p>

            <Button
              v-if="isCreate"
              label="Agregar comisión"
              :class-custom="'btn__title--standart'"
              :left-icon="defaultIconsLucide.plusCircle"
              color-icon="white"
              :outline="false"
              color="orange"
              @click="handleOpenModal"
            />
          </div>

          <VCard>
            <template #content-card>
              <div class="q-pa-lg">
                <div
                  v-if="tableProperties.rows.length === 0"
                  class="flex column justify-center items-center items-center q-py-xl"
                >
                  <img
                    src="@/assets/images/icons/no_data_accounting.svg"
                    class="q-mb-lg"
                    alt="Sin datos disponibles"
                  />
                  <p class="text-weight-bold text-h6 text-center">
                    Actualmente no hay comisiones registradas
                  </p>
                  <p class="text-weight-light text-h6 text-center">
                    Por favor, cree una para continuar con el proceso
                  </p>
                </div>

                <TableList
                  v-else
                  hidePagination
                  :title="tableProperties.title"
                  :loading="tableProperties.loading"
                  :rows="tableProperties.rows"
                  :columns="tableProperties.columns"
                  :custom-columns="['actions']"
                >
                  <template #actions="{ row }">
                    <Button
                      v-if="isCreate"
                      :left-icon="defaultIconsLucide.edit"
                      color-icon="#f45100"
                      color="orange"
                      :class-custom="'custom'"
                      :outline="false"
                      :flat="true"
                      tooltip="Editar"
                      @click="handleEdit(row.id)"
                    />
                  </template>
                </TableList>
              </div>
            </template>
          </VCard>
        </div>
      </div>
    </section>

    <AlertModalComponent
      ref="addCommissionModalRef"
      styleModal="max-width: 500px; width: 100%;"
      :showBtnConfirm="false"
      :showBtnCancel="false"
      :showImgDefault="false"
      :showCloseBtn="true"
    >
      <template #default-body>
        <div class="q-mx-lg q-col-gutter-md">
          <p class="text-h5 text-weight-bold">Creación comisión variable</p>
          <div class="col q-col-gutter-sm">
            <GenericInputComponent
              ref="initialBalanceRef"
              label="Saldo inicial"
              :default_value="modalCommissionData.initial_balance"
              placeholder="0"
              class_name="q-pt-none"
              type="text"
              required
              disabled
              readonly
              @update:modelValue="modalCommissionData.initial_balance = $event"
              :rules="[
                (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
                (val: string) => useRules().is_required(val, 'El saldo inicial es requerido.'),
                (val: string) => useRules().only_number_with_decimals(val),
              ]"
            />

            <GenericInputComponent
              ref="finalBalanceRef"
              label="Saldo final"
              :default_value="modalCommissionData.final_balance"
              placeholder="Inserte"
              class_name="q-pt-none"
              type="text"
              required
              @update:modelValue="modalCommissionData.final_balance = $event"
              :rules="[
                (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
                (val: string) => useRules().is_required(val, 'El saldo final es requerido.'),
                (val: string) => useRules().only_number_with_decimals(val),
              ]"
            />
          </div>

          <GenericInputComponent
            ref="ratePercentageRef"
            label="Porcentaje tasa"
            :default_value="modalCommissionData.rate_percentage"
            placeholder="%"
            class_name="q-pt-none"
            type="text"
            required
            @update:modelValue="modalCommissionData.rate_percentage = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El porcentaje de tasa es requerido.'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 2, 2),
              (val: string) => useRules().only_number_with_decimals(val),
            ]"
          />
        </div>

        <div class="row q-mt-lg flex justify-center">
          <Button
            label="Cancelar"
            color="orange"
            class="text-capitalize btn-filter custom q-mr-md"
            :outline="true"
            @click="handleCloseModal"
          />

          <Button
            :outline="false"
            label="Agregar"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="handleAdd"
          />
        </div>
      </template>
    </AlertModalComponent>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IFiduciaryCommission } from '@/interfaces/customs/fics/FiduciaryCommission'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

import useInformationForm from '@/components/Forms/Fics/FiduciaryCommission/information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IFiduciaryCommission
  }>(),
  {}
)

const {
  isView,
  isCreate,
  formData,
  handleAdd,
  handleEdit,
  handleOpenModal,
  rateTypeBoolean,
  tableProperties,
  finalBalanceRef,
  handleCloseModal,
  initialBalanceRef,
  ratePercentageRef,
  informationFormRef,
  defaultIconsLucide,
  modalCommissionData,
  addCommissionModalRef,
  commissionTypeBoolean,
  liquidationBaseBoolean,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
