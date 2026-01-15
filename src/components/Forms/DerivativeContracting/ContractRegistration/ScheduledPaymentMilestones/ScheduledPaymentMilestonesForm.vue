<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
        Definición de hitos de pago
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-ml-xs">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold">Monto moneda extranjera</p>
            <p class="text-weight-medium">
              {{ formatCurrencyString(models.amount) ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold">Valor del contrato</p>
            <p class="text-weight-medium">
              {{ formatCurrencyString(models.contract_value) ?? '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-my-xl q-mx-sm">
      <TableList
        :loading="tableProperties.loading"
        :columns="tableProperties.columns"
        :rows="tableProperties.rows"
        :pages="tableProperties.pages"
        :custom-columns="['actions']"
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #custom-header>
          <div
            class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
          >
            <span class="text-subtitle1 text-weight-bold">
              {{ tableProperties.title }}
            </span>
            <Button
              v-if="['create', 'edit'].includes(action)"
              :outline="false"
              label="Agregar"
              :class-custom="'items-center'"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              color-icon="white"
              :style-content="{ 'align-items': 'center' }"
              @click="handleOpenModalScheduledPaymentMilestone"
            />
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.edit"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Editar"
            :disabled="
              !(['create', 'edit'].includes(action) && row.is_new_milestone)
            "
            @click="handleEditScheduledPaymentMilestone(row.id)"
          />

          <Button
            :left-icon="defaultIconsLucide.trash"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Eliminar"
            :disabled="
              !(['create', 'edit'].includes(action) && row.is_new_milestone) ||
              row.is_used
            "
            @click="handleDeleteScheduledPaymentMilestone(row.id)"
          />
        </template>
      </TableList>
    </section>

    <section>
      <p class="text-black-10 text-weight-bold text-h6">
        Total monto programado
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.scheduled_foreign_amount || null"
            label="Monto extranjero"
            :currency="'USD'"
            disabled
            required
            hide_symbol
            :rules="[
              (v) => useRules().only_number_greater_than_zero_with_decimal(v),
            ]"
            @update:model-value="
              ({ rawValue }) => (models.scheduled_foreign_amount = rawValue)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Monto</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.scheduled_foreign_amount) }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.scheduled_local_amount || null"
            label="Monto local"
            disabled
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.scheduled_local_amount = rawValue)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Monto</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.scheduled_local_amount) }}
            </p>
          </div>
        </div>
      </div>

      <p class="text-black-10 text-weight-bold text-h6">
        Valor pendiente por programar
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.outstanding_foreign_amount || null"
            label="Monto extranjero"
            :currency="'USD'"
            disabled
            hide_symbol
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.outstanding_foreign_amount = rawValue)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Monto</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.outstanding_foreign_amount) }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <InputMoneyComponent
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.outstanding_local_amount || null"
            label="Monto local"
            disabled
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.outstanding_local_amount = rawValue)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Monto</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.outstanding_local_amount) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>

  <AlertModalComponent
    :showImgDefault="false"
    styleModal="max-width: 1000px; width: 100%;"
    :title-header="`${alertModalConfig.action} hito programado`"
    ref="alertModalRef"
    :showBtnCancel="false"
    :textBtnConfirm="
      alertModalConfig.action === 'Crear' ? 'Crear' : 'Actualizar'
    "
    @confirm="handleAddScheduledPaymentMilestone"
  >
    <template #default-body>
      <q-form ref="formMilestonesRef">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mx-md">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Tipo de pago"
              :default_value="alertModalConfig?.payment_type_id ?? null"
              :manual_option="payment_type"
              map_options
              auto_complete
              return_object
              required
              :rules="[(val: string) => useRules().is_required(val,  'El tipo de pago es requerido')]"
              @update:modelValue="
                (val) => {
                  alertModalConfig.payment_type_name = val.label
                  alertModalConfig.payment_type_id = val.value
                }
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericDateInputComponent
              label="Fecha"
              :default_value="alertModalConfig?.scheduled_date ?? null"
              required
              :option_calendar="only_after(models.subscription_date || '')"
              :rules="[
                (val: string) => useRules().is_required(val,  'La fecha es requerida')

                ]"
              @update:modelValue="alertModalConfig.scheduled_date = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <InputMoneyComponent
              :model-value="alertModalConfig.foreign_amount"
              label="Monto extranjero"
              :max_integer_digits="15"
              :max_decimal_digits="2"
              :disabled="models.currency_id === 'COP'"
              hide_symbol
              :rules="[
                (v) => useRules().only_number_greater_than_zero_with_decimal(v),
              ]"
              @update:model-value="
                ({ rawValue }) => (alertModalConfig.foreign_amount = rawValue)
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <InputMoneyComponent
              :model-value="alertModalConfig.local_amount"
              label="Monto local"
              :max_integer_digits="15"
              :max_decimal_digits="2"
              :disabled="models.currency_id !== 'COP'"
              :rules="[
                (v) => useRules().only_number_greater_than_zero_with_decimal(v),
              ]"
              @update:model-value="
                ({ rawValue }) => (alertModalConfig.local_amount = rawValue)
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4 q-mt-sm">
            <RadioYesNo
              v-model="alertModalConfig.applies_budget"
              label="¿Aplica Ppto?"
              :isRadioButton="false"
              :hasTitle="false"
              :hasSubtitle="false"
              :is-disabled="!models.is_editable_ppto"
            />
          </div>
        </div>
      </q-form>
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IContractRegistrationGeneralDataForm } from '@/interfaces/customs/derivative-contracting/ContractRegistration'

//Logic form
import useScheduledPaymentMilestonesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/ScheduledPaymentMilestones/ScheduledPaymentMilestonesForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IContractRegistrationGeneralDataForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IContractRegistrationGeneralDataForm | null): void
}>()

const {
  models,
  formElementRef,
  formMilestonesRef,
  tableProperties,
  defaultIconsLucide,
  alertModalRef,
  alertModalConfig,
  payment_type,

  handleOpenModalScheduledPaymentMilestone,
  handleAddScheduledPaymentMilestone,
  handleEditScheduledPaymentMilestone,
  handleDeleteScheduledPaymentMilestone,
  formatCurrencyString,
  only_after,
} = useScheduledPaymentMilestonesForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
