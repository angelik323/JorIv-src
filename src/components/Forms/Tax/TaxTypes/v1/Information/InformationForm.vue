<template>
  <q-form ref="formInformationRef" class="q-pa-xl row q-col-gutter-md">
    <div class="col-12 col-md-3">
      <Input
        :label="'Nombre'"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El nombre es requerido'),
          (val: string) => rules.only_letters(val),
          (val: string) => 
            rules.max_length(val, 100),
        ]"
        :default_value="models.name ?? ''"
        @update:model-value="models.name = $event"
      />
    </div>
    <div class="col-12 col-md-3">
      <Selector
        :label="'Signo'"
        map_options
        :manual_option="signs"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El signo es requerido'),
        ]"
        :default_value="models.sign ?? ''"
        @update:model-value="models.sign = $event"
      />
    </div>
    <div class="col-12 col-md-3">
      <Selector
        :label="'Alcance'"
        map_options
        :manual_option="scopes"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El alcance es requerido'),
        ]"
        :default_value="models.scope ?? ''"
        @update:model-value="models.scope = $event"
      />
    </div>
    <div class="col-12 col-md-3">
      <Selector
        :label="'Uso'"
        map_options
        :manual_option="usages"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El uso es requerido'),
        ]"
        :default_value="models.usage ?? ''"
        @update:model-value="models.usage = $event"
      />
    </div>
    <div class="col-12">
      <Input
        type="textarea"
        :label="'Observaciones'"
        :required="false"
        :rules="models.observations ? [
          (val: string) => rules.max_length(val, 100), 
          (val: string) => rules.only_letters(val)
        ] : []"
        :default_value="models.observations ?? ''"
        @update:model-value="models.observations = $event"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import Selector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Input from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  ITaxTypeTaxRequest,
  ITaxTypeTaxResponse,
} from '@/interfaces/customs/tax/TaxType'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITaxTypeTaxResponse | null
  }>(),
  {
    action: 'view',
    data: null,
  }
)

const emits =
  defineEmits<(e: 'update:models', value: ITaxTypeTaxRequest | null) => void>()

// Logic
import useInformationForm from '@/components/Forms/Tax/TaxTypes/v1/Information/InformationForm'
const { formInformationRef, models, rules, signs, scopes, usages } =
  useInformationForm(props, emits)

defineExpose({
  validate: () => formInformationRef.value?.validate(),
})
</script>
