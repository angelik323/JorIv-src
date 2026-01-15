<template>
  <section v-if="!isLoading">
    <q-form ref="informationFormRef">
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            disabled
            label="Fecha de creación"
            :default_value="models?.created_at"
            :rules="[]"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Fecha de creación</p>
            <p>
              {{ models?.created_at ?? 'Sin fecha' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action === 'edit'"
            disabled
            label="Creado por"
            :default_value="models?.created_by_name"
            :rules="[]"
          />
          <div v-else-if="action === 'view'">
            <p class="q-mb-sm text-weight-bold">Creado por</p>
            <p>
              {{ models?.created_by_name ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action === 'edit' && models?.updated_at"
            disabled
            label="Fecha de actualización"
            :default_value="models?.updated_at"
            :rules="[]"
          />
          <div v-else-if="action === 'view'">
            <p class="q-mb-sm text-weight-bold">Fecha de actualización</p>
            <p>
              {{ models?.updated_at ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action === 'edit' && models?.updated_by_name"
            disabled
            label="Actualizado por"
            :default_value="models?.updated_by_name"
            :rules="[]"
          />
          <div v-else-if="action === 'view'">
            <p class="q-mb-sm text-weight-bold">Actualizado por</p>
            <p>
              {{ models?.updated_by_name ?? 'Sin información' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mb-lg" />
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <RadioYesNo
            :model-value="is_minor_amount"
            required
            disabled
            :options="AMOUNT_UVT_OPTIONS"
            :is-disabled="true"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Tipo de registro"
            map_options
            first_filter_option="label"
            auto_complete
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="models?.record_type"
            :manual_option="fixed_asset_record_type"
            @update:modelValue="models.record_type = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Tipo de registro</p>
            <p>
              {{ models?.record_type ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Referencia activos fijo o bien"
            map_options
            first_filter_option="label"
            auto_complete
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="models?.reference"
            :manual_option="fixed_asset_reference"
            @update:modelValue="models.reference = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Referencia activos fijo o bien</p>
            <p>
              {{ models?.reference ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Tipo de bien o activo fijo"
            map_options
            first_filter_option="label"
            auto_complete
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="models?.asset_type"
            :manual_option="configuration_type"
            @update:modelValue="models.configuration_type_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Tipo de bien o activo fijo</p>
            <p>
              {{ models?.asset_type ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Subtipo de bien o activo fijo"
            map_options
            first_filter_option="label"
            auto_complete
            :disabled="!models.configuration_type_id"
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="models?.asset_subtype"
            :manual_option="filteredSubtypes"
            @update:modelValue="models.configuration_subtype_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Subtipo de bien o activo fijo</p>
            <p>
              {{
                models?.configuration_subtype?.code +
                '- ' +
                models?.configuration_subtype?.description
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Negocio"
            map_options
            first_filter_option="label"
            auto_complete
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="models.business_trust_description"
            :manual_option="business_trusts"
            @update:modelValue="models.business_trust_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Negocio</p>
            <p>
              {{ models?.business_trust?.name ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Compras"
            map_options
            first_filter_option="label"
            auto_complete
            :disabled="models.record_type !== 'Compra'"
            :rules="[]"
            :default_value="models?.purchase"
            :manual_option="transactions_configuration_subtypes"
            @update:modelValue="models.asset_transaction_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Compras</p>
            <p>
              {{ models?.transaction?.description ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            disabled
            label="Sociedad"
            placeholder="N/A"
            :default_value="models?.society"
            :rules="[]"
            @update:modelValue="models.business_trust_code = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Sociedad</p>
            <p>
              {{ models?.business_trust?.business_code ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            disabled
            label="Fecha"
            :default_value="formatDate(models?.created_at as string, 'YYYY-MM-DD')"
            :rules="[]"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Fecha</p>
            <p>
              {{ formatDate(models?.created_at as string, 'YYYY-MM-DD') }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Número chip"
            placeholder="-"
            :default_value="models?.chip_code"
            :rules="[(val:string) => min_length(val, 5), (val:string) => max_length(val, 15)]"
            :disabled="assetClass != 'Inmueble (INM)'"
            @update:modelValue="models.chip_code = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Número chip</p>
            <p>
              {{ models?.chip_code ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Número de cédula catastral"
            placeholder="-"
            :default_value="models?.cadastral_id"
            :rules="[(val:string) => min_length(val, 5), (val:string) => max_length(val, 15)]"
            :disabled="assetClass !== 'Inmueble (INM)'"
            @update:modelValue="models.cadastral_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Número de cédula catastral</p>
            <p>
              {{ models?.cadastral_id ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Números de folio"
            placeholder="-"
            type="number"
            :default_value="models?.folio_number"
            :rules="[(val:string) => min_length(val, 5), (val:string) => max_length(val, 12)]"
            :disabled="assetClass !== 'Inmueble (INM)'"
            @update:modelValue="models.folio_number = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Números de folio</p>
            <p>
              {{ models?.folio_number ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Número de placa"
            placeholder="-"
            :default_value="models?.license_plate"
            :rules="[(val:string) => min_length(val, 5), (val:string) => max_length(val, 10)]"
            :disabled="assetType !== 'Activo Fijo'"
            @update:modelValue="models.license_plate = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Número de placa</p>
            <p>
              {{ models?.license_plate ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Números de chasis"
            placeholder="-"
            :default_value="models?.chassis_number"
            :rules="[(val:string) => min_length(val, 5), (val:string) => max_length(val, 17)]"
            :disabled="models?.reference !== 'Vehículo'"
            @update:modelValue="models.chassis_number = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Números de chasis</p>
            <p>
              {{ models?.chassis_number ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Responsable del activo"
            map_options
            first_filter_option="label"
            auto_complete
            :rules="[]"
            :default_value="models?.responsible_id"
            :manual_option="formated_third_parties"
            @update:modelValue="models.responsible_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Responsable del activo</p>
            <p>
              {{ models?.responsible_document ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Ubicación del activo fijo o bien"
            map_options
            first_filter_option="label"
            auto_complete
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="models.location_id"
            :manual_option="formated_locations"
            @update:modelValue="models.location_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Ubicación del activo fijo o bien</p>
            <p>
              {{ models?.location?.address ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            label="Estado activo fijo o bien"
            map_options
            first_filter_option="label"
            auto_complete
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="models.status_id"
            :manual_option="fixed_asset_statuses"
            @update:modelValue="models.status_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Estado activo fijo o bien</p>
            <p>
              {{ models?.status_id ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Porcentaje de garantía"
            placeholder="-"
            :required="models.status_id === 62"
            :disabled="models.status_id !== 62"
            :default_value="models?.guarantee_percentage"
            :rules="[
                ...(models.status_id === 62 
                  ? [(val:string) => is_required(val, 'Diligencie campo obligatorio')] 
                  : []
                ),
                (val:string) => max_integer_decimal(val, 3, 2)
            ]"
            @update:modelValue="models.guarantee_percentage = $event"
            @update:blur="formatGuaranteePercentage"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Porcentaje de garantía</p>
            <p>
              {{ models?.guarantee_percentage ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="assetValue"
            label="Valor activo fijo o bien"
            :disabled="!isTransferOrDonation"
            :required="isTransferOrDonation"
            placeholder="-"
            :currency="models.account?.functional_business_currency ?? 'COP'"
            :precision="0"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Valor activo fijo o bien</p>
            <p>
              {{
                `${models.account?.functional_business_currency ?? 'COP'} ${numberToMoneyFormat(
                  Number(assetValue)
                )}`
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="countableValue"
            label="Valor contable activo fijo o bien"
            :disabled="!isTransferOrDonation"
            :required="isTransferOrDonation"
            placeholder="-"
            :currency="models.account?.functional_business_currency ?? 'COP'"
            :precision="0"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Valor contable activo fijo o bien</p>
            <p>
              {{
                `${models.account?.functional_business_currency ?? 'COP'} ${numberToMoneyFormat(
                  Number(countableValue)
                )}`
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            class="date-mm-dd"
            label="Fecha predial / impuesto"
            mask="MM-DD"
            placeholder="MM-DD"
            :disabled="!['Vehículo', 'Finca raíz'].includes((models.reference as string) ?? '')"
            :default_value="models?.property_tax_date"
            :rules="[]"
            @update:modelValue="models.property_tax_date = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Fecha predial / impuesto</p>
            <p>
              {{ models?.property_tax_date ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="UGE"
            required
            map_options
            first_filter_option="label"
            auto_complete
            :disabled="filteredUge.length == 0"
            :rules="[]"
            :default_value="models.cash_generating_unit_id"
            :manual_option="filteredUge"
            @update:modelValue="models.cash_generating_unit_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">UGE</p>
            <p>
              {{ models?.uge?.description ?? 'N/A' }}
            </p>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-lg-3 flex flex-col items-center justify-between"
        >
          <p class="q-mt-md text-black-60">Depreciación</p>
          <RadioYesNo
            :model-value="hasDepreciation"
            required
            disabled
            :options="HAS_DEPRECIATION_OPTIONS"
            :is-disabled="props.action === 'view' || isDepreciationDisabled"
          />
        </div>
        <div v-if="hasDepreciation" class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Cuenta contable depreciación"
            required
            map_options
            first_filter_option="label"
            auto_complete
            :disabled="filteredUge.length == 0"
            :rules="[]"
            :default_value="models.cash_generating_unit_id"
            :manual_option="filteredUge"
            @update:modelValue="models.cash_generating_unit_id = $event"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Cuenta contable depreciación</p>
            <p>
              {{ models?.uge?.description ?? 'N/A' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mb-lg" />
      <div class="row items-center q-col-gutter-sm justify-between">
        <div class="col-auto">
          <p class="text-black-90 text-weight-bold text-h7 q-mb-none">Modelo medición</p>
        </div>
        <div class="col-auto">
          <RadioYesNo
            v-model="models.measurement_model"
            required
            :rules="[(val:string) => is_required(val, 'Diligencie campo obligatorio')]"
            :has-title="false"
            :options="fixed_asset_measurement_model"
            :is-disabled="props.action === 'view'"
          />
        </div>
      </div>
    </q-form>
    <AssetContributors ref="assetsContributorsRef" v-model="assetsContributorsFormData" :action />
  </section>
</template>
<script setup lang="ts">
// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import AssetContributors from '@/components/Forms/FixedAssets/Register/InformationForm/AssetContributors/AssetContributors.vue'

// constants
import { AMOUNT_UVT_OPTIONS, HAS_DEPRECIATION_OPTIONS } from '@/constants/resources/fixed-assets'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IRegisterForm } from '@/interfaces/customs/fixed-assets/v1/Register'

// logic
import useInformationForm from '@/components/Forms/FixedAssets/Register/InformationForm/InformationForm'

// utils
import { numberToMoneyFormat } from '@/utils'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IRegisterForm | null
  }>(),
  {}
)

const emits = defineEmits<(e: 'update:models', value: IRegisterForm) => void>()

const {
  isLoading,
  informationFormRef,
  assetsContributorsRef,
  filteredSubtypes,
  formated_locations,
  formated_third_parties,
  fixed_asset_statuses,
  fixed_asset_record_type,
  transactions_configuration_subtypes,
  business_trusts,
  fixed_asset_reference,
  configuration_type,
  filteredUge,
  fixed_asset_measurement_model,
  is_minor_amount,

  models,
  assetsContributorsFormData,
  assetClass,
  assetType,
  hasDepreciation,
  isDepreciationDisabled,
  isTransferOrDonation,
  assetValue,
  countableValue,
  formatGuaranteePercentage,

  formatDate,
  validateForm,

  is_required,
  min_length,
  max_length,
  max_integer_decimal
} = useInformationForm(props, emits)

defineExpose({
  validateForm
})
</script>
