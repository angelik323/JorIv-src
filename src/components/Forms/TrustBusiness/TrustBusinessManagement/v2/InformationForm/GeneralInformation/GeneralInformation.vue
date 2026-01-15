<template>
  <section>
    <q-form ref="general_information_ref">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos generales
        </p>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código negocio"
            :default_value="models.business_code"
            type="number"
            required
            :debounce="500"
            :readonly="is_edit"
            :rules="[
              (val: string) =>
                is_required(val, 'El código negocio es requerido'),
              (val: string) => max_length(val, 6),
              (val: string) => not_start_with_zero(val),
              (val: string) => custom_rule(validateCode, 'El código de negocio ya existe')(val),
            ]"
            @update:model-value="models.business_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_code ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del negocio"
            :default_value="models.name"
            required
            :readonly="is_edit"
            :rules="[
              (val: string) => is_required(val, 'El nombre es requerido'),
              (val: string) => max_length(val, 50)            ]"
            @update:model-value="models.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Tipo negocio'"
            :default_value="models.business_type_id"
            :manual_option="filtered_business_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[(val: string) => is_required(val, 'El tipo de negocio es requerido')]"
            @update:modelValue="
              (val) => {
                models.business_type_id = val
                models.business_subtype_id = null
              }
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_type_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Subtipo negocio'"
            :default_value="models.business_subtype_id"
            :manual_option="filtered_business_subtypes"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="not_active_subtype ? false : true"
            :readonly="
              !models.business_type_id || is_edit || not_active_subtype
            "
            :rules="not_active_subtype ? [] : [(val: string) => is_required(val, 'El subtipo de negocio es requerido')]"
            @update:modelValue="models.business_subtype_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Subtipo negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_subtype_id ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4"
          v-if="!props.isSociety"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Modalidad negocio'"
            :default_value="models.business_mod"
            :manual_option="business_trust_mode"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="props.isSociety ? false : true"
            :readonly="is_edit"
            :rules="[
              (val: string) =>
                is_required(val, 'La modalidad del negocio es requerida'),
            ]"
            @update:modelValue="models.business_mod = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_mod ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Clasificación negocio'"
            :default_value="models.classification"
            :manual_option="business_trust_classification"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: string) =>
                is_required(val, 'La clasificación del negocio es requerida'),
            ]"
            @update:modelValue="models.classification = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clasificación negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.classification ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Oficina'"
            :default_value="models.office_id"
            :manual_option="business_offices"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'La oficina del negocio es requerida'),
            ]"
            @update:modelValue="models.office_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Oficina</p>
            <p class="text-weight-medium no-margin">
              {{ models.office_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Objeto"
            :default_value="models.object"
            required
            :readonly="is_edit"
            :rules="[
              (val: string) => is_required(val, 'El objeto es requerido'),
              (val: string) => max_length(val, 1000)            ]"
            @update:model-value="models.object = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Objeto</p>
            <p class="text-weight-medium no-margin">
              {{ models.object ?? '-' }}
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
    data?: ITrustBusinessGeneralInformation | null
    isSociety: boolean
    status_id: number
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:models', value: ITrustBusinessGeneralInformation) => void
  >()

// components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// logic-view
import useGeneralInformation from './GeneralInformation'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ITrustBusinessGeneralInformation } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

const {
  models,
  general_information_ref,
  filtered_business_types,
  filtered_business_subtypes,
  business_trust_mode,
  business_trust_classification,
  business_offices,
  is_edit,
  not_active_subtype,

  validateCode,

  // rules
  is_required,
  max_length,
  not_start_with_zero,
  custom_rule,
} = useGeneralInformation(props, emits)

defineExpose({
  validateForm: async () => await general_information_ref.value?.validate(),
})
</script>
