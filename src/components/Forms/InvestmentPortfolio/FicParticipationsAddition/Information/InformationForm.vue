<template>
  <q-form ref="informationFormRef">
    <section class="q-mt-md">
      <div class="row items-end q-col-gutter-x-lg q-col-gutter-y-sm">

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.investment_portfolio_id"
            label="Código de portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (val: string) => is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="models.investment_portfolio_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Descripcion"
            placeholder="-"
            :default_value="infoModels.description"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.operation_date"
            label="Fecha operación portafolio"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            required
            disabled
            :rules="[
              (val: string) => is_required(val, 'La fecha de operación del portafolio es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.operation_date = $event"
          />
        </div>

        <div class="col-12">
          <q-separator spaced />
          <h6 class="my-1">Información operador</h6>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.issuer_id"
            label="Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.emitter"
            :rules="[
              (val: string) => is_required(val, 'El código de emisor es requerido'),
            ]"
            @update:model-value="models.issuer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Descripción emisor"
            placeholder="-"
            :default_value="infoModels.emitter_description"
            disabled
            :rules="[]"
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
              (val: string) => is_required(val, 'La contraparte es requerida'),
            ]"
            @update:model-value="models.counterparty_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Descripción contraparte"
            placeholder="-"
            :default_value="infoModels.counterparty_description"
            disabled
            :rules="[]"
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
              (val: string) => is_required(val, 'El administrador es requerido'),
            ]"
            @update:model-value="models.administrator_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Descripción administrador"
            placeholder="-"
            :default_value="infoModels.administrator_description"
            disabled
            :rules="[]"
          />
        </div>

      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

import { IBasicDataForm } from '@/interfaces/customs'
import useInformationForm from '@/components/Forms/InvestmentPortfolio/FicParticipationsAddition/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    data: IBasicDataForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
}>()

const {
  informationFormRef,
  models,
  infoModels,
  is_required,
  valid_format_date,

  selectOptions,
  resetForm,
} = useInformationForm(props, emits)

defineExpose({
  resetForm,
  getValues: () => infoModels.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>