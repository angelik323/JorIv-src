<template>
  <div>
    <!-- Título -->
    <div class="text-start q-mb-lg">
      <h2 class="text-body1 text-dark text-bold q-my-none">
        Información accionaria
      </h2>
    </div>

    <q-form ref="formElementRef">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-xs">
        <div class="col-12 col-md-6">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            Tipo de accionista
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.shareholder_type"
            :manual_option="shareholder_types"
            label="Tipo de accionista"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :map_options="true"
            required
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de accionista es requerido')]"
            @update:modelValue="formValues.shareholder_type = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.shareholder_type ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(formType) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Porcentaje de participación{{
              ['create', 'edit'].includes(formType) ? '*' : ''
            }}
          </p>
          <GenericInputComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.participation_percent"
            required
            :rules=" [ 
              (v: string) => useRules().is_required(v, 'El porcentaje de participación es requerido'),
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 3, 2),
              (v: string) => useRules().max_value(v, 100),
              (v: string) => useRules().min_value(v, 5),
              (v: string) => useRules().not_less_or_equal_to_zero(v)
            ]"
            @update:model-value="formValues.participation_percent = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.participation_percent ?? 'No registrado' }}
          </p>
        </div>

        <div v-if="isLegalPerson" class="col-12">
          <RadioYesNo
            v-model="formValues.has_control_over_legal_entity"
            hasTitle
            title="¿Tiene el control sobre la persona jurídica?"
            :hasSubtitle="false"
            :is-disabled="['view'].includes(formType)"
          />
          <q-separator class="q-mt-xs q-mb-md" color="grey-4" />
        </div>

        <div class="col-12 col-md-6">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            Beneficiario final de la persona jurídica por titularidad
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.beneficial_owner_by_ownership"
            :manual_option="beneficiary_ownerships"
            label="Beneficiario final de la persona jurídica por titularidad"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :map_options="true"
            required
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:modelValue="
              formValues.beneficial_owner_by_ownership = $event
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ formValues.beneficial_owner_by_ownership ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            v-if="['view'].includes(formType)"
            class="text-weight-medium mb-0 text-black-10"
          >
            Beneficiario final de la persona jurídica por beneficiarios
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(formType)"
            :default_value="formValues.beneficial_owner_by_beneficiaries"
            :manual_option="beneficiary_benefits"
            label="Beneficiario final de la persona jurídica por beneficiarios"
            :auto_complete="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :map_options="true"
            required
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:modelValue="
              formValues.beneficial_owner_by_beneficiaries = $event
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formValues.beneficial_owner_by_beneficiaries ?? 'No registrado'
            }}
          </p>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Interfaces
import { IShareholder } from '@/interfaces/customs'

// Composables
import { useRules } from '@/composables'

// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Logic
import { useShareholderInfoForm } from './BasicDataForm'

const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IShareholder | null
    isNaturalPerson: boolean
    isLegalPerson: boolean
  }>(),
  {}
)

const {
  formValues,
  formElementRef,
  shareholder_types,
  beneficiary_ownerships,
  beneficiary_benefits,
} = useShareholderInfoForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
