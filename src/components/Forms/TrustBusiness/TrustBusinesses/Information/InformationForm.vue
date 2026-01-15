<template>
  <q-form ref="formElementRef">
    <section v-if="['create'].includes(action)">
      <div class="flex justify-center q-col-gutter-x-md">
        <q-radio
          v-model="models.register_type"
          val="Fideicomiso"
          label="Fideicomiso"
          color="orange"
        />

        <q-radio
          v-model="models.register_type"
          val="Sociedad"
          label="Sociedad"
          color="orange"
        />
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section :class="!['create'].includes(action) ? 'q-mt-md' : 'q-mt-lg'">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos generales
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Código negocio{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.business_code"
            type="number"
            required
            :debounce="500"
            :rules="[
              (val: string) =>
                is_required(val, 'El código negocio es requerido'),
              (val: string) => max_length(val, 8),
              (val: string) => not_start_with_zero(val),
              (val: string) => custom_rule(validateCode, 'El código de negocio ya existe')(val),
            ]"
            @update:model-value="models.business_code = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.business_code ?? 'No registrado' }}
          </p>
        </div>

        <!-- Ejemplo nueva estructura label / view -->
        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del negocio"
            :default_value="models.name"
            required
            :rules="[
              (val: string) => is_required(val, 'El nombre es requerido'),
              (val: string) => max_length(val, 50)            ]"
            @update:model-value="models.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Tipo negocio{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.business_type"
            :manual_option="filtered_business_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[(val: string) => is_required(val, 'El tipo de negocio es requerido')]"
            @update:modelValue="
              (val) => {
                models.business_type = val
                models.business_subtype = null
              }
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.business_type ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Subtipo negocio{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.business_subtype"
            :manual_option="filtered_business_subtypes"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :disabled="!models.business_type"
            :rules="[(val: string) => is_required(val, 'El subtipo de negocio es requerido')]"
            @update:modelValue="models.business_subtype = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.business_subtype ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="!isSociety" class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Modalidad negocio{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.business_mod"
            :manual_option="business_trust_mode"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La modalidad del negocio es requerida'),
            ]"
            @update:modelValue="models.business_mod = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.business_mod ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Clasificación negocio{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.classification"
            :manual_option="business_trust_classification"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La clasificación del negocio es requerida'),
            ]"
            @update:modelValue="models.classification = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.classification ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section v-if="!isSociety" class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Fechas generales
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha radicación SFC{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.filing_date_sfc"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha de radicación SFC es requerida'),
              (val: string) => date_before_or_equal_to_the_current_date(val),
            ]"
            @update:modelValue="models.filing_date_sfc = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.filing_date_sfc ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de inicio{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.start_date"
            required
            :disabled="!models.filing_date_sfc"
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha de inicio es requerida'),
              (val: string) =>
                date_after_or_equal_to_specific_date(
                  val,
                  models.filing_date_sfc ?? ''
                ),
            ]"
            @update:modelValue="models.start_date = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.start_date ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha final{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.end_date"
            required
            :navigation_max_year_month="getFutureDateByYears(20)"
            :disabled="!models.start_date"
            :rules="[
              (val: string) => is_required(val, 'La fecha final es requerida'),
              (val: string) =>
                date_after_or_equal_to_specific_date(
                  val,
                  models.start_date ?? ''
                ),
            ]"
            @update:modelValue="models.end_date = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.end_date ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha inicio comisión{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.start_date_commission"
            required
            :disabled="!models.start_date"
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha inicio comisión es requerida'),
              (val: string) =>
                date_after_or_equal_to_specific_date(
                  val,
                  models.start_date ?? ''
                ),
            ]"
            @update:modelValue="models.start_date_commission = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.start_date_commission ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Prórroga{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <q-toggle
            v-model="models.has_extend"
            color="orange"
            :disable="['view'].includes(action)"
          />
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos adicionales
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div v-if="!isSociety" class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Periodicidad rendición de cuentas{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.accountability_period"
            :manual_option="business_trust_periodicity_accountability"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La periodicidad del negocio es requerida'),
            ]"
            @update:modelValue="models.accountability_period = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.accountability_period ?? 'No registrado' }}
          </p>
        </div>

        <div v-else class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de inicio{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.start_date"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha de inicio es requerida'),
            ]"
            @update:modelValue="models.start_date = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.start_date ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Responsable negocio{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.business_manager"
            :manual_option="users"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El responsable del negocio es requerido'),
            ]"
            @update:modelValue="models.business_manager = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.business_manager ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="!isSociety" class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Consorcio{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.consortium"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El consorcio es requerido'),
            ]"
            @update:modelValue="models.consortium = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.consortium ? 'Sí' : 'No' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Maneja presupuesto{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.manage_budget"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: boolean) => is_required_boolean(val, 'Maneja presupuesto es requerido'),
            ]"
            @update:modelValue="models.manage_budget = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.manage_budget ? 'Sí' : 'No' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Maneja contratación derivada{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.derivate_contracting"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: boolean) => is_required_boolean(val, 'Maneja contratación derivada es requerida'),
            ]"
            @update:modelValue="models.derivate_contracting = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.derivate_contracting ? 'Sí' : 'No' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Maneja pólizas{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.has_policy"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: boolean) => is_required_boolean(val, 'Maneja pólizas es requerido'),
            ]"
            @update:modelValue="models.has_policy = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.has_policy ? 'Sí' : 'No' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Maneja garantías{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.has_guarantee"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: boolean) => is_required_boolean(val, 'Maneja garantías es requerido'),
            ]"
            @update:modelValue="models.has_guarantee = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.has_guarantee ? 'Sí' : 'No' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Maneja proyectos inmobiliarios{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.has_real_estate_project"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: boolean) => is_required_boolean(val, ' Maneja proyectos inmobiliarios es requerido'),
            ]"
            @update:modelValue="models.has_real_estate_project = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.has_real_estate_project ? 'Sí' : 'No' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Estado</p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <ShowStatus
            :type="Number(models.status_id ?? 0)"
            status-type="trustBusiness"
          />
        </div>
      </div>
      <q-separator class="q-mt-lg" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { ITrustBusinessResponse } from '@/interfaces/customs'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import useInformationForm from '@/components/Forms/TrustBusiness/TrustBusinesses/Information/InformationForm'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITrustBusinessResponse | null
  }>(),
  {}
)

const emits = defineEmits([
  'validate:form',
  'derivate-changed',
  'update:derivate-contracting',
  'update:manage_budget',
])

const {
  models,
  isSociety,
  formElementRef,
  filtered_business_types,
  filtered_business_subtypes,
  business_trust_mode,
  business_trust_classification,
  business_trust_periodicity_accountability,
  default_yes_no,
  users,

  is_required,
  max_length,
  date_before_or_equal_to_the_current_date,
  date_after_or_equal_to_specific_date,
  getFutureDateByYears,
  validateCode,
  custom_rule,
  not_start_with_zero,
  is_required_boolean,
} = useInformationForm(props)

defineExpose({
  validateForm: async () => {
    return (
      (await formElementRef.value?.validate()) &&
      (await validateCode(models.value.business_code ?? ''))
    )
  },
  getModelsForm: () => models.value,
})
</script>
