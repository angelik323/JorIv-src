<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <p class="text-black-90 text-subtitle1 text-weight-bold no-margin">
      Sección fuente
    </p>
    <div class="row items-center justify-between q-px-md">
      <p class="q-mb-none mt-1 text-weight-medium">Módulo</p>
      <RadioYesNo
        v-model="models.source_module"
        :options="DESTINATION_OPTIONS"
        :is-disabled="action === 'edit'"
      />
    </div>
    <q-separator class="q-my-sm" />
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Proceso"
            :manual_option="processes_origins"
            :map_options="true"
            :default_value="models.source_process"
            @update:model-value="models.source_process = $event"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El proceso es requerido'),
            ]"
            clearable
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Fuente"
            :manual_option="movements_origins"
            :map_options="true"
            display_value="id"
            display_label="label"
            :default_value="models.source_reference_id"
            @update:model-value="models.source_reference_id = $event"
            required
            :rules="[
              (val: number | null) =>
                useRules().is_required(
                  val?.toString() ?? '',
                  'La fuente es requerida'
                ),
            ]"
            clearable
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Descripción fuente"
            :default_value="models.source_description"
            placeholder="-"
            disabled
          />
        </div>
      </div>
      <q-separator class="q-my-sm" />
      <p class="text-black-90 text-subtitle1 text-weight-bold no-margin">
        Sección destino
      </p>
      <div class="row items-center justify-between q-px-md">
        <p class="q-mb-none mt-1 text-weight-medium">Módulo</p>
        <RadioYesNo
          v-model="models.destination_module"
          :options="DESTINATION_OPTIONS"
          :is-disabled="action === 'edit'"
        />
      </div>
      <q-separator class="q-my-sm q-mb-lg" />
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Proceso"
            :manual_option="processes_destinations"
            :map_options="true"
            :default_value="models.destination_process"
            @update:model-value="models.destination_process = $event"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El proceso es requerido'),
            ]"
            clearable
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Destino"
            :manual_option="movements_destinations"
            :map_options="true"
            display_value="id"
            display_label="label"
            :default_value="models.destination_reference_id"
            @update:model-value="models.destination_reference_id = $event"
            required
            :rules="[
              (val: number | null) =>
                useRules().is_required(
                  val?.toString() ?? '',
                  'El destino es requerido'
                ),
            ]"
            clearable
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Descripción destino"
            :default_value="models.destination_description"
            placeholder="-"
            disabled
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { IBudgetSourcesDestinationsForm } from '@/interfaces/customs/accounts-payable/BudgetSourcesDestinations'
import { ActionType } from '@/interfaces/global'

// Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/BudgetSourcesDestinations/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: IBudgetSourcesDestinationsForm | null
    action: ActionType
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'update:data', value: IBudgetSourcesDestinationsForm | null): void
}>()

const {
  basicDataFormRef,
  models,
  DESTINATION_OPTIONS,
  movements_destinations,
  movements_origins,
  processes_destinations,
  processes_origins,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
