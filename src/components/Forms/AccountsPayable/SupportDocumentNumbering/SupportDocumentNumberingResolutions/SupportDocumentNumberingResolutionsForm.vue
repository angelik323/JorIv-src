<template>
  <q-form ref="basicDataFormRef" class="q-px-xl q-py-md">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Resolucion"
            :default_value="models.resolution"
            required
            :disabled="action === 'edit'"
            @update:model-value="models.resolution = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'La resolución es obligatoria'),
                (val: string) => useRules().only_alphanumeric(val),
                (val: string) => useRules().max_length(val,21),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            label="Fecha resolución"
            :default_value="models.resolution_date"
            required
            @update:model-value="models.resolution_date = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'La fecha resolución es obligatoria'),
                (val: string) => useRules().date_before_or_equal_to_the_current_date(val),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Prefijo"
            :default_value="models.prefix"
            required
            @update:model-value="models.prefix = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'El prefijo es obligatorio'),
                (val: string) => useRules().only_letters(val),
                (val: string) => useRules().max_length(val,8),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Rango inicial"
            type="number"
            :min_value="1"
            :default_value="models.range_start"
            required
            @update:model-value="models.range_start = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'El rango inicial es obligatorio'),
                (val: string) => useRules().max_length(val,20),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Rango final"
            type="number"
            :min_value="1"
            :default_value="models.range_end"
            required
            @update:model-value="models.range_end = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'El rango final es obligatorio'),
                (val: string) => useRules().min_value(val,models.range_start ?Number(models.range_start) + 1: 1),
                (val: string) => useRules().max_length(val,20),
            ]"
          />
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericInputComponent
            label="Numero siguiente disponible"
            type="number"
            :default_value="models.next_available_number"
            required
            disabled
            :rules="[]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            label="Fecha vigencia inicial"
            :default_value="models.validity_start_date"
            required
            @update:model-value="models.validity_start_date = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'La fecha vigencia inicial es obligatoria'),
            ]"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            label="Fecha vigencia final"
            :default_value="models.validity_end_date"
            required
            @update:model-value="models.validity_end_date = $event"
            :rules="[
                (val: string) => useRules().is_required(val, 'La fecha vigencia final es obligatoria'),
                (val: string) => useRules().date_after_or_equal_to_specific_date(val,models.validity_start_date?? '' ),
            ]"
          />
        </div>

        <div class="col-12 col-md-3 q-mt-sm">
          <RadioYesNo
            v-model="models.has_business_prefix"
            :is-radio-button="false"
            label="Prefijo de negocios"
          />
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericSelectorComponent
            label="Estado"
            :default_value="models.status_id"
            :manual_option="support_document_numbering_resolution_statuses"
            :map_options="true"
            required
            @update:model-value="models.status_id = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El estado es requerido')
            ]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Componets
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

//Interfaces
import { ISupportDocumentNumberingResolutionForm } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { ActionType } from '@/interfaces/global/Action'

//Composables
import { useRules } from '@/composables'

//Logic
import useSupportDocumenNumberingResolutionsForm from '@/components/Forms/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingResolutions/SupportDocumentNumberingResolutionsForm'

const props = withDefaults(
  defineProps<{
    data?: ISupportDocumentNumberingResolutionForm | null
    action: ActionType
  }>(),
  {}
)

const emits =
  defineEmits<
    (
      e: 'update:data',
      value: ISupportDocumentNumberingResolutionForm | null
    ) => void
  >()

const {
  basicDataFormRef,
  models,
  support_document_numbering_resolution_statuses,
} = useSupportDocumenNumberingResolutionsForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
