<template>
  <div>
    <q-form ref="basicDataFormRef" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Código estructura de flujo de caja"
              :manual_option="account_structures"
              :default_value="models.account_structure_id"
              :clearable="false"
              :auto_complete="false"
              map_options
              required
              @update:modelValue="
                account_structure_select = account_structures.find(
                  (item) => item.value === $event
                )
              "
              :rules="[(val: string) => useRules().is_required(val, 'El código estructura es requerido')]"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInput
              label="Estructura"
              :default_value="models.account_structure ?? '-'"
              disabled
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInput
              label="Uso"
              :default_value="models.account_purpose ?? '-'"
              disabled
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInput
              label="Nombre"
              placeholder="Inserte"
              :default_value="models.name ?? ''"
              required
              :rules="[
                (v: string) => useRules().is_required(v, 'El campo nombre es requerido'),                 
                (v: string) => useRules().max_length(v, 80)
              ]"
              @update:model-value="models.name = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInput
              label="Código"
              placeholder="Inserte"
              :default_value="models.code ?? ''"
              required
              type="number"
              :rules="[
                (v: string) => useRules().is_required(v, 'El campo código es requerido'),
                (v: string) => useRules().max_length(v, 16)
              ]"
              @update:model-value="models.code = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Tipo"
              :manual_option="cash_flow_structure_types"
              :default_value="models.type"
              :auto_complete="false"
              :clearable="false"
              required
              map_options
              @update:modelValue="models.type = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El tipo es requerido')]"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Naturaleza"
              :manual_option="cash_flow_structure_natures"
              :default_value="models.nature"
              :auto_complete="false"
              :clearable="false"
              required
              map_options
              @update:modelValue="models.nature = $event"
              :rules="[(val: string) => useRules().is_required(val, 'La naturaleza es requerida')]"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Grupo actividad"
              :manual_option="cash_flow_structure_activity_groups"
              :default_value="models.activity_group"
              :auto_complete="false"
              :clearable="false"
              required
              map_options
              @update:modelValue="models.activity_group = $event"
              :rules="[(val: string) => useRules().is_required(val, 'El grupo actividad es requerido')]"
            />
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    action: ActionType
    data?: ICashFlowStructures | null
  }>(),
  {}
)
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useBasicDataForm from './BasicDataForm'
import { ICashFlowStructures } from '@/interfaces/customs'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'

const {
  models,
  account_structures,
  cash_flow_structure_types,
  cash_flow_structure_natures,
  cash_flow_structure_activity_groups,
  account_structure_select,
  basicDataFormRef,
} = useBasicDataForm()

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
