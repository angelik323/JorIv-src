<template>
  <q-form ref="associatedDataFormRef" class="q-pa-md">
    <section>
      <p class="text-h6">Activos fijos / Bienes</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Fuente</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.assets[0]
                  ? data?.assets[0].asset_source_label
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Tipo de activo</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.assets[0]
                  ? data?.assets[0].asset_type_label
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Número de bien</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.assets[0]
                  ? data?.assets[0].asset_number_label
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Placa / Matrícula</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.assets[0]
                  ? data?.assets[0].plate_or_register
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-3" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Obligación financiera
            </p>
            <p class="text-weight-medium no-margin">
              {{
                data?.financial_obligations[0]
                  ? data?.financial_obligations[0].financial_obligation_label
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Cuota</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.financial_obligations[0]
                  ? data?.financial_obligations[0].installment_number
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Valor de capital</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.financial_obligations[0]
                  ? formatCurrency(
                      String(data?.financial_obligations[0].capital_value)
                    )
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Valor de interés</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.financial_obligations[0]
                  ? formatCurrency(
                      String(data?.financial_obligations[0].interest_value)
                    )
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Valor total</p>
            <p class="text-weight-medium no-margin">
              {{
                data?.financial_obligations[0]
                  ? formatCurrency(
                      String(
                        data?.financial_obligations[0].total_installment_value
                      )
                    )
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="my-3" />

    <section>
      <p class="text-h6">Anticipos</p>

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

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

// interfaces
import { IPaymentRequestAssociatedDataForm } from '@/interfaces/customs/accounts-payable/PaymentRequests'
import { ActionType } from '@/interfaces/global'

// logic view
import useAssociatedDataView from '@/components/Forms/AccountsPayable/PaymentRequests/AssociatedData/AssociatedDataView'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentRequestAssociatedDataForm | null
  }>(),
  {}
)

const { associatedDataFormRef, tableProps, formatCurrency } =
  useAssociatedDataView(props, emit)

defineExpose({
  validateForm: () => associatedDataFormRef.value?.validate(),
})
</script>
