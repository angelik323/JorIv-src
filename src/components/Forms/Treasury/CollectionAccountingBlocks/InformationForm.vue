<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-12">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Código:
            <b>{{
              models.code
                ? String(models.code).padStart(3, '0')
                : String(Number(max_code_collection_blocks) + 1).padStart(
                    3,
                    '0'
                  )
            }}</b>
          </p>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-12">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Nombre de bloque *
          </p>
          <template v-if="action === 'view'">
            <span>{{ data?.description }}</span>
          </template>
          <GenericInputComponent
            v-else
            :default_value="models.description"
            @update:model-value="models.description = $event"
            :manual_option="[]"
            map_options
            placeholder="Ingrese nombre de bloque"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) => is_required(val, 'El nombre del bloque es requerido'),
              (val: string) => max_length(val, 50)
            ]"
          />
        </div>
      </div>

      <div class="col-12">
        <q-separator class="q-my-lg" />
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-12">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Estructuras
          </p>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Estructura recaudo*
          </p>
          <template v-if="action === 'view'">
            <span>
              {{ data?.collection_structure?.structure }}
            </span>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="models.collection_structure_id"
            @update:model-value="models.collection_structure_id = $event"
            :manual_option="collection_concepts"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :should_slice_options="false"
            :rules="[
              (val: string) => is_required(val, 'La estructura de recaudo es requerida')
            ]"
          />
        </div>
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Estructura contable*
          </p>
          <template v-if="action === 'view'">
            <span>
              {{ data?.accounting_structure?.structure }}
            </span>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="models.accounting_structure_id"
            @update:model-value="models.accounting_structure_id = $event"
            :manual_option="accounting_accounts"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :should_slice_options="false"
            :rules="[
              (val: string) => is_required(val, 'La estructura contable es requerida')
            ]"
          />
        </div>
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Estructura centro de costo
          </p>
          <template v-if="action === 'view'">
            <span>
              {{ data?.cost_center_structure?.structure }}
            </span>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="models.cost_center_structure_id"
            @update:model-value="models.cost_center_structure_id = $event"
            :manual_option="cost_centers"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :should_slice_options="false"
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Estructura presupuesto
          </p>
          <template v-if="action === 'view'">
            <span>
              {{ data?.budget_structure?.budget_item_code }}
            </span>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="models.budget_structure_id"
            @update:model-value="models.budget_structure_id = $event"
            :manual_option="budget_structures"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :should_slice_options="false"
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-6 mt-2">
          <p
            class="text-weight-medium mb-0"
            :class="action === 'view' ? 'text-black-10' : 'text-grey-6'"
          >
            Estructura flujo de caja
          </p>
          <template v-if="action === 'view'">
            <span>
              {{ data?.cash_flow_structure?.code_name }}
            </span>
          </template>
          <GenericSelectorComponent
            v-else
            :default_value="models.cash_flow_structure_id"
            @update:model-value="models.cash_flow_structure_id = $event"
            :manual_option="cash_flow"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :should_slice_options="false"
            :rules="[]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { ICollectionAccountingBlocksResponse } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'

import useInformationForm from '@/components/Forms/Treasury/CollectionAccountingBlocks/InformationForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ICollectionAccountingBlocksResponse | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  collection_concepts,
  accounting_accounts,
  cost_centers,
  cash_flow,
  max_code_collection_blocks,
  budget_structures,
  is_required,
  max_length,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
