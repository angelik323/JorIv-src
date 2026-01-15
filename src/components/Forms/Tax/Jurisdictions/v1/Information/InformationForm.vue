<template>
  <q-form ref="formInformationRef" class="q-pa-xl row q-col-gutter-md">
    <div class="col-12 col-md-4">
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
        :default_value="models.name"
        @update:model-value="models.name = $event"
      />
    </div>
    <div class="col-12 col-md-4">
      <Selector
        :label="'Nivel'"
        map_options
        :manual_option="levels"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El nivel es requerido'),
        ]"
        :default_value="models.level"
        @update:model-value="update_level"
      />
    </div>
    <div class="col-12 col-md-4">
      <Selector
        :label="'País'"
        map_options
        :manual_option="countries_dian"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El país es requerido'),
        ]"
        :default_value="models.country"
        :disabled="disable_country"
        @update:model-value="update_country"
      />
    </div>
    <div class="col-12 col-md-4">
      <Selector
        :label="'Departamental'"
        map_options
        :manual_option="departments"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El departamental es requerido'),
        ]"
        :default_value="models.department"
        :disabled="disable_department"
        @update:model-value="update_department"
      />
    </div>
    <div class="col-12 col-md-4">
      <Selector
        :label="'Municipal'"
        map_options
        :manual_option="cities"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'El municipal es requerido'),
        ]"
        :default_value="models.city"
        :disabled="disable_city"
        @update:model-value="update_city"
      />
    </div>
    <div class="col-12 col-md-4">
      <Selector
        :label="'Autoridad tributaria'"
        map_options
        :manual_option="tax_authorities"
        required
        :rules="[
          (val: string) => 
            rules.is_required(val, 'La autoridad tributaria es requerida'),
        ]"
        :default_value="models.tax_authority"
        @update:model-value="models.tax_authority = $event"
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
        :default_value="models.observations"
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
import { ITaxJurisdictionModels } from '@/interfaces/customs/tax/Jurisdiction'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITaxJurisdictionModels | null
  }>(),
  {
    action: 'view',
    data: null,
  }
)

const emits =
  defineEmits<
    (e: 'update:models', value: ITaxJurisdictionModels | null) => void
  >()

// Logic
import useInformationForm from '@/components/Forms/Tax/Jurisdictions/v1/Information/InformationForm'
const {
  formInformationRef,
  models,
  rules,
  disable_country,
  disable_department,
  disable_city,
  levels,
  countries_dian,
  departments,
  tax_authorities,
  cities,
  update_level,
  update_country,
  update_department,
  update_city,
} = useInformationForm(props, emits)

defineExpose({
  validate: () => formInformationRef.value?.validate(),
})
</script>
