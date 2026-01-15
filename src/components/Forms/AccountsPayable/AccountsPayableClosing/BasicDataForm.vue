<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg" greedy>
    <section class="q-mb-lg">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <p class="text-subtitle1 text-weight-bold text-black q-mb-none">
            Tipo de acción*
          </p>
        </div>
        <div class="col-auto">
          <q-field
            v-model="models.action_type"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de acción es requerido')]"
            borderless
            dense
            no-error-icon
          >
            <template v-slot:control>
              <q-option-group
                v-model="models.action_type"
                :options="actionOptions"
                type="radio"
                color="orange"
                inline
                :disable="disabled"
                class="text-body2 text-black"
              />
            </template>
          </q-field>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <div class="row justify-between items-start q-mb-md">
        <div class="col-12 col-md-6">
          <p class="text-subtitle1 text-weight-bold text-black q-mb-sm">
            Negocios
          </p>
        </div>
      </div>
      <div class="row items-center justify-between q-mb-md">
        <div class="col-auto">
          <small class="text-body2 text-grey-7">Tipo de cierre*</small>
        </div>
        <div class="col-auto">
          <q-field
            v-model="models.closing_mode"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de cierre es requerido')]"
            borderless
            dense
            no-error-icon
          >
            <template v-slot:control>
              <q-option-group
                v-model="models.closing_mode"
                :options="closingModeOptions"
                type="radio"
                color="orange"
                inline
                :disable="disabled"
                class="text-body2 text-black"
              />
            </template>
          </q-field>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-md">
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            label="Fecha de cierre"
            :default_value="models.closing_date"
            :required="true"
            :disabled="disabled"
            :rules="[(val: string) => useRules().is_required(val, 'La fecha de cierre es requerida')]"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            @update:model-value="models.closing_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Negocio desde"
            :manual_option="businessOptions"
            :map_options="true"
            :auto_complete="true"
            :default_value="models.business_from"
            :required="true"
            :disabled="disabled"
            :rules="[(val: string) => useRules().is_required(val, 'El negocio inicial es requerido')]"
            placeholder="Seleccione"
            @update:model-value="models.business_from = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Negocio hasta"
            :manual_option="businessOptions"
            :map_options="true"
            :auto_complete="true"
            :default_value="models.business_to"
            :required="true"
            :disabled="disabled"
            :rules="[(val: string) => useRules().is_required(val, 'El negocio final es requerido')]"
            placeholder="Seleccione"
            @update:model-value="models.business_to = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'

// Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/AccountsPayableClosing/BasicDataForm'

//Comoposables
import { useRules } from '@/composables/useRules'

const emits = defineEmits<{
  (e: 'update:data', value: any): void
}>()

const props = withDefaults(
  defineProps<{
    data?: any | null
    action: ActionType
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const {
  basicDataFormRef,
  models,
  actionOptions,
  closingModeOptions,
  businessOptions,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
  resetForm: () => basicDataFormRef.value?.resetValidation(),
})
</script>
