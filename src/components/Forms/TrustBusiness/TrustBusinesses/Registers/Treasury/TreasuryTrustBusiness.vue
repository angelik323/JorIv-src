<template>
  <section>
    <q-form ref="treasury_trust_business_form_ref">
      <p class="font-size-1 text-weight-bold">Parámetros</p>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cierre"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.closing"
            :manual_option="close_treasurie"
            @update:model-value="models.closing = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El cierre es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Cierre</p>
            <p class="text-grey-6 mb-0">
              {{ models.closing ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha último cierre"
            :default_value="models.last_close_date"
            :rules="models.closing ? [
              (v: string) => useRules().is_required(v, 'La fecha del último cierre es requerida'),
            ] : []"
            :required="true"
            @update:model-value="models.last_close_date = $event"
            :option_calendar="
              models.closing === 'Cierre mensual'
                ? only_last_day_month
                : undefined
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Fecha último cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.last_close_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Flujo de caja"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.has_cash_flow"
            :manual_option="default_yes_no"
            @update:model-value="models.has_cash_flow = $event"
            :rules="[
              (v: boolean) => useRules().is_required_boolean(v, 'El flujo de caja es requerido'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Flujo de caja</p>
            <p class="text-grey-6 mb-0">
              {{ models.has_cash_flow ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura flujo de caja"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.cash_flow_structure_id"
            :manual_option="models.has_cash_flow ? cash_flow_structures : []"
            :disabled="!models.has_cash_flow"
            @update:model-value="models.cash_flow_structure_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'La estructura del flujo de caja es requerida'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura flujo de caja
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.cash_flow_structure?.purpose ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Conciliación bancaria"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.can_bank_reconciliation"
            :manual_option="default_yes_no"
            @update:model-value="models.can_bank_reconciliation = $event"
            :rules="[
              (v: boolean) => useRules().is_required_boolean(v, 'La conciliación bancaria es requerida'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Conciliación bancaria
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.can_bank_reconciliation ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha última conciliación"
            :default_value="models.last_conciliation_date"
            :rules="models.can_bank_reconciliation === true ? [
              (v: string) => useRules().is_required(v, 'La fecha es requerida'),
            ] : []"
            :required="models.can_bank_reconciliation === true"
            :disabled="models.can_bank_reconciliation !== true"
            @update:model-value="models.last_conciliation_date = $event"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Fecha última conciliación
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.last_conciliation_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Maneja estructura de recaudo"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.has_collection_structure"
            :manual_option="default_yes_no"
            @update:model-value="models.has_collection_structure = $event"
            :rules="[
              (v: boolean) => useRules().is_required_boolean(v, 'La estructura de recaudo es requerida'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Maneja estructura de recaudo
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.has_collection_structure ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura de recaudo"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.collection_structure_id"
            :manual_option="
              models.has_collection_structure ? collection_structure : []
            "
            :disabled="!models.has_collection_structure"
            @update:model-value="models.collection_structure_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'La estructura de recaudo es requerida'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura de recaudo
            </p>
            <p class="text-grey-6 mb-0">
              {{
                `${models.collection_structure?.code} - ${models.collection_structure?.purpose}`
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Maneja estructura de caja"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.has_box_structure"
            :manual_option="default_yes_no"
            @update:model-value="models.has_box_structure = $event"
            :rules="[
              (v: boolean) => useRules().is_required_boolean(v, 'La estructura de caja es requerida'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Maneja estructura de caja
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.has_box_structure ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura de caja"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.box_structure_id"
            :manual_option="
              models.has_box_structure ? cash_flow_structures : []
            "
            :disabled="!models.has_box_structure"
            @update:model-value="models.box_structure_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'La estructura de caja es requerida'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura de caja
            </p>
            <p class="text-grey-6 mb-0">
              {{
                `${models.box_structure?.code} - ${models.box_structure?.purpose}`
              }}
            </p>
          </div>
        </div>
      </div>
    </q-form>
  </section>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBusinessTreasury | null
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:models', value: IBusinessTreasury) => void>()

// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Logic
import useTreasuryTrustBusiness from './TreasuryTrustBusiness'

// Composables
import { useRules } from '@/composables'
import { IBusinessTreasury } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global'

const {
  models,
  close_treasurie,
  cash_flow_structures,
  default_yes_no,
  treasury_trust_business_form_ref,
  collection_structure,
  only_last_day_month,
} = useTreasuryTrustBusiness(props, emits)

defineExpose({
  getModelsForm: () => models.value,
  validateForm: () => treasury_trust_business_form_ref.value?.validate(),
})
</script>
