<template>
  <section>
    <q-form ref="cxp_trust_business_form_ref">
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cierre"
            placeholder="Seleccione una opción"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.closing"
            :manual_option="accounts_payable_closing"
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

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha último cierre"
            :default_value="models.last_closing_date"
            :rules="models.closing ? [
              (v: string) => useRules().is_required(v, 'La fecha del último cierre es requerida'),
            ] : []"
            :required="true"
            @update:model-value="models.last_closing_date = $event"
            :option_calendar="
              models.closing === 'Mensual' ? only_last_day_month : undefined
            "
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Fecha último cierre
            </p>
            <p class="text-grey-6 mb-0">
              {{ models.last_closing_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Vigencia"
            :default_value="models.validity"
            :rules="[]"
            :required="true"
            @update:model-value="models.validity = $event"
            disabled
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">Vigencia</p>
            <p class="text-grey-6 mb-0">
              {{ models.validity ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura concepto de pago"
            placeholder="Seleccione una opción"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.account_structure_id"
            :manual_option="payment_concept_structure"
            @update:model-value="models.account_structure_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'La estrucutura es requerida'),
            ]"
          />
          <div v-else>
            <p class="text-weight-medium mb-0 text-black-10">
              Estructura concepto de pago
            </p>
            <p class="text-grey-6 mb-0">
              {{
                `${models.account_structure_id} - ${models.account_structure_purpose}` ||
                'No registrado'
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
    data?: IBusinessCxPTrustBusiness | null
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:models', value: IBusinessCxPTrustBusiness) => void>()

// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// logic
import useCxPTrustBusiness from './CxPTrustBusiness'

// composables
import { useRules } from '@/composables'

// interfaces
import { IBusinessCxPTrustBusiness } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global'

const {
  models,
  cxp_trust_business_form_ref,
  accounts_payable_closing,
  payment_concept_structure,
  only_last_day_month,
} = useCxPTrustBusiness(props, emits)

defineExpose({
  validateForm: () => cxp_trust_business_form_ref.value?.validate(),
})
</script>
