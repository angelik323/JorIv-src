<template>
  <q-form ref="informationForm" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.investment_portfolio_id"
            required
            :label="'Código portafolio'"
            :manual_option="investment_portfolio"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'El código portafolio es requerido'
                ),
            ]"
            @update:model-value="(val: number) => models.investment_portfolio_id = val"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="investmentDescriptionRef"
            disabled
            :label="'Descripción'"
            :manual_option="[]"
            map_options
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.operation_date?.toLocaleString()"
            required
            disabled
            :label="'Fecha operación'"
            :manual_option="[]"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La fecha de operación es requerida'
                ),
            ]"
          />
        </div>
      </div>
      <q-separator class="q-my-md" />
      <p><b>Información operador</b></p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.issuer_id"
            required
            :label="'Emisor'"
            :manual_option="emitters"
            map_options
            :rules="[
              (val) => useRules().is_required(val, 'El emisor es requerido'),
            ]"
            @update:model-value="(val) => (models.issuer_id = val)"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="emmiterDescriptionRef"
            :label="'Descripción emisor'"
            :manual_option="[]"
            map_options
            disabled
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.counterparty_id"
            required
            :label="'Contraparte'"
            :manual_option="emitter_buyer_portfolio"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(val, 'La contraparte es requerida'),
            ]"
            @update:model-value="(val) => (models.counterparty_id = val)"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="counterPartDescriptionRef"
            :label="'Descripción contraparte'"
            :manual_option="[]"
            map_options
            disabled
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="models.administrator_id"
            required
            :label="'Administrador'"
            :manual_option="administrators_codes"
            map_options
            :rules="[
              (val) =>
                useRules().is_required(val, 'El administrador es requerido'),
            ]"
            @update:model-value="(val) => (models.administrator_id = val)"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="administratorDescriptionRef"
            :label="'Descripción administrador'"
            :manual_option="[]"
            map_options
            disabled
            :rules="[]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useInformationForm } from './InformationForm'
import { useRules } from '@/composables'
import { ref } from 'vue'

const {
  models,
  investment_portfolio,
  administrators_codes,
  emitters,
  emitter_buyer_portfolio,
  investmentDescriptionRef,
  emmiterDescriptionRef,
  counterPartDescriptionRef,
  administratorDescriptionRef,
} = useInformationForm()

const informationForm = ref()

defineExpose({
  async validate() {
    if (informationForm.value) {
      return await informationForm.value.validate()
    }
    return false
  },
})
</script>
