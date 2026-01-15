<template>
  <q-form
    role="form"
    ref="basicDataFormRef"
    aria-label="Formulario de datos básicos"
  >
    <section aria-label="Sección de formulario de datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.investment_portfolio_id"
            label="Código portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="models.investment_portfolio_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.investment_portfolio_description"
            label="Descripción"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.operation_date"
            label="Fecha operación portafolio"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de operación del portafolio es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.operation_date = $event"
            disabled
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <div class="col-12">
          <p class="text-h6 text-weight-bold">Información operador</p>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.issuer_id"
            label="Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.emitters"
            :rules="[
              (val: string) => useRules().is_required(val, 'El emisor es requerido'),
            ]"
            @update:modelValue="handleChangeEmitter"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.issuer_description"
            label="Descripción emisor"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.counterparty_id"
            label="Contraparte"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.emitter_buyer"
            :rules="[
              (val: string) => useRules().is_required(val, 'La contraparte es requerida'),
            ]"
            @update:modelValue="models.counterparty_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.counterparty_description"
            label="Descripción contraparte"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="models.administrator_id"
            label="Administrador"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.administrators_codes"
            :rules="[
              (val: string) => useRules().is_required(val, 'El administrador es requerido'),
            ]"
            @update:modelValue="models.administrator_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="models.administrator_description"
            label="Descripción administrador"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
import { useRules } from '@/composables'
import useBasicDataForm from './BasicDataForm'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

const {
  models,
  selectOptions,
  basicDataFormRef,
  resetForm,
  handleChangeEmitter,
} = useBasicDataForm()

defineExpose({
  resetForm,
  getValues: () => models.value,
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
