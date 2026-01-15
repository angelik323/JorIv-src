<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura contable"
            :default_value="models.account_structure_id"
            :manual_option="account_structures_block"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La estructura contable es requerida')]"
            @update:modelValue="models.account_structure_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estructura contable</p>
            <p class="text-weight-medium no-margin">
              {{ models.account_structure_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código movimiento de tesorería"
            :default_value="models.treasury_movement_code_id"
            :manual_option="treasury_movement_codes"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El código movimiento de tesorería es requerido')]"
            @update:modelValue="models.treasury_movement_code_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Código movimiento de tesorería
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.treasury_movement_code_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          v-if="['create', 'edit'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-3"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre código movimiento"
            :default_value="models.movement_name"
            required
            disabled
            placeholder="-"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del código de movimiento es requerido'),
            ]"
            @update:model-value="models.movement_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre código movimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.movement_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Naturaleza"
            :default_value="models.movement_nature"
            required
            disabled
            placeholder="-"
            :rules="[
              (val: string) => useRules().is_required(val, 'La naturaleza es requerida'),
            ]"
            @update:model-value="models.movement_nature = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Naturaleza</p>
            <p class="text-weight-medium no-margin">
              {{ models.movement_nature ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cuenta contable contrapartida"
            :default_value="models.account_chart_id"
            :manual_option="accounting_account_contrapart"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="!isHandlesAccountingOffset"
            :rules="!isHandlesAccountingOffset 
              ? [(val: string) => useRules().is_required(val, 'La cuenta contable contrapartida es requerida')]
              : []"
            @update:modelValue="models.account_chart_id = $event"
            :disabled="isHandlesAccountingOffset"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Cuenta contable contrapartida
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.account_chart_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de tercero contrapartida"
            :default_value="models.third_type"
            :manual_option="third_type"
            map_options
            auto_complete
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de tercero contrapartida es requerido')]"
            @update:modelValue="models.third_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Tipo de tercero contrapartida
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.third_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tercero"
            :default_value="models.third_party_id"
            :manual_option="third_party_nit"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="models.third_type !== 'Específico'"
            :rules="models.third_type !== 'Específico'
              ? [(val: string) => useRules().is_required(val, 'El tercero es requerido')]
              : []"
            @update:modelValue="models.third_party_id = $event"
            :disabled="models.third_type !== 'Específico'"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tercero</p>
            <p class="text-weight-medium no-margin">
              {{ models.third_party_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-model="models.movement_funds_processes"
            :isRadioButton="false"
            :hasTitle="true"
            :title="'¿Movimiento para procesos de fondos?'"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
          />
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            action === 'view' ? 'col-md-4' : 'col-md-8',
          ]"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código Movimiento Fondos"
            :default_value="models.code_movement_funds"
            :manual_option="movements"
            map_options
            auto_complete
            first_filter_option="label"
            second_filter_option="label"
            :required="isMovementFundsProcesses"
            :rules="isMovementFundsProcesses
              ? [(val: string) => useRules().is_required(val, 'El código movimiento de fondos es requerido')]
              : []"
            @update:modelValue="models.code_movement_funds = $event"
            :disabled="!isMovementFundsProcesses"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código Movimiento Fondos</p>
            <p class="text-weight-medium no-margin">
              {{ models.code_movement_funds ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-model="models.gmf_associate_affects"
            :isRadioButton="false"
            :hasTitle="true"
            :title="'¿GMF Asociado Afecta Fondo?'"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action) || !isMovementFundsProcesses"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-model="models.demand_investment_plan"
            :isRadioButton="false"
            :hasTitle="true"
            :title="'¿Exige Plan de Inversión?'"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action) || !isMovementFundsProcesses"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-model="models.amortizes_funds"
            :isRadioButton="false"
            :hasTitle="true"
            :title="'¿Amortiza en los fondos?'"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action) || !isMovementFundsProcesses"
          />
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
import { IAccountingBlockInformationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAccountingBlockInformationForm | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formElementRef,
  account_structures_block,
  treasury_movement_codes,
  accounting_account_contrapart,
  third_type,
  third_party_nit,
  movements,
  isHandlesAccountingOffset,
  isMovementFundsProcesses,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
