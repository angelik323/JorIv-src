<template>
  <q-form
    ref="formRef"
    aria-label="Formulario de datos básicos parámetros de homologación contabilidad vs presupuestos"
  >
    <div
      class="row q-col-gutter-x-lg"
      :class="props.action === 'view' ? 'items-start' : 'items-end'"
    >
      <div v-if="props.action === 'view'" class="col-12 col-md-3">
        <p class="text-weight-bold no-margin text-black-90">Negocio</p>
        <p class="text-weight-medium q-mb-lg">
          {{ props.data?.business_trust?.business_code || '-' }}
        </p>
      </div>
      <div v-else class="col-12 col-md-6">
        <GenericSelectorComponent
          :default_value="models.business_trust_id"
          label="Negocio"
          auto_complete
          map_options
          required
          custom_selection_label="business_code"
          :manual_option="business_trusts_selector"
          :rules="[
              (val: string) => useRules().is_required(val, 'El negocio es requerido'),
            ]"
          :disabled="['edit'].includes(action)"
          @update:modelValue="selectBusiness($event)"
        />
      </div>
      <div v-if="props.action === 'view'" class="col-12 col-md-9">
        <p class="text-weight-bold no-margin text-black-90">
          Descripción negocio
        </p>
        <p class="text-weight-medium q-mb-lg">
          {{ models.business_trust_description || '-' }}
        </p>
      </div>
      <div v-else class="col-12 col-md-6">
        <GenericInputComponent
          :default_value="models.business_trust_description"
          label="Descripción negocio"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div v-if="props.action === 'view'" class="col-12 col-md-3">
        <p class="text-weight-bold no-margin text-black-90">Cuenta contable</p>
        <p class="text-weight-medium q-mb-lg">
          {{ props.data?.accounting_account?.code || '-' }}
        </p>
      </div>
      <div v-else class="col-12 col-md-4">
        <GenericSelectorComponent
          :default_value="models.accounting_account_id"
          label="Cuenta contable"
          auto_complete
          map_options
          required
          display_value="id"
          custom_selection_label="code"
          :manual_option="account_chart_by_account_structure"
          :rules="[
              (val: string) => useRules().is_required(val, 'La cuenta contable es requerida'),
            ]"
          :disabled="['edit'].includes(action)"
          @update:modelValue="selectAccount($event)"
        />
      </div>
      <div v-if="props.action === 'view'" class="col-12 col-md-3">
        <p class="text-weight-bold no-margin text-black-90">
          Descripción cuenta contable
        </p>
        <p class="text-weight-medium q-mb-lg">
          {{ models.accounting_account_description }}
        </p>
      </div>
      <div v-else class="col-12 col-md-4">
        <GenericInputComponent
          :default_value="models.accounting_account_description"
          label="Descripción cuenta contable"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-4">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">Naturaleza</p>
          <p class="text-weight-medium q-mb-lg">
            {{ models.nature }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="models.nature"
          label="Naturaleza"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Desde centro de costo
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.from_cost_center.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.from_cost_center_id"
          label="Desde centro de costo"
          auto_complete
          map_options
          required
          :manual_option="cost_center"
          :rules="[
              (val: string) => useRules().is_required(val, 'El centro de costo es requerido'),
            ]"
          @update:modelValue="models.from_cost_center_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción centro de costo
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ models.from_cost_center_description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedFromCostCenter?.name"
          label="Descripción centro de costo"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Hasta centro de costo
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.to_cost_center.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.to_cost_center_id"
          label="Hasta centro de costo"
          auto_complete
          map_options
          required
          :manual_option="cost_center"
          :rules="[
              (val: string) => useRules().is_required(val, 'El centro de costo es requerido'),
            ]"
          @update:modelValue="models.to_cost_center_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción centro de costo
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ models.to_cost_center_description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedToCostCenter?.name"
          label="Descripción centro de costo"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Desde tipo de comprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.from_voucher_type.value }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.from_voucher_type_id"
          label="Desde tipo de comprobante"
          auto_complete
          map_options
          required
          :manual_option="receipt_types"
          :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de comprobante es requerido'),
            ]"
          @update:modelValue="models.from_voucher_type_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción tipo de comprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ models.from_voucher_type_description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedFromVoucherType?.label"
          label="Descripción tipo de comprobante"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Hasta tipo de comprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.to_voucher_type.value }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.to_voucher_type_id"
          label="Hasta tipo de comprobante"
          auto_complete
          map_options
          required
          :manual_option="receipt_types"
          :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de comprobante es requerido'),
            ]"
          @update:modelValue="models.to_voucher_type_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción tipo de comprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ models.to_voucher_type_description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedToVoucherType?.label"
          label="Descripción tipo de comprobante"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">Desde auxiliar</p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.from_auxiliary?.full_name_code.split('-')[0] }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.from_auxiliary_id"
          label="Desde auxiliar"
          auto_complete
          map_options
          required
          :manual_option="third_parties"
          :rules="[
              (val: string) => useRules().is_required(val, 'El auxiliar es requerido'),
            ]"
          @update:modelValue="models.from_auxiliary_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción auxiliar
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.from_auxiliary?.full_name_code.split('-')[1] }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedFromAuxiliary?.label"
          label="Descripción auxiliar"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">Hasta auxiliar</p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.to_auxiliary?.full_name_code.split('-')[0] }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.to_auxiliary_id"
          label="Hasta auxiliar"
          auto_complete
          map_options
          required
          :manual_option="third_parties"
          :rules="[
              (val: string) => useRules().is_required(val, 'El auxiliar es requerido'),
            ]"
          @update:modelValue="models.to_auxiliary_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción auxiliar
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.from_auxiliary?.full_name_code.split('-')[1] }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedToAuxiliary?.label"
          label="Descripción auxiliar"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Código de movimiento tesorería
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.code_movement_treasury?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.code_movement_treasury_id"
          label="Código de movimiento tesorería"
          auto_complete
          map_options
          required
          :manual_option="treasury_movement_codes"
          :rules="[
              (val: string) => useRules().is_required(val, 'El código de movimiento tesorería es requerido'),
            ]"
          @update:modelValue="models.code_movement_treasury_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción código de movimiento tesorería
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ models.code_movement_treasury_description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedTreasuryCodeMovement?.label"
          label="Descripción código de movimiento tesorería"
          required
          disabled
          :rules="[]"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IAccountingBudgetParameterItem } from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'

// Composables
import { useRules } from '@/composables'

// Logic
import useBasicDataForm from '@/components/Forms/Budget/AccountingBudgetHomologationParameters/BasicData/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAccountingBudgetParameterItem
  }>(),
  {}
)

const {
  models,
  formRef,
  cost_center,
  third_parties,
  receipt_types,
  selectedToAuxiliary,
  selectedToCostCenter,
  selectedToVoucherType,
  selectedFromAuxiliary,
  selectedFromCostCenter,
  selectedFromVoucherType,
  selectedTreasuryCodeMovement,
  treasury_movement_codes,
  business_trusts_selector,
  account_chart_by_account_structure,
  selectBusiness,
  selectAccount,
} = useBasicDataForm(props)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
