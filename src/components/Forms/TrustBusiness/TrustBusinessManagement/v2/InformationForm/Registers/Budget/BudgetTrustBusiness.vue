<template>
  <section>
    <q-form ref="budget_trust_business_form_ref">
      <p class="font-size-1 text-weight-bold">Parámetros</p>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura presupuestal"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.budget_structure_id"
            :manual_option="budget_structures_area"
            @update:model-value="models.budget_structure_id = $event"
            :rules="[
    (v: string) => useRules().is_required(v, 'Estructura presupuestal requerida'),
  ]"
          />
          <div v-else class="no-margin">
            <p>Estructura presupuestal</p>
            <p class="text-weight-medium no-margin">
              {{ models.budget_structure?.code_name || 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Área genérica"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.generic_area_id"
            :manual_option="areas_resposabilities_codes"
            @update:model-value="models.generic_area_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'La área genérica es requerida'),
            ]"
          />
          <div v-else class="no-margin">
            <p>Área genérica</p>
            <p class="text-weight-medium no-margin">
              {{ models.generic_area_code }} - {{ models.generic_area }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Vigencia"
            mask="YYYY"
            :placeholder="`AAAA`"
            :default_value="models.validity"
            @update:model-value="models.validity = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El año es requerido'),
            ]"
          />

          <div v-else class="no-margin">
            <p>Vigencia</p>
            <p class="text-weight-medium no-margin">
              {{ models.validity ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Mes actual"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.current_month"
            :manual_option="monthList"
            display_label="label"
            @update:model-value="models.current_month = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El mes actual es requerido'),
            ]"
          />
          <div v-else class="no-margin">
            <p>Mes actual</p>
            <p class="text-weight-medium no-margin">
              {{ models.current_month ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Última fecha de cierre"
            :default_value="models.last_closing_date"
            :disabled="action === 'edit'"
            :rules="models.last_closing_date ? [
              (v: string) => useRules().is_required(v, 'La última fecha de cierre es requerida'),
            ] : []"
            @update:model-value="models.last_closing_date = $event"
          />
          <div v-else class="no-margin">
            <p>Última fecha de cierre</p>
            <p class="text-weight-medium no-margin">
              {{ models.last_closing_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de cierre"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.closing_type"
            :manual_option="clousings"
            @update:model-value="models.closing_type = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El tipo de cierre es requerido'),
            ]"
          />
          <div v-else class="no-margin">
            <p>Tipo de cierre</p>
            <p class="text-weight-medium no-margin">
              {{ closingTypeLabel ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código de sección MHCP"
            :placeholder="`Seleccione una opción `"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.mhcp_section_code"
            :manual_option="budget_mhcp_codes"
            @update:model-value="models.mhcp_section_code = $event"
            :rules="[
              (v: string) => useRules().is_required( v,'El código de sección MHCP es requerido'),
            ]"
          />
          <div v-else class="no-margin">
            <p>Código de sección MHCP</p>
            <p class="text-weight-medium no-margin">
              {{
                `${models.mhcp_section_code} - ${models.mhcp_section_description}`
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Ordenador del gasto"
            :placeholder="`Seleccione una opción`"
            :required="true"
            auto_complete
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="models.expense_authorizer_id"
            :manual_option="business_trust_third_parties"
            @update:model-value="models.expense_authorizer_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El ordenador del gasto es requerido'),
            ]"
          />
          <div v-else class="no-margin">
            <p>Ordenador del gasto</p>
            <p class="text-weight-medium no-margin">
              {{
                `${models.expense_authorizer?.document_type.abbreviation}-${models.expense_authorizer?.document}-${models.expense_authorizer?.name}`
              }}
            </p>
          </div>
        </div>
      </div>
    </q-form>
  </section>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

//Interfaces
import { IBusinessBudget } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useBudgetTrustBusiness from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/Budget/BudgetTrustBusiness'

const props = defineProps<{
  action: ActionType
  data?: IBusinessBudget | null
}>()

const emits =
  defineEmits<(e: 'update:models', value: IBusinessBudget) => void>()

const {
  models,
  budget_trust_business_form_ref,
  areas_resposabilities_codes,

  clousings,
  budget_mhcp_codes,
  business_trust_third_parties,
  closingTypeLabel,
  monthList,
  budget_structures_area,
} = useBudgetTrustBusiness(props, emits)

defineExpose({
  validateForm: () => budget_trust_business_form_ref.value?.validate(),
})
</script>
