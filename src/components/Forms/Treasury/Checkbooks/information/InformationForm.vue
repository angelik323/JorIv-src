<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Negocio"
            :default_value="models.business_trust_id"
            :manual_option="business_trust"
            :map_options="true"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :disabled="['edit'].includes(action)"
            :rules="[(val: string) => is_required(val,  'El negocio es requerido')]"
            @update:modelValue="models.business_trust_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Banco"
            :default_value="models.bank_id"
            :manual_option="banks_record_expenses"
            :map_options="true"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :disabled="['edit'].includes(action)"
            :rules="[(val: string) => is_required(val,  'El banco es requerido')]"
            @update:modelValue="models.bank_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Cuenta bancaria"
            :default_value="models.bank_account_id"
            :manual_option="bank_accounts_with_name"
            :map_options="true"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :disabled="['edit'].includes(action)"
            :rules="[(val: string) => is_required(val,  'La cuenta bancaria es requerida')]"
            @update:modelValue="models.bank_account_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            label="Rango desde"
            v-model="models.range_from"
            hideIcon
            :precision="0"
            required
            :rules="[
              (val: string) => is_required(val, 'El rango desde es requerido'),
            ]"
            @update:modelValue="
              (val: string | number | null) => {
                if (!val) models.range_to = null
              }
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            label="Rango hasta"
            v-model="models.range_to"
            hideIcon
            :precision="0"
            required
            :disabled="!models.range_from"
            :rules="[
              (val: string) => is_required(val, 'El rango hasta es requerido'),
              () => is_valid_range(models.range_to || 0, models.range_from || 0, 'El rango hasta debe ser mayor que el rango desde'),
            ]"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            label="Fecha de asignación"
            :default_value="models.assignment_date"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de asignación es requerida'),
              (val: string) => date_before_or_equal_to_the_current_date(val)
            ]"
            @update:modelValue="models.assignment_date = $event"
          />
        </div>

        <template v-if="['edit'].includes(action)">
          <div class="col-12 col-md-6">
            <GenericInput
              label="Código"
              :default_value="models.code"
              disabled
              @update:model-value="models.code = $event"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Estado"
              :default_value="models.status_id"
              :manual_option="reason_return_status"
              map_options
              auto_complete
              required
              :rules="[(val: string) => is_required(val,  'El estado es requerido')]"
              @update:modelValue="models.status_id = $event"
            />
          </div>
        </template>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { WriteActionType } from '@/interfaces/global'
import { ICheckbookResponse } from '@/interfaces/customs'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: ICheckbookResponse | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formElementRef,
  business_trust,
  banks_record_expenses,
  bank_accounts_with_name,
  reason_return_status,
  is_required,
  is_valid_range,
  date_before_or_equal_to_the_current_date,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
