<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-4']">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :placeholder="'Inserte'"
            :default_value="models.code"
            :label="'Código'"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El código es requerido'),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().max_length(val, 5),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
            @update:model-value="(val) => (models.code = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-4']">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.description"
            :placeholder="'Ingrese descripción'"
            :label="'Descripción'"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'La descripción es requerida'),
              (val: string) => useRules().max_length(val, 80),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
            @update:model-value="(val) => (models.description = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-4']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.treasury_movement_code_id"
            :placeholder="'Seleccione'"
            map_options
            :required="false"
            :manual_option="treasury_movement_codes"
            :label="'Código movimiento tesorería'"
            :auto_complete="true"
            :rules="[]"
            @update:model-value="
              (val) => (models.treasury_movement_code_id = val)
            "
          />
        </div>

        <div class="self-end flex justify-between col-12 col-md-12 col-sm-12">
          <p class="text-weight-medium mb-0 mt-2">Genera movimiento en FIC *</p>
          <RadioYesNo v-model="models.generates_fic_movement" />
        </div>
      </div>
    </section>
    <q-separator class="q-my-md" />
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6 col-sm-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.fic_movement_code"
            :label="'Código movimiento FIC'"
            :placeholder="'Ingrese'"
            :manual_option="movements"
            map_options
            required
            :disabled="!models.generates_fic_movement"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'La naturaleza es requerida'),
            ]"
            @update:model-value="(val) => (models.fic_movement_code = val)"
          />
        </div>
      </div>
      <p><b>Operación</b></p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-6']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.inversion_type_id"
            :placeholder="'Seleccione'"
            map_options
            :manual_option="inversion_types"
            :label="'Tipo de operación'"
            required
            :auto_complete="true"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El tipo de operación es requerido'),
            ]"
            @update:model-value="(val) => (models.inversion_type_id = val)"
          />
        </div>
      </div>
      <div class="flex justify-between col-12 col-md-12 col-sm-12 mb-1">
        <p class="text-grey-8 mb-0 mt-2">Naturaleza operación*</p>
        <RadioYesNo
          :model-value="models.operation_nature"
          :rules="[(val: string) => useRules().is_required(val)]"
          @update:model-value="(val: string) => (models.operation_nature = val)"
          :options="natureOperation"
        />
      </div>
      <q-separator class="q-my-md" />
      <div class="flex justify-between col-12 col-md-12 col-sm-12 mb-1">
        <p class="text-grey-8 mb-0 mt-2">Origen de contabilidad *</p>
        <RadioYesNo
          :model-value="models.accounting_origin"
          :rules="[(val: string) => useRules().is_required(val)]"
          @update:model-value="
            (val: string) => (models.accounting_origin = val)
          "
          :options="originType"
        />
      </div>
      <q-separator class="q-my-md" />
      <div class="flex justify-between col-12 col-md-12 col-sm-12 mb-1">
        <p class="text-grey-8 mb-0 mt-2">¿Genera papeleta? *</p>
        <RadioYesNo
          :model-value="models.generates_papeleta"
          :rules="[(val: boolean) => useRules().is_required_boolean(val)]"
          @update:model-value="
            (val: boolean) => (models.generates_papeleta = val)
          "
          :options="fic_menu_movement"
        />
      </div>
      <q-separator class="q-my-md" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { useRules } from '@/composables'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useInformationForm } from './InformationForm'
import { ITypesOperation } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: ITypesOperation
  }>(),
  {}
)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
  getFormData: () => models.value as ITypesOperation,
})

const {
  models,
  formInformation,
  movements,
  fic_menu_movement,
  originType,
  natureOperation,
  treasury_movement_codes,
  inversion_types,
} = useInformationForm(props)
</script>
