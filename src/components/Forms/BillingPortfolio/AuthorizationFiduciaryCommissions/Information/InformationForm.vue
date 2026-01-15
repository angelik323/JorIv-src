<template>
  <q-form ref="formElementRef">
    <div class="q-mb-lg">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Datos generales
      </p>
    </div>

    <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Nombre del negocio
        </p>
        <p class="text-black-90 mb-0">
          {{ businessName }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Clase de comisión
        </p>
        <p class="text-black-90 mb-0">
          {{ models.commission_class_catalog }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Tipo de comisión
        </p>
        <p class="text-black-90 mb-0">
          {{ models.commission_type_catalog }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Periodicidad
        </p>
        <p class="text-black-90 mb-0">
          {{ models.periodicity }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">Cobro</p>
        <p class="text-black-90 mb-0">
          {{ models.collection ?? '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">Estado</p>
        <p class="text-black-90 mb-0">
          {{ models.status?.name ?? '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Fecha de liquidación
        </p>
        <p class="text-black-90 mb-0">
          {{ models.settlement_date }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Valor base
        </p>
        <p class="text-black-90 mb-0">
          {{ formatCurrencyString(models.base_amount) }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">IVA</p>
        <p class="text-black-90 mb-0">
          {{ formatCurrencyString(models.iva_amount) }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Valor total
        </p>
        <p class="text-black-90 mb-0">
          {{ formatCurrencyString(models.total_amount) }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Descripción
        </p>
        <p class="text-black-90 mb-0">
          {{ models.observation || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Fecha de anulación
        </p>
        <p class="text-black-90 mb-0">
          {{ models.cancellation_date || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 col-lg-3">
        <p class="text-weight-bold mb-0" :class="fieldsTitleClass">
          Motivo de anulación
        </p>
        <p class="text-black-90 mb-0">
          {{ models.cancellation_reason || '-' }}
        </p>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import useInformationForm from '@/components/Forms/BillingPortfolio/AuthorizationFiduciaryCommissions/Information/InformationForm'
import { IAuthorizationFiduciaryCommission } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAuthorizationFiduciaryCommission | null
  }>(),
  {},
)

const {
  formElementRef,
  models,
  businessName,
  fieldsTitleClass,
  formatCurrencyString,
} = useInformationForm(props)

defineExpose({
  getFormValue: () => ({ ...models.value }),
})
</script>
