<template>
  <q-form ref="formRef" class="q-mt-md">
    <section aria-label="Datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.user"
            label="Usuario"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.operation_date"
            :rules="[]"
            label="Fecha de operación"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.portfolio_code"
            label="Código de portafolio"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.portfolio_description"
            label="Descripción portafolio"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.operation_number"
            label="Número de operación"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.start_date"
            :rules="[]"
            label="Fecha inicio"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.days_number"
            label="Número días"
            placeholder="Inserte"
            type="number"
            :rules="[
    (v: string) =>
      useRules().is_required(v, 'Debe ingresar un número de días'),
    (v: string) => useRules().only_number(v),
    (v: string) => useRules().only_number_with_decimals(v.replace(',', '.'), 2),
    (v: string) => useRules().only_positive_number(v),
    (v: string) => useRules().max_value(v, 365),
    (v: string) => useRules().min_value(v, 1),
    (v: string) => useRules().max_length(v, 3),
  ]"
            :hideIcon="true"
            required
            @update:modelValue="formData.days_number = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.end_date"
            label="Fecha fin"
            :rules="[]"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.counterparty"
            label="Contraparte"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.negotiation_value"
            label="Valor negociación"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.rate_value"
            label="Valor tasa"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.return_value"
            label="Valor regreso"
            placeholder="-"
            disabled
            required
          />
        </div>
      </div>
    </section>

    <section class="q-mt-lg" aria-label="Tipo de modificación">
      <div class="q-mb-md">
        <p class="text-grey-10 text-body2 text-weight-bold q-mb-sm">
          Tipo modificación *
        </p>
        <RadioYesNo
          v-model="formData.modification_type"
          :options="modificationOptions"
          inline
          :rules="[
            (v) =>
              useRules().is_required(
                v,
                'Debe seleccionar un tipo de modificación'
              ),
          ]"
        />
      </div>

      <div class="q-mt-md">
        <GenericInputComponent
          :default_value="formData.observation"
          label="Observaciones"
          placeholder="Ingrese motivo de la modificación"
          type="textarea"
          :rules="[
            (v) => useRules().is_required(v, 'Debe ingresar una observación'),
            (v) => useRules().max_length(v, 100),
          ]"
          @update:model-value="formData.observation = $event"
          required
        />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useInformationForm from './InformationForm'
import { IEditOperationForm } from '@/interfaces/customs'
import { useRules } from '@/composables'

const props = defineProps<{ data: IEditOperationForm }>()
const {
  formRef,
  formData,
  modificationOptions,
  isValid,
  validateForm,
  getFormData,
} = useInformationForm(props)

defineExpose({
  validateForm,
  getFormData,
  isValid,
})
</script>
