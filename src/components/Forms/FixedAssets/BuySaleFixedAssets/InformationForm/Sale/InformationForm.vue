<template>
  <q-form ref="information_form_ref" class="information-form">
    <!-- SECCIÓN AUDITORÍA -->
    <div v-if="fieldStates.audit.show" class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <GenericInput
          :default_value="auditFields.created_at"
          label="Fecha de creación"
          :disabled="true"
          placeholder="-"
        />
      </div>
      <div class="col-12 col-md-4">
        <GenericInput
          :default_value="auditFields.created_by"
          label="Creado por"
          :disabled="true"
          placeholder="-"
        />
      </div>
      <div class="col-12 col-md-4">
        <GenericInput
          :default_value="auditFields.updated_at"
          label="Fecha de actualización"
          :disabled="true"
          placeholder="-"
          v-if="auditFields.updated_by"
        />
      </div>
      <div class="col-12 col-md-4">
        <GenericInput
          :default_value="auditFields.updated_by"
          label="Actualizado por"
          :disabled="true"
          placeholder="-"
          v-if="auditFields.updated_by"
        />
      </div>
      <template v-if="fieldStates.authorization_audit.show">
        <div class="col-12 col-md-4">
          <GenericInput
            :default_value="auditFields.authorized_at"
            label="Fecha de autorización"
            :disabled="true"
            placeholder="-"
            v-if="auditFields.authorized_by"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInput
            :default_value="auditFields.authorized_by"
            label="Autorizado por"
            :disabled="true"
            placeholder="-"
            v-if="auditFields.authorized_by"
          />
        </div>
      </template>
    </div>

    <div v-if="isCreateAction" class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <GenericInput
          :default_value="auditFields.created_at"
          label="Fecha de creación"
          :disabled="true"
          placeholder="-"
        />
      </div>
    </div>

    <!-- CAMPOS PRINCIPALES -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4" v-if="fieldStates.id_fixed_asset_property.show">
        <GenericSelector
          :default_value="model.id_fixed_asset_property"
          label="Id Activo/Bien"
          :required="true"
          :manual_option="fixedAssetsForSalesOptions"
          :map_options="true"
          :auto_complete="true"
          placeholder="Seleccione activo/bien"
          :disabled="fieldStates.id_fixed_asset_property.disabled"
          :rules="[
            (v: number) => useRules().is_required(String(v ?? ''), 'El activo/bien es requerido')
          ]"
          @update:model-value="model.id_fixed_asset_property = $event"
        />
      </div>
      <div class="col-12 col-md-8">
        <RadioYesNo
          :has-title="true"
          title="Tipo activo fijo / bien"
          v-model="model.asset_category"
          :options="assetCategoryOptions"
          :isDisabled="fieldStates.asset_category.disabled"
        />
      </div>
    </div>

    <!-- SECCIÓN DETALLE -->
    <div class="section-title q-mb-md">
      <span class="text-weight-bold">Detalle</span>
    </div>

    <div class="detail-section q-pa-md">
      <div class="row q-col-gutter-md">
        <!-- Negocio -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="model.business_trust_id"
            label="Negocio"
            :required="true"
            :manual_option="businessTrustOptions"
            :map_options="true"
            :auto_complete="true"
            placeholder="Seleccione negocio"
            :disabled="fieldStates.business_trust.disabled"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'El negocio es requerido')
            ]"
            @update:model-value="model.business_trust_id = $event"
          />
        </div>
        <!-- Tercero -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="model.third_party_id"
            label="Tercero"
            :required="true"
            :manual_option="thirdPartyOptions"
            :map_options="true"
            :auto_complete="true"
            placeholder="Buscar por documento o nombre"
            :disabled="fieldStates.third_party.disabled"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'El tercero es requerido')
            ]"
            @update:model-value="model.third_party_id = $event"
          />
        </div>

        <!-- Fecha venta -->
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="model.transaction_date"
            label="Fecha venta"
            :required="true"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            :disabled="fieldStates.transaction_date.disabled"
            :rules="[
              (v: string) => useRules().is_required(v ?? '', 'La fecha es requerida')
            ]"
            @update:model-value="model.transaction_date = $event"
          />
        </div>

        <!-- Valor venta -->
        <div class="col-12 col-md-4">
          <CurrencyInput
            v-model="model.transaction_value"
            currencyLabel="Valor venta"
            :required="true"
            :currency="'COP'"
            :disabled="fieldStates.transaction_value.disabled"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'El valor es requerido'),
              (v: number) => useRules().not_less_or_equal_to_zero(String(v ?? ''))
            ]"
            @update:model-value="model.transaction_value = $event != null ? Number($event) : null"
          />
        </div>

        <!-- Moneda -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="model.currency_id"
            label="Moneda"
            :required="false"
            :manual_option="currencyOptions"
            :map_options="true"
            :auto_complete="true"
            placeholder="Seleccione moneda"
            :disabled="fieldStates.currency.disabled"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'La moneda es requerida')
            ]"
            @update:model-value="model.currency_id = $event"
          />
        </div>

        <!-- Tipo bien o activo fijo -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="model.configuration_type_id"
            label="Tipo bien o activo fijo"
            :required="true"
            :manual_option="configurationTypeOptions"
            :map_options="true"
            :auto_complete="true"
            placeholder="Seleccione tipo"
            :disabled="fieldStates.configuration_type.disabled"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'El tipo es requerido')
            ]"
            @update:model-value="model.configuration_type_id = $event"
          />
        </div>

        <!-- Subtipo bien o activo fijo -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="model.configuration_subtype_id"
            label="Subtipo bien o activo fijo"
            :required="true"
            :manual_option="filteredSubtypes"
            :map_options="true"
            :auto_complete="true"
            placeholder="Seleccione subtipo"
            :disabled="fieldStates.configuration_subtype.disabled || !model.configuration_type_id"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'El subtipo es requerido')
            ]"
            @update:model-value="model.configuration_subtype_id = $event"
          />
        </div>

        <!-- Centro de costos -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="model.cost_center_id"
            label="Centro de costos"
            :required="false"
            :manual_option="costCenterOptions"
            :map_options="true"
            :auto_complete="true"
            placeholder="Seleccione centro de costos"
            :disabled="fieldStates.cost_center.disabled"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'El centro de costos es requerido')
            ]"
            @update:model-value="model.cost_center_id = $event"
          />
        </div>

        <!-- Utilidad/Pérdida -->
        <div v-if="fieldStates.utility.show" class="col-12 col-md-4">
          <GenericInput
            :default_value="utilityValue"
            label="Utilidad / Pérdida"
            type="number"
            additional_characters=".-"
            :disabled="fieldStates.utility.disabled"
            placeholder="-"
            @update:model-value="utilityValue = $event != null ? Number($event) : null"
          />
        </div>

        <!-- Responsable -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="responsiblePartyId"
            label="Responsable"
            :required="false"
            :manual_option="thirdPartyOptions"
            :map_options="true"
            :auto_complete="true"
            placeholder="Buscar responsable"
            :disabled="fieldStates.responsible.disabled"
            :rules="[]"
            @update:model-value="responsiblePartyId = $event"
          />
        </div>

        <!-- Impuesto asociado -->
        <div v-if="fieldStates.associated_taxes.show" class="col-12 col-md-4">
          <GenericSelector
            :default_value="associatedTaxes"
            label="Impuesto asociado"
            :required="true"
            :manual_option="associatedTaxOptionsRef"
            :map_options="true"
            :auto_complete="true"
            :multiple="true"
            placeholder="Seleccione impuestos"
            :disabled="fieldStates.associated_taxes.disabled"
            :rules="[
              (v: string[]) =>
                useRules().is_required(v?.length ? 'tiene' : '', 'El impuesto es requerido')
            ]"
            @update:model-value="associatedTaxes = $event"
          />
        </div>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IBuySaleTransactionData } from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useRules } from '@/composables'

// logic
import useSaleInformationForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/InformationForm/Sale/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBuySaleTransactionData | null
  }>(),
  {
    action: 'create',
    data: null
  }
)

const emit = defineEmits<{
  (e: 'update:model', value: unknown): void
}>()

const {
  // Refs
  information_form_ref,
  model,
  associatedTaxes,
  utilityValue,
  responsiblePartyId,
  auditFields,

  // Options
  fixedAssetsForSalesOptions,
  businessTrustOptions,
  thirdPartyOptions,
  configurationTypeOptions,
  filteredSubtypes,
  currencyOptions,
  costCenterOptions,
  assetCategoryOptions,
  associatedTaxOptionsRef,

  // Computed
  isCreateAction,
  fieldStates,

  // Methods
  validateForm,
  getRequestData
} = useSaleInformationForm(props, emit)

defineExpose({
  validateForm,
  getRequestData
})
</script>
