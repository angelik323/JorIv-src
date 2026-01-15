<template>
  <section class="q-pa-lg">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
      <div class="col-12">
        <div class="flex justify-between items-center">
          <h3 class="text-h6 text-weight-bold no-margin">Revisión</h3>
          <Button
            v-if="
              accounting_receipt.authorization_status?.status === 'Rechazado'
            "
            :outline="false"
            label="Ver"
            :rightIcon="defaultIconsLucide.chevronRight"
            :color-icon="'#FFFFFF'"
            color="orange"
            class="text-capitalize btn-filter"
            @click="
              goToURL(
                'AccountingReceiptView',
                accounting_receipt.authorization_status.reversed_by_voucher_id
              )
            "
          />
        </div>
      </div>
      <div class="col-12 col-md-4">
        <p class="text-black-90 text-weight-bold no-margin">
          Resultado de revisión
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{ accounting_receipt.authorization_status?.status || '-' }}
        </p>
      </div>
      <div
        v-if="accounting_receipt.authorization_status?.status === 'Rechazado'"
        class="col-12 col-md-4"
      >
        <p class="text-black-90 text-weight-bold no-margin">
          Motivo de rechazo
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            accounting_receipt.authorization_status?.authorization_notes || '-'
          }}
        </p>
      </div>
      <div class="col-12 col-md-4">
        <p class="text-black-90 text-weight-bold no-margin">
          Usuario que registro
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            `${accounting_receipt.authorization_status?.created_by?.id} - ${accounting_receipt.authorization_status?.created_by?.name}`
          }}
        </p>
      </div>
      <div class="col-12 col-md-4">
        <p class="text-black-90 text-weight-bold no-margin">
          Fecha de creación
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            accounting_receipt.created_at
              ? formatDate(accounting_receipt.created_at, 'YYYY-MM-DD')
              : '-'
          }}
        </p>
      </div>
      <div class="col-12 col-md-4">
        <p class="text-black-90 text-weight-bold no-margin">
          Usuario que revisó
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            `${accounting_receipt.authorization_status?.authorized_by?.id} - ${accounting_receipt.authorization_status?.authorized_by?.name}`
          }}
        </p>
      </div>
      <div class="col-12 col-md-4">
        <p class="text-black-90 text-weight-bold no-margin">
          Fecha de revisión
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            accounting_receipt.authorization_status?.authorized_at
              ? formatDate(
                  accounting_receipt.authorization_status?.authorized_at,
                  'YYYY-MM-DD'
                )
              : '-'
          }}
        </p>
      </div>
      <div
        v-if="accounting_receipt.authorization_status?.status === 'Rechazado'"
        class="col-12 col-md-6"
      >
        <p class="text-black-90 text-weight-bold no-margin">
          Datos del comprobante
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            `${accounting_receipt.authorization_status?.anullment_type?.code} - ${accounting_receipt.authorization_status.anullment_type?.name} - ${accounting_receipt.authorization_status?.anullment_type?.id}`
          }}
        </p>
      </div>
    </div>
    <div
      v-if="accounting_receipt.homologation_process?.equivalent"
      class="row q-col-gutter-x-lg q-col-gutter-y-lg q-mt-lg"
    >
      <div class="col-12">
        <q-separator />
      </div>
      <div class="col-12">
        <div class="flex justify-between items-center">
          <h3 class="text-h6 text-weight-bold no-margin">
            Homologación equivalente
          </h3>
          <Button
            :outline="false"
            label="Ver"
            :rightIcon="defaultIconsLucide.chevronRight"
            :color-icon="'#FFFFFF'"
            color="orange"
            class="text-capitalize btn-filter"
            @click="
              goToURL('AccountingReceiptView', {
                id: accounting_receipt.homologation_process?.equivalent
                  ?.homologated_voucher,
              })
            "
          />
        </div>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">
          Fecha de homologación
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            accounting_receipt.homologation_process?.equivalent
              ?.homologation_date
              ? formatDate(
                  accounting_receipt.homologation_process?.equivalent
                    .homologation_date,
                  'YYYY-MM-DD'
                )
              : '-'
          }}
        </p>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">
          Tipo de comprobante
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            `${accounting_receipt.homologation_process?.equivalent?.receipt_type?.code} - ${accounting_receipt.homologation_process?.equivalent?.receipt_type?.name}`
          }}
        </p>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">Consecutivo</p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{ accounting_receipt.homologation_process?.equivalent?.code || '-' }}
        </p>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">
          Usuario que homologó
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            `${accounting_receipt.homologation_process?.equivalent?.homologated_by?.id} - ${accounting_receipt.homologation_process?.equivalent?.homologated_by?.name}`
          }}
        </p>
      </div>
    </div>
    <div
      v-if="accounting_receipt.homologation_process?.fiscal"
      class="row q-col-gutter-x-lg q-col-gutter-y-lg q-mt-lg"
    >
      <div class="col-12">
        <q-separator />
      </div>
      <div class="col-12">
        <div class="flex justify-between items-center">
          <h3 class="text-h6 text-weight-bold no-margin">
            Homologación fiscal
          </h3>
          <Button
            :outline="false"
            label="Ver"
            :rightIcon="defaultIconsLucide.chevronRight"
            :color-icon="'#FFFFFF'"
            color="orange"
            class="text-capitalize btn-filter"
            @click="
              goToURL('AccountingReceiptView', {
                id: accounting_receipt.homologation_process?.fiscal
                  ?.homologated_voucher,
              })
            "
          />
        </div>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">
          Fecha de homologación
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            accounting_receipt.homologation_process?.fiscal?.homologation_date
              ? formatDate(
                  accounting_receipt.homologation_process?.fiscal
                    .homologation_date,
                  'YYYY-MM-DD'
                )
              : '-'
          }}
        </p>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">
          Tipo de comprobante
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            `${accounting_receipt.homologation_process?.fiscal?.receipt_type?.code} - ${accounting_receipt.homologation_process?.fiscal?.receipt_type?.name}`
          }}
        </p>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">Consecutivo</p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{ accounting_receipt.homologation_process?.fiscal?.code || '-' }}
        </p>
      </div>
      <div class="col-12 col-md-3">
        <p class="text-black-90 text-weight-bold no-margin">
          Usuario que homologó
        </p>
        <p class="text-black-90 text-weight-medium no-margin">
          {{
            `${accounting_receipt.homologation_process?.fiscal?.homologated_by?.id} - ${accounting_receipt.homologation_process?.fiscal?.homologated_by?.name}`
          }}
        </p>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
// Vue - pinia
import { storeToRefs } from 'pinia'
// components
import Button from '@/components/common/Button/Button.vue'
// composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
// stores
import { useAccountingReceiptsStore } from '@/stores/accounting/accounting-receipt'

const { defaultIconsLucide, formatDate } = useUtils()
const { goToURL } = useGoToUrl()
const { accounting_receipt } = storeToRefs(useAccountingReceiptsStore('v2'))
</script>
