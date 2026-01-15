<template>
  <q-form ref="formInformationRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <Input
            v-if="['create', 'edit'].includes(action)"
            label="Etiqueta en la facturación"
            :required="false"
            :rules="models.invoice_label ?[
              (val: string) => rules.only_alphanumeric(val),
              (val: string) => rules.min_length(val, 2),
              (val: string) => rules.max_length(val, 250),
            ]: []"
            :default_value="models.invoice_label"
            @update:model-value="models.invoice_label = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Etiqueta en la facturación</p>
            <p class="text-weight-medium no-margin">
              {{ models.invoice_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <Input
            v-if="['create', 'edit'].includes(action)"
            type="textarea"
            label="Notas legales"
            :required="false"
            :rules="models.legal_notes ? [
              (val: string) => rules.max_length(val, 250), 
              (val: string) => rules.only_alphanumeric(val)
            ] : []"
            :default_value="models.legal_notes"
            @update:model-value="models.legal_notes = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Notas legales</p>
            <p class="text-weight-medium no-margin">
              {{ models.legal_notes ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import Input from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITaxesAndWithholdingsForm } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Logic
import useInformationForm from '@/components/Forms/Tax/TaxesAndWithholdings/v1/BasicData/BasicData'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ITaxesAndWithholdingsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ITaxesAndWithholdingsForm | null): void
}>()

const { formInformationRef, models, rules } = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formInformationRef.value?.validate(),
})
</script>
