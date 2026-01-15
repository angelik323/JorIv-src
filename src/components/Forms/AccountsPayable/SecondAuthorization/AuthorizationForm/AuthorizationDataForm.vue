<template>
  <div class="q-pa-lg">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Negocio</p>
          <p class="text-weight-medium no-margin">
            {{
              models.business_trust
                ? `${models.business_trust.business_code} - ${models.business_trust.name}`
                : 'No registra'
            }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Fecha de radicación</p>
          <p class="text-weight-medium no-margin">
            {{ models.reception_date ?? 'No registra' }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">No. de solicitud</p>
          <p class="text-weight-medium no-margin">
            {{ models.orpa_number ?? 'No registra' }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">No. de cargue</p>
          <p class="text-weight-medium no-margin">
            {{ models.upload_number ?? 'No registra' }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">No. Bien</p>
          <p class="text-weight-medium no-margin">
            {{ models.asset_number_id ?? 'No registra' }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Consecutivo Interno</p>
          <p class="text-weight-medium no-margin">
            {{ models.internal_code ?? 'No registra' }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Consecutivo cliente</p>
          <p class="text-weight-medium no-margin">
            {{ models.client_code ?? 'No registra' }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Proveedor/ emisor</p>
          <p class="text-weight-medium no-margin">
            {{
              models.supplier
                ? models.supplier.legal_person
                  ? models.supplier.legal_person.business_name
                  : models.supplier?.natural_person?.full_name
                : 'No registra'
            }}
          </p>
        </div>
        <div class="col-12 col-md-3 text-black-90 mb-1">
          <p class="text-weight-bold mb-3">Tipo de pago</p>
          <p class="text-weight-medium no-margin">
            {{ models.payment_type?.label ?? 'No registra' }}
          </p>
        </div>
        <div
          class="col-12 col-md-3 text-black-90 mb-1"
          v-if="!showPaymentOrderValues"
        >
          <p class="text-weight-bold mb-3">Observaciones</p>
          <p class="text-weight-medium no-margin">{{ models.observation }}</p>
        </div>
        <div
          class="col-12 col-md-3 text-black-90 mb-1"
          v-if="!showPaymentOrderValues"
        >
          <p class="text-weight-bold mb-3">Estado</p>
          <p class="text-weight-medium no-margin">
            <ShowStatus
              :type="models.status?.id ?? 0"
              status-type="accountsPayable"
            />
          </p>
        </div>

        <div
          class="col-12 col-md-3 text-black-90 mb-1"
          v-if="showPaymentOrderValues"
        >
          <p class="text-weight-bold mb-3">Numero de orden de pago</p>
          <p class="text-weight-medium no-margin">
            {{ models.orpa_number ?? 'No registra' }}
          </p>
        </div>
        <div
          class="col-12 col-md-3 text-black-90 mb-1"
          v-if="showPaymentOrderValues"
        >
          <p class="text-weight-bold mb-3">Vigencia</p>
          <p class="text-weight-medium no-margin">
            {{ models.orpa_validity ?? 'No registra' }}
          </p>
        </div>

        <div
          class="col-12 col-md-3 text-black-90 mb-1"
          v-if="showPaymentOrderValues"
        >
          <p class="text-weight-bold mb-3">Valor total</p>
          <p class="text-weight-medium no-margin">
            {{
              models.orpa_value
                ? useUtils().formatCurrencyString(models.orpa_value)
                : 'No registra'
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
// Components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Interfaces
import { ISecondAuthorizationDataAuthorization } from '@/interfaces/customs/accounts-payable/SecondAuthorization'

// Composables
import { useUtils } from '@/composables'

// Logic
import useAuthorizationDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/AuthorizationForm/AuthorizationDataForm'

const props = withDefaults(
  defineProps<{
    data?: ISecondAuthorizationDataAuthorization | null
    showPaymentOrderValues?: boolean
  }>(),
  {}
)

const { models } = useAuthorizationDataForm(props)
</script>
