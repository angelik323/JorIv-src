<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <CurrencyInput
            currencyLabel="Valor base"
            type="number"
            :currency="'COP'"
            v-model="models.base_amount"
            required
            :rules="[
              (val: string) => is_required(val, 'El valor base es requerido'),
              (val: string) => max_length(val, 20),
            ]"
            @update:model-value="models.base_amount = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            currencyLabel="Valor IVA"
            :currency="'COP'"
            v-model="models.iva_amount"
            required
            :rules="[
              (val: string) => is_required(val, 'El valor IVA es requerido'),
              (val: string) => max_length(val, 20),
            ]"
            @update:model-value="models.iva_amount = $event"
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-model="models.total_amount"
            :currency="'COP'"
            currencyLabel="Valor total"
            required
            disabled
            :rules="[
              (val: string) => is_required(val, 'El valor total es requerido'),
              (val: string) => max_length(val, 20),
            ]"
            @update:model-value="models.total_amount = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { WriteActionType } from '@/interfaces/global'
import { IFiduciaryCommissionForm } from '@/interfaces/customs'
import useBasicDataForm from '@/components/Forms/SettlementCommissions/FiduciaryCommission/BasicData/BasicDataForm'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: IFiduciaryCommissionForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IFiduciaryCommissionForm | null): void
}>()

const { formElementRef, models, is_required, max_length } = useBasicDataForm(
  props,
  emits
)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
