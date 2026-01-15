<template>
  <section v-if="!isLoading">
    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Encargos</p>
    </div>

    <section class="q-mt-xl q-px-md">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="paginated"
        :pages="tableProps.pages"
        @updatePage="(val) => (tableProps.pages.currentPage = val)"
        @updateRowsPerPage="update_rows_per_page"
        :custom-columns="['checked', 'record_status_id', 'available_balance']"
      >
        <template #checked="{ row }">
          <div class="px-1 flex justify-center">
            <q-radio
              :val="row.id"
              v-model="selected"
              dense
              size="sm"
              color="orange"
            />
          </div>
        </template>

        <template #available_balance="{ row }">
          {{ formatCurrency(`${row.available_balance}`) }}
        </template>

        <template #record_status_id="{ row }">
          <ShowStatus :type="Number(row?.record_status_id ?? 0)" />
        </template>
      </TableList>
    </section>

    <VCard v-if="selected && selected_expense">
      <template #content-card>
        <div class="q-mb-lg q-mt-sm q-ml-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Detalles del registro
          </p>
          <div class="row q-col-gutter-md q-mt-lg">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Número de encargo</p>
                <p class="text-weight-medium no-margin">
                  {{ selected_expense?.number ?? '-' }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Nombre del encargo</p>
                <p class="text-weight-medium no-margin">
                  {{ selected_expense?.name ?? '-' }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Nombre del negocio</p>
                <p class="text-weight-medium no-margin">
                  {{ selected_expense?.fund[0]?.business_trust?.name ?? '-' }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Moneda</p>
                <p class="text-weight-medium no-margin">
                  {{
                    `${selected_expense?.currency?.code ?? ''} - ${
                      selected_expense?.currency?.description ?? ''
                    }`
                  }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Fondo de inversión</p>
                <p class="text-weight-medium no-margin">
                  {{
                    selected_expense?.fund && selected_expense.fund.length > 0
                      ? selected_expense.fund
                          .map((f) => `${f.fund_code} - ${f.fund_name}`)
                          .join(', ')
                      : '-'
                  }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Estado</p>
                <ShowStatus
                  :type="Number(selected_expense?.record_status_id ?? 0)"
                />
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Proyecto inmobiliario</p>
                <p class="text-weight-medium no-margin">
                  {{ selected_expense?.project?.name ?? '-' }}
                </p>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div class="text-black-90">
                <p class="text-weight-bold no-margin">Etapa</p>
                <p class="text-weight-medium no-margin">
                  {{ selected_expense?.stage?.stage_number ?? '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </VCard>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: ITrustBusinessGeneralOrders[]
    action: ActionType
  }>(),
  {}
)

// components
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ITrustBusinessGeneralOrders } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// logic-view
import useExpenses from './Expenses'

const {
  selected,
  selected_expense,
  isLoading,

  //
  tableProps,
  paginated,
  update_rows_per_page,

  formatCurrency,
} = useExpenses(props)
</script>
