<template>
  <section aria-label="Sección de resumen">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <div class="col-12">
        <div class="q-my-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Acta de cumplimiento de punto de equilibrio
          </p>
          <ul
            v-if="formattedCharacteristics.length > 0"
            class="q-mt-md q-pl-md q-ml-md"
          >
            <li
              v-for="(characteristic, index) in formattedCharacteristics"
              :key="index"
              class="q-mb-lg"
            >
              {{ characteristic.replace(/^- /, '') }}
            </li>
          </ul>
          <p v-else class="q-mt-md text-grey-6">
            No hay características registradas
          </p>
        </div>
      </div>
      <div class="col-12">
        <q-separator />
      </div>
      <div class="col-12">
        <div class="q-my-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Documentos anexos
          </p>
        </div>
        <VCard>
          <template #content-card>
            <div class="q-mx-md">
              <TableList
                :loading="tableDocumentsSummaryProperties.loading"
                :rows="tableDocumentsSummaryProperties.rows"
                :columns="tableDocumentsSummaryProperties.columns"
                dense
                hide-pagination
              >
                <template #custom-no-data>
                  <div
                    class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
                  >
                    <img
                      src="@/assets/images/icons/no_data_2.svg"
                      alt="No hay datos para mostrar"
                      width="180px"
                    />
                    <p class="text-weight-bold text-h5 text-center">
                      No hay datos para mostrar
                    </p>
                  </div>
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </div>
      <div class="col-12 q-py-md">
        <p class="mb-0 text-weight-bold">Etapa</p>
        <p class="mb-0">
          {{ data_balance_point_mandate_form?.stage_name || '' }}
        </p>
      </div>
      <div class="col-12">
        <q-separator />
      </div>
      <div class="col-12">
        <div class="q-my-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Listado de encargos de la etapa
          </p>
        </div>
        <VCard>
          <template #content-card>
            <div class="q-mx-md">
              <TableList
                :loading="tableStageMandateSummaryProperties.loading"
                :rows="tableStageMandateSummaryProperties.rows"
                :columns="tableStageMandateSummaryProperties.columns"
                :custom-columns="[
                  'total_investment_balance',
                  'yields',
                  'net_with_tax',
                  'net_without_tax',
                ]"
                dense
                hide-pagination
              >
                <template #custom-no-data>
                  <div
                    class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
                  >
                    <img
                      src="@/assets/images/icons/no_data_2.svg"
                      alt="No hay datos para mostrar"
                      width="180px"
                    />
                    <p class="text-weight-bold text-h5 text-center">
                      No hay datos para mostrar
                    </p>
                  </div>
                </template>

                <template #total_investment_balance="{ row }">
                  {{ formatCurrency(`${row.total_investment_balance}`) }}
                </template>
                <template #yields="{ row }">
                  {{ formatCurrency(`${row.yields}`) }}
                </template>
                <template #net_with_tax="{ row }">
                  {{ formatCurrency(`${row.net_with_tax}`) }}
                </template>
                <template #net_without_tax="{ row }">
                  {{ formatCurrency(`${row.net_without_tax}`) }}
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </div>
      <div class="col-12 col-md-6 q-py-md">
        <p class="mb-0 text-weight-bold">Encargo general</p>
        <p class="mb-0">
          {{ data_balance_point_mandate_form?.general_mandate_name || '' }}
        </p>
      </div>
      <div class="col-12 col-md-6 q-py-md">
        <p class="mb-0 text-weight-bold">Total de recursos de los encargos</p>
        <p class="mb-0">
          {{
            formatCurrency(
              `${data_balance_point_mandate_form?.total_general_order}`
            )
          }}
        </p>
      </div>
      <div class="col-12">
        <q-separator class="mb-4" />
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: ActionType
  }>(),
  {}
)
import { ActionType } from '@/interfaces/global'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import useSummaryBalancePointForm from './SummaryBalancePoint'

// utils
import { useUtils } from '@/composables'
const formatCurrency = useUtils().formatCurrency

const {
  tableStageMandateSummaryProperties,
  tableDocumentsSummaryProperties,
  data_balance_point_mandate_form,
  formattedCharacteristics,
} = useSummaryBalancePointForm(props)
</script>
