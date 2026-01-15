<template>
  <div>
    <q-form ref="executeForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Desde negocio*"
              :manual_option="fields"
              :map_options="true"
              :required="true"
              :default_value="modelsbusiness.from_business_trust_id"
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="modelsbusiness.from_business_trust_id = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo desde negocio es requerido')]"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta negocio*"
              :manual_option="fields"
              :map_options="true"
              :required="true"
              :default_value="modelsbusiness.to_business_trust_id"
              :auto_complete="false"
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="modelsbusiness.to_business_trust_id = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El campo hasta negocio es requerido')]"
            />
          </div>
        </div>
      </section>
      <q-separator spaced />
    </q-form>
  </div>
</template>
<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import { IAnnualPeriodClosingModel } from '@/interfaces/customs'
import useExecuteForm from './AnnualPeriodClosingExecute'

const props = withDefaults(
  defineProps<{
   fields: any[]
    action: 'create' | 'edit'
    data?: IAnnualPeriodClosingModel
  }>(),
  {}
)

const emits = defineEmits(['update'])

defineExpose({
  validateForm: () => executeForm.value?.validate(),
  getFormData: () => modelsbusiness.value,
})

const {

  modelsbusiness,
  executeForm,
  isEdit,
} = useExecuteForm(props)
</script>
