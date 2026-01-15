<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Número de factura"
            :default_value="models.invoice_number"
            :manual_option="invoices_notes"
            :auto_complete="true"
            :clearable="false"
            required
            :disabled="action === 'edit'"
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'El número de factura es requerido')]"
            @update:model-value="models.invoice_number = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de factura</p>
            <p class="text-weight-medium no-margin">
              {{ models.invoice_number }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de nota"
            :default_value="models.note_type"
            :manual_option="['Nota Débito', 'Nota Crédito']"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Tipo de nota es requerido')]"
            @update:model-value="models.note_type = $event"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de nota*</p>
            <p class="text-weight-medium no-margin">
              {{ models.note_type }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="¿Afecta?"
            :default_value="models.affects"
            :manual_option="['Capital', 'Intereses']"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="models.affects = $event"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">¿Afecta?*</p>
            <p class="text-weight-medium no-margin">
              {{ models.affects }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Valor del ajuste"
            :default_value="models.amount"
            required
            :rules="[
              (val: string) => is_required(val, 'El valor del ajuste es requerido'),
            ]"
            @update:model-value="models.amount = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor del ajuste*</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.amount) }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericInputDate
            v-if="['create', 'edit'].includes(action)"
            label="Fecha de ajuste"
            required
            :default_value="models.adjustment_date || ''"
            :rules="[
              (v) =>
                useRules().is_required(v, 'La fecha de ajuste es requerida'),
            ]"
            @update:modelValue="(val) => (models.adjustment_date = val)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de ajuste*</p>
            <p class="text-weight-medium no-margin">
              {{ models.adjustment_date }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.observations"
            label="Observaciones"
            placeholder="Ingrese las observaciones"
            type="textarea"
            max_length="400"
            :rules="['edit'].includes(action) ? [
    (v: string) => !!v || 'Las observaciones son requeridas',
    (v: string) => v.length >= 5 || 'Debe contener al menos 5 caracteres',
    (v: string) => v.length <= 400 || 'Debe contener como máximo 400 caracteres',
    (v: string) => !/\\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
  ] : []"
            @update:modelValue="models.observations = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Observaciones*</p>
            <p class="text-weight-medium no-margin">
              {{ models.observations }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericInputDate from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useBasicDataForm from '@/components/Forms/BillingPortfolio/AdjustmentNoteRecord/BasicDataForm'
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'
import { IAdjustmentNoteRecordInformationForm } from '@/interfaces/customs/billing-portfolio/AdjustmentNoteRecord'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IAdjustmentNoteRecordInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IAdjustmentNoteRecordInformationForm | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  invoices_notes,
  formatCurrencyString,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
