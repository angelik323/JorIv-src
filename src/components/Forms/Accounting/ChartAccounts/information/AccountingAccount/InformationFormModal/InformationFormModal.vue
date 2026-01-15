<template>
  <q-form ref="formInformationModal">
    <div class="mx-3 mt-0 mb-3">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none mt-2">
          Agregar cuenta contable
        </p>
      </div>
      <div class="row q-col-gutter-lg mt-1">
        <div class="col-xs-12 col-sm-6 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Código cuenta contable{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.code"
            :disabled="'edit'.includes(action)"
            :rules="[
                (v: string) => useRules().is_required(v, 'El código de cuenta es requerido'),
                (v: string) => useRules().no_consecutive_spaces(v),        
                (v: string) => useRules().only_number(v),
                (v: string) => useRules().max_length(v, 20),
                (v: string) => useRules().not_start_with_zero(v),
              ]"
            @update:model-value="models.code = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.code ?? 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Nombre de la cuenta{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :required="true"
            :default_value="models.name"
            :rules="[
                (v: string) => useRules().is_required(v, 'El nombre de la cuenta es requerido'),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 250),
                (v: string) =>useRules().no_consecutive_spaces(v),
              ]"
            @update:model-value="models.name = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.name ?? 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 q-pt-none">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Tipo{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="account_chart_types"
            :map_options="true"
            :first_filter_option="'label'"
            :second_filter_option="'code'"
            :required="true"
            :default_value="models.type"
            :auto_complete="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de cuenta es requerido')]"
            :disabled="'edit'.includes(action)"
            @update:model-value="models.type = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.type ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <div class="col-12 q-pt-none">
        <RadioYesNo
          class="q-pt-md q-pl-sm"
          hasTitle
          title="Naturaleza*"
          :hasSubtitle="false"
          :is-disabled="['view', 'edit'].includes(action)"
          :titleRadioTrue="'Débito'"
          :titleRadioFalse="'Crédito'"
          v-model="models.nature"
        />
      </div>
      <q-separator class="q-mt-sm" />

      <div class="col-12 q-pt-none">
        <RadioYesNo
          class="q-pt-md q-pl-sm"
          hasTitle
          title="Estado*"
          :hasSubtitle="false"
          :is-disabled="['view'].includes(action)"
          :titleRadioTrue="'Activo'"
          :titleRadioFalse="'Inactivo'"
          v-model="models.status_id"
        />
      </div>
      <q-separator class="q-mt-sm" />

      <div class="col-12 q-pt-none">
        <RadioYesNo
          class="q-pt-md q-pl-sm"
          hasTitle
          title="Centro de costos*"
          :hasSubtitle="false"
          :is-disabled="['view'].includes(action)"
          v-model="models.has_cost_center"
        />
      </div>
      <q-separator class="q-mt-sm" />

      <div class="col-12 q-pt-none">
        <RadioYesNo
          class="q-pt-md q-pl-sm"
          hasTitle
          title="Base de retenciones ICA por ingresos*"
          :hasSubtitle="false"
          :is-disabled="['view'].includes(action)"
          v-model="models.applies_ica_withholding_income"
        />
      </div>
      <q-separator class="q-mt-sm" />

      <div class="col-12 q-pt-none">
        <RadioYesNo
          class="q-pt-md q-pl-sm"
          hasTitle
          title="Base de retención utilidades*"
          :hasSubtitle="false"
          :is-disabled="['view'].includes(action)"
          v-model="models.applies_withholding_profits"
        />
      </div>
      <q-separator class="q-mt-sm" />

      <div class="col-12 q-pt-none">
        <RadioYesNo
          class="q-pt-md q-pl-sm"
          hasTitle
          title="Reexpresa moneda*"
          :hasSubtitle="false"
          :is-disabled="['view'].includes(action)"
          v-model="models.is_currency_reexpressed"
        />
      </div>
      <q-separator class="q-mt-sm" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// interfaces
import { IChartAccount } from '@/interfaces/customs'

// logic view
import useInformationFormModal from './InformationFormModal'

// composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: IChartAccount | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, formInformationModal, account_chart_types } =
  useInformationFormModal(props)

defineExpose({
  validateForm: () => formInformationModal.value?.validate(),
})
</script>
