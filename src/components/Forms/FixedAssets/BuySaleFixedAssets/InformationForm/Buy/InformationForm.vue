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

        <!-- Fecha compra -->
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="model.transaction_date"
            label="Fecha compra"
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

        <!-- Valor compra -->
        <div class="col-12 col-md-4">
          <CurrencyInput
            v-model="model.transaction_value"
            currencyLabel="Valor compra"
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

        <!-- Código placa -->
        <div class="col-12 col-md-4">
          <GenericInput
            :default_value="plateCode"
            label="Código placa"
            :required="true"
            type="text"
            max_length="15"
            placeholder="Ej: ABC-123"
            :disabled="fieldStates.asset_tag_code.disabled"
            :rules="[
              (v: string) => useRules().is_required(v ?? '', 'El código placa es requerido'),
              (v: string) => useRules().max_length(v || '', 15),
              (v: string) => useRules().min_length(v || '', 3),
            ]"
            @update:model-value="plateCode = $event"
          />
        </div>

        <!-- Responsable -->
        <div class="col-12 col-md-4">
          <GenericSelector
            :default_value="responsiblePartyId"
            label="Responsable"
            :required="true"
            :manual_option="thirdPartyOptions"
            :map_options="true"
            :auto_complete="true"
            placeholder="Buscar responsable"
            :disabled="fieldStates.responsible.disabled"
            :rules="[
              (v: number) => useRules().is_required(String(v ?? ''), 'El responsable es requerido')
            ]"
            @update:model-value="responsiblePartyId = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-md q-mt-md">
        <!-- Valorización -->
        <div v-if="fieldStates.has_valoration.show" class="col-12">
          <RadioYesNo
            title="Valorización"
            :has-title="true"
            v-model="model.has_valoration"
            :options="booleanOptions"
            :isDisabled="fieldStates.has_valoration.disabled"
          />
        </div>

        <!-- Depreciación -->
        <div v-if="fieldStates.has_depreciation.show" class="col-12">
          <RadioYesNo
            title="Depreciación"
            :has-title="true"
            v-model="isDepreciationRequired"
            :options="booleanOptions"
            :isDisabled="fieldStates.has_depreciation.disabled"
          />
        </div>

        <!-- Visitas -->
        <div v-if="fieldStates.has_visit.show" class="col-12">
          <RadioYesNo
            :has-title="true"
            title="Visitas"
            v-model="isVisitRequired"
            :options="booleanOptions"
            :isDisabled="fieldStates.has_visit.disabled"
          />
        </div>

        <!-- Descripción -->
        <div v-if="fieldStates.description.show" class="col-12">
          <GenericInput
            :default_value="description"
            label="Descripción"
            :required="false"
            type="textarea"
            max_length="300"
            placeholder="Descripción del activo (opcional)"
            :disabled="fieldStates.description.disabled"
            :rules="[
              (v: string) => !v || useRules().max_length(v, 300),
              (v: string) => !v || useRules().min_length(v, 10),
            ]"
            @update:model-value="description = $event"
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
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IBuySaleTransactionData } from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useRules } from '@/composables'

// logic
import useBuyInformationForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/InformationForm/Buy/InformationForm'

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
  plateCode,
  responsiblePartyId,
  description,
  isDepreciationRequired,
  isVisitRequired,
  auditFields,

  // Options
  businessTrustOptions,
  thirdPartyOptions,
  configurationTypeOptions,
  filteredSubtypes,
  currencyOptions,
  costCenterOptions,
  assetCategoryOptions,
  booleanOptions,

  // Computed
  isCreateAction,
  fieldStates,

  // Methods
  validateForm,
  getRequestData
} = useBuyInformationForm(props, emit)

defineExpose({
  validateForm,
  getRequestData
})
</script>
