<template>
  <q-form ref="instructionsFormRef" class="q-pa-md">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Tipo de pago</p>
            <p class="text-weight-medium no-margin">
              {{ data?.payment_type_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Fuente de pago</p>
            <p class="text-weight-medium no-margin">
              {{ data?.payment_source_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Forma de pago</p>
            <p class="text-weight-medium no-margin">
              {{ data?.payment_method_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Fondo / Banco</p>
            <p class="text-weight-medium no-margin">
              {{ data?.fund_or_bank_label }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Plan / Cuenta bancarias
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.plan_or_account_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Fecha</p>
            <p class="text-weight-medium no-margin">
              {{ data?.instruction_date }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Valor base</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(String(data?.base_value)) }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descuento tributario
            </p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(String(data?.tax_discount)) }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Neto calculado</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(String(data?.net_value)) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section>
      <div class="flex justify-between">
        <p class="text-h6">Instrucciones de pago</p>
      </div>

      <VCard class="full-width">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="tableRef"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              :custom-columns="[]"
              :hide-pagination="true"
            >
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Observación</p>
            <p class="text-weight-medium no-margin">
              {{ data?.observation }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section>
      <p class="text-h6">Autorizado de pago</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{ data?.authorized_doc_type_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Número de documento
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.authorized_doc_number }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Nombre completo</p>
            <p class="text-weight-medium no-margin">
              {{ data?.authorized_full_name }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

// interfaces
import { IPaymentRequestInstructionsForm } from '@/interfaces/customs/accounts-payable/PaymentRequests'
import { ActionType } from '@/interfaces/global'

// logic view
import useInstructionsView from '@/components/Forms/AccountsPayable/PaymentRequests/Instructions/InstructionsView'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentRequestInstructionsForm | null
  }>(),
  {}
)

const { instructionsFormRef, tableProps, formatCurrency } = useInstructionsView(
  props,
  emit
)

defineExpose({
  validateForm: () => instructionsFormRef.value?.validate(),
})
</script>
