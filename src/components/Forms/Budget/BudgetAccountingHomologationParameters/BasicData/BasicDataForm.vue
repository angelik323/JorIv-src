<template>
  <q-form
    ref="formRef"
    aria-label="Formulario de datos básicos parámetros de homologación presupuesto vs contabilidad"
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
          :manual_option="business_trusts_selector"
          custom_selection_label="business_code"
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
        <p class="text-weight-bold no-margin text-black-90">
          Rubro presupuestal
        </p>
        <p class="text-weight-medium q-mb-lg">
          {{ props.data?.budget_item?.code }}
        </p>
      </div>
      <div v-else class="col-12 col-md-6">
        <GenericSelectorComponent
          :default_value="models.budget_item_id"
          label="Rubro presupuestal"
          auto_complete
          map_options
          required
          :manual_option="budget_item_codes"
          display_value="id"
          custom_selection_label="code"
          :rules="[
              (val: string) => useRules().is_required(val, 'El rubro presupuestal es requerido'),
            ]"
          :disabled="['edit'].includes(action)"
          @update:modelValue="models.budget_item_id = $event"
        />
      </div>
      <div v-if="props.action === 'view'" class="col-12 col-md-9">
        <p class="text-weight-bold no-margin text-black-90">
          Descripción rubro presupuestal
        </p>
        <p class="text-weight-medium q-mb-lg">
          {{ props.data?.budget_item?.description }}
        </p>
      </div>
      <div v-else class="col-12 col-md-6">
        <GenericInputComponent
          :default_value="selectedBudgetItem?.description"
          label="Descripción rubro presupuestal"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">Área</p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.responsability_area?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.responsability_area_id"
          label="Área"
          auto_complete
          map_options
          required
          custom_selection_label="code"
          :manual_option="areas_resposabilities_codes"
          :rules="[
              (val: string) => useRules().is_required(val, 'El área presupuestal es requerida'),
            ]"
          @update:modelValue="models.responsability_area_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción área
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.responsability_area?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedArea?.description"
          label="Descripción área"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">Recurso</p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_resource?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.budget_resource_id"
          label="Recurso"
          auto_complete
          map_options
          required
          custom_selection_label="code"
          :manual_option="budget_resource_codes"
          :rules="[
              (val: string) => useRules().is_required(val, 'El recurso presupuestal es requerido'),
            ]"
          @update:modelValue="models.budget_resource_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción recurso
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_resource?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedResource?.description"
          label="Descripción recurso"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Tipo de documento presupuestal
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_document_type?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.budget_document_type_id"
          label="Tipo de documento presupuestal"
          auto_complete
          map_options
          required
          custom_selection_label="code"
          :manual_option="budget_document_types"
          :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de documento es requerido'),
            ]"
          @update:modelValue="models.budget_document_type_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción tipo de documento presupuestal
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_document_type?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedDocumentType?.description"
          label="Descripción tipo de documento presupuestal"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Código de movimiento
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.code_movement?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.code_movement_id"
          label="Código de movimiento"
          auto_complete
          map_options
          required
          display_value="id"
          custom_selection_label="movement_code"
          :manual_option="code_movements"
          :rules="[
              (val: string) => useRules().is_required(val, 'El código de movimiento es requerido'),
            ]"
          @update:modelValue="models.code_movement_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción código de movimiento
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.code_movement?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedMovementCode?.movement_description"
          label="Descripción código de movimiento"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Tipo de comprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.voucher_type.value }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.voucher_type_id"
          label="Tipo de comprobante"
          auto_complete
          map_options
          required
          :manual_option="receipt_types"
          :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de comprobante es requerido'),
            ]"
          @update:modelValue="selectVoucherType($event)"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción tipo de comprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.voucher_type.label }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedVoucherType?.label"
          label="Descripción tipo de comprobante"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Tipo de subcomprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.voucher_type.value }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.sub_voucher_type_id"
          label="Tipo de subcomprobante"
          auto_complete
          map_options
          required
          :manual_option="selectedVoucherType?.related || []"
          :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de subcomprobante es requerido'),
            ]"
          @update:modelValue="models.sub_voucher_type_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción tipo de subcomprobante
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.sub_voucher_type.label }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedVoucherSubType?.label"
          label="Descripción tipo de subcomprobante"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12" :class="props.action === 'view' ? 'q-mb-md' : ''">
        <RadioYesNo
          v-model="models.nature"
          :has-title="true"
          title="Naturaleza*"
          :options="NATURE_OPTIONS"
          :isDisabled="!['create'].includes(action)"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Cuenta contable partida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.source_accounting_account?.code || '-' }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.source_accounting_account_id"
          label="Cuenta contable partida"
          auto_complete
          map_options
          required
          display_value="id"
          custom_selection_label="code"
          :manual_option="account_chart_by_account_structure"
          :rules="[
              (val: string) => useRules().is_required(val, 'La cuenta contable es requerida'),
            ]"
          @update:modelValue="models.source_accounting_account_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <div v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción cuenta contable partida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.source_accounting_account.code_account }}
          </p>
        </div>
        <GenericInputComponent
          v-else
          :default_value="selectedAccount?.code_account"
          label="Descripción cuenta contable"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Cuenta contable contrapartida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.counterpart_accounting_account?.code || '-' }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.counterpart_accounting_account_id"
          label="Cuenta contable contrapartida"
          auto_complete
          map_options
          required
          display_value="id"
          custom_selection_label="code"
          :manual_option="account_chart_by_account_structure"
          :rules="[
              (val: string) => useRules().is_required(val, 'La cuenta contable es requerida'),
            ]"
          @update:modelValue="models.counterpart_accounting_account_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <div v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción cuenta contable contrapartida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.counterpart_accounting_account.code_account }}
          </p>
        </div>
        <GenericInputComponent
          v-else
          :default_value="selectedCounterpartAccount?.code_account"
          label="Descripción cuenta contable"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Centro de costo partida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.source_cost_center.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.source_cost_center_id"
          label="Centro de costo partida"
          auto_complete
          map_options
          required
          :manual_option="cost_center"
          :rules="[
              (val: string) => useRules().is_required(val, 'El centro de costo es requerido'),
            ]"
          @update:modelValue="models.source_cost_center_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción centro de costo
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.source_cost_center?.name }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedCostCenter?.name"
          label="Descripción centro de costo"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Centro de costo contrapartida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.counterpart_cost_center?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.counterpart_cost_center_id"
          label="Hasta centro de costo"
          auto_complete
          map_options
          required
          :manual_option="cost_center"
          :rules="[
              (val: string) => useRules().is_required(val, 'El centro de costo es requerido'),
            ]"
          @update:modelValue="models.counterpart_cost_center_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción centro de costo
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.counterpart_cost_center?.name }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedCounterpartCostCenter?.name"
          label="Descripción centro de costo"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Auxiliar partida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.source_auxiliary?.full_name_code.split('-')[0] }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.source_auxiliary_id"
          label="Auxiliar partida"
          auto_complete
          map_options
          required
          :manual_option="third_parties"
          :rules="[
              (val: string) => useRules().is_required(val, 'El auxiliar es requerido'),
            ]"
          @update:modelValue="models.source_auxiliary_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción auxiliar
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.source_auxiliary?.full_name_code.split('-')[1] }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedAuxiliary?.label"
          label="Descripción auxiliar"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Auxiliar contrapartida
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{
              props.data?.counterpart_auxiliary?.full_name_code.split('-')[0]
            }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.counterpart_auxiliary_id"
          label="Auxiliar contrapartida"
          auto_complete
          map_options
          required
          :manual_option="third_parties"
          :rules="[
              (val: string) => useRules().is_required(val, 'El auxiliar es requerido'),
            ]"
          @update:modelValue="models.counterpart_auxiliary_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción auxiliar
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{
              props.data?.counterpart_auxiliary?.full_name_code.split('-')[1]
            }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedCounterpartAuxiliary?.label"
          label="Descripción auxiliar"
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
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IBudgetAccountingParameterItem } from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'
import { NATURE_OPTIONS } from '@/constants/resources/budget'

// Composables
import { useRules } from '@/composables'

// Logic
import useBasicDataForm from '@/components/Forms/Budget/BudgetAccountingHomologationParameters/BasicData/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBudgetAccountingParameterItem
  }>(),
  {}
)

const {
  models,
  formRef,
  cost_center,
  third_parties,
  receipt_types,
  selectedArea,
  selectedAccount,
  selectedResource,
  selectedAuxiliary,
  selectedBudgetItem,
  selectedCostCenter,
  selectedVoucherType,
  selectedMovementCode,
  selectedDocumentType,
  selectedVoucherSubType,
  selectedCounterpartAccount,
  selectedCounterpartAuxiliary,
  selectedCounterpartCostCenter,
  business_trusts_selector,
  account_chart_by_account_structure,
  budget_resource_codes,
  areas_resposabilities_codes,
  budget_document_types,
  budget_item_codes,
  code_movements,
  selectBusiness,
  selectVoucherType,
} = useBasicDataForm(props)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
