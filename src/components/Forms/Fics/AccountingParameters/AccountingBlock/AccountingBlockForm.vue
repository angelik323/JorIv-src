<template>
  <q-form ref="accountingBlockFormElementRef" class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-12 col-md-6">
        <GenericInput
          disabled
          label="Consecutivo"
          :default_value="models.consecutive"
          placeholder="-"
          :required="true"
          @update:model-value="models.consecutive = $event"
          :rules="[
                (v: string) => useRules().is_required(v, 'El campo Consecutivo es requerido'),
              ]"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6">
        <GenericSelectorComponent
          label="Grupo de negocio"
          :default_value="models.business_group_id"
          :manual_option="business_trust_types"
          map_options
          first_filter_option="label"
          second_filter_option="label"
          auto_complete
          :required="true"
          :rules="[
                (v: string) => useRules().is_required(v, 'El campo Grupo de negocio es requerido'),
                (v: string) => useRules().min_length(v, 1),
                (v: string) => useRules().max_length(v, 4),
              ]"
          @update:model-value="models.business_group_id = $event"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6">
        <GenericSelectorComponent
          label="Plan contable"
          :default_value="models.accounting_plan_id"
          :manual_option="account_structures"
          map_options
          first_filter_option="label"
          second_filter_option="label"
          auto_complete
          :required="true"
          :rules="[
                  (v: string) =>
                  useRules().is_required(v, 'El campo Plan contable es requerido'),
                  (v: string) => useRules().min_length(v, 1),
                  (v: string) => useRules().max_length(v, 4),
              ]"
          @update:model-value="models.accounting_plan_id = $event"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6">
        <GenericSelectorComponent
          label="Centro de costos del plan"
          :default_value="models.plan_cost_center_id"
          :manual_option="cost_centers_structures"
          map_options
          first_filter_option="label"
          second_filter_option="label"
          auto_complete
          :required="false"
          :rules="[
                  (v: string) => useRules().min_length(v, 1),
                  (v: string) => useRules().max_length(v, 4),
              ]"
          @update:model-value="models.plan_cost_center_id = $event"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6">
        <GenericInput
          label="Bloque presupuesto"
          :default_value="models.budget_block_id"
          placeholder="-"
          :required="false"
          @update:model-value="models.budget_block_id = $event"
          :rules="[]"
        />
      </div>
    </div>

    <q-separator class="q-mt-md" />

    <div class="flex justify-center q-mt-md q-gutter-md">
      <Button
        label="Cancelar"
        size="md"
        unelevated
        :outline="true"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="$emit('close-modal')"
      />
      <Button
        :label="action === 'create' ? 'Crear' : 'Actualizar'"
        size="md"
        unelevated
        :outline="false"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="onSubmit"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { IAccountingParametersAccountingBlockForm } from '@/interfaces/customs/fics/AccountingBlocks'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useAccountingBlockForm from '@/components/Forms/Fics/AccountingParameters/AccountingBlock/AccountingBlockForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    selectedId?: number | null
    data?: IAccountingParametersAccountingBlockForm | null
  }>(),
  {
    action: 'create',
    selectedId: null,
    data: null,
  }
)

const emit = defineEmits<{
  (e: 'close-modal'): void
  (e: 'update-fetch-table'): void
}>()

const {
  models,
  accountingBlockFormElementRef,
  business_trust_types,
  cost_centers_structures,
  account_structures,
  onSubmit,
} = useAccountingBlockForm(
  {
    action: props.action,
  },
  emit
)
</script>
