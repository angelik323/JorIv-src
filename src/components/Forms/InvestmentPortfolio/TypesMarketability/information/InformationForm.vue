<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <div :class="['col-12', 'col-md-4']">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          :placeholder="'Inserte'"
          :label="'Código'"
          :default_value="models.code"
          required
          :rules="[
              (val: string) =>
                useRules().is_required(val, 'El código es requerido'),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().max_length(val, 2),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
          @update:model-value="(val) => (models.code = val)"
        />
      </div>
      <div :class="['col-12', 'col-md-4']">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          :placeholder="'Inserte'"
          :label="'Descripción'"
          :default_value="models.description"
          required
          :rules="[
              (val: string) =>
                useRules().is_required(val, 'La descripción es requerida'),
              (val: string) => useRules().min_length(val, 1),
              (val: string) => useRules().max_length(val, 30),
              (val: string) => useRules().no_consecutive_spaces(val),
            ]"
          @update:model-value="(val) => (models.description = val)"
        />
      </div>
      <div :class="['col-12', 'col-md-4']">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          :placeholder="'Inserte'"
          :label="'Tipo'"
          :manual_option="types_marketability"
          :default_value="models.type"
          required
          :disabled="id ? true : false"
          map_options
          :rules="[
            (val: string) =>
              useRules().is_required(val, 'El tipo es requerido'),
          ]"
          @update:model-value="(val) => (models.type = val)"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import { useRules } from '@/composables'
import { useInformationForm } from './InformationForm'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { IMarketabilityType } from '@/interfaces/customs'
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IMarketabilityType
  }>(),
  {}
)

const { models, types_marketability, id } = useInformationForm(props)
</script>
