<template>
  <q-form class="q-px-lg mt-0">
    <section>
      <div class="q-mb-lg mb-0">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Bloque negocio
        </p>
      </div>
      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Oficina</p>
            <p class="text-grey-6 mb-0">
              {{ models.name_office ? models.name_office : 'No registrado' }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Negocio</p>
            <p class="text-grey-6 mb-0">
              {{
                models.business_name ? models.business_name : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Banco pagador</p>
            <p class="text-grey-6 mb-0">
              {{
                models.payer_bank_account
                  ? models.payer_bank_account
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Centro de costo</p>
            <p class="text-grey-6 mb-0">
              {{
                models.cost_center_name
                  ? models.cost_center_name
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Negocio origen</p>
            <p class="text-grey-6 mb-0">
              {{
                models.origin_business_name
                  ? models.origin_business_name
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">
              Código movimiento
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.type_movement_code
                  ? models.type_movement_code
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">
              Forma de pago/recaudo
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.method_payment_description
                  ? models.method_payment_description
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Cuenta pagadora</p>
            <p class="text-grey-6 mb-0">
              {{
                models.origin_bank_account_name
                  ? models.origin_bank_account_name
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Flujo de caja</p>
            <p class="text-grey-6 mb-0">
              {{
                models.cash_flow_name ? models.cash_flow_name : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">
              Plan de inversión
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.investment_plans_id
                  ? models.investment_plans_id
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <div class="mt-4">
      <q-separator />
    </div>

    <section class="mt-4">
      <div class="q-mb-lg mb-0">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Bloque beneficiario
        </p>
      </div>
      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">Beneficiario</p>
            <p class="text-grey-6 mb-0">
              {{
                models.beneficiary_nit
                  ? models.beneficiary_nit
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">
              Autorizado de pago
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.authorizer_name
                  ? models.authorizer_name
                  : 'No registrado'
              }}
            </p>
          </div>

          <div class="col-md-3">
            <p class="text-weight-medium mb-0 text-black-10">
              Banco beneficiario
            </p>
            <p class="text-grey-6 mb-0">
              {{
                models.beneficiary_bank
                  ? models.beneficiary_bank
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <div class="mt-4">
      <q-separator />
    </div>
  </q-form>
  <div class="flex q-gutter-x-md mt-4 mb-2 mx-2">
    <Button
      :outline="true"
      label="Comprobante contable"
      size="md"
      color="orange"
      :style-text="{ color: '#333' }"
      class="text-capitalize btn-filter custom"
      @click="
        models.record_id
          ? $router.push({
              name: 'AccountingReceiptView',
              params: {
                id: models.record_id,
              },
            })
          : undefined
      "
      :disabled="!models.record_id"
    />
    <Button
      :outline="true"
      label="Comprobante tesorería"
      size="md"
      color="orange"
      :style-text="{ color: '#333' }"
      class="text-capitalize btn-filter custom"
      @click="sendInformationToVoucherTreausury()"
      :disabled="isTreasuryVoucherDisabled"
    />
  </div>
</template>

<script setup lang="ts">
//Interfaces
import { ITreasuryRecordsConsultationList } from '@/interfaces/customs'
//logic
import useTreasuryRecordsConsultation from './TreasuryRecordsConsultationData'
//components
import Button from '@/components/common/Button/Button.vue'

const props = withDefaults(
  defineProps<{
    data?: ITreasuryRecordsConsultationList | null
  }>(),
  {}
)

const { models, isTreasuryVoucherDisabled, sendInformationToVoucherTreausury } =
  useTreasuryRecordsConsultation(props)
</script>
