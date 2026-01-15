<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div
        :class="[
          'row q-col-gutter-x-lg',
          action.includes('view') ? 'q-col-gutter-y-lg' : 'q-col-gutter-y-sm',
        ]"
      >
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código recaudo"
            :default_value="models.accounting_blocks_collection_code"
            :required="true"
            disabled
            placeholder="-"
            :rules="[(v: string) => useRules().is_required(v, 'El campo Código recaudo es requerido')]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código recaudo</p>
            <p class="text-weight-medium no-margin">
              {{ models.accounting_blocks_collection_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            :default_value="models.description"
            :required="true"
            placeholder="-"
            disabled
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo Descripción es requerido'),
              (v: string) => useRules().max_length(v, 50),
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cuenta contable partida"
            :default_value="models.account_chart_id"
            :manual_option="operational_account_charts"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La cuenta contable contrapartida es requerida')]"
            @update:modelValue="models.account_chart_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Cuenta contable partida</p>
            <p class="text-weight-medium no-margin">
              {{ models.account_chart_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Centro de costo"
            :default_value="models.cost_center_id"
            :manual_option="operational_cost_centers"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[(val: string) => useRules().is_required(val, 'El centro de costo es requerido')]"
            @update:modelValue="models.cost_center_id = $event"
            :disabled="isCostCenterDisabled"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Centro de costo</p>
            <p class="text-weight-medium no-margin">
              {{ models.cost_center_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo tercero"
            :default_value="models.third_party_type"
            :manual_option="third_party_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo tercero es requerido')]"
            @update:modelValue="models.third_party_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo tercero</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tercero"
            :default_value="models.third_party_id"
            :manual_option="third_parties"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tercero es requerido')]"
            @update:modelValue="models.third_party_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tercero</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 column items-start">
          <p
            :class="
              ['view'].includes(action)
                ? 'text-black-90 text-weight-bold no-margin'
                : 'text-grey-7 text-weight-medium no-margin'
            "
          >
            Distribuye % negocio
          </p>
          <RadioYesNo
            v-model="models.distributes_business_percentage"
            :hasTitle="false"
            :isRadioButton="true"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Flujo de caja"
            :default_value="models.cash_flow_structure_id"
            :manual_option="cash_flow_structures"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El flujo de caja es requerido')]"
            @update:modelValue="models.cash_flow_structure_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Flujo de caja</p>
            <p class="text-weight-medium no-margin">
              {{ models.cash_flow_structure_code ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'
import {
  IAccountingParametersCollectionsForm,
  IAccountingParametersCollections,
} from '@/interfaces/customs'
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?:
      | IAccountingParametersCollectionsForm
      | IAccountingParametersCollections
      | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formElementRef,
  operational_account_charts,
  operational_cost_centers,
  cash_flow_structures,
  third_party_types,
  third_parties,
  isCostCenterDisabled,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
