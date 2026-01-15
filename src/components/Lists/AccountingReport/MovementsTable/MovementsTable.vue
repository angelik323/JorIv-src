<template>
  <div class="q-mb-xl">
    <div class="q-mb-md">
      <div>
        <strong>Negocio:</strong> {{ business.code }} - {{ business.name }}
      </div>
      <div><strong>Tipo de negocio:</strong> {{ meta.businessType }}</div>
      <div><strong>Libro contable:</strong> {{ meta.book }}</div>
      <div><strong>Cifras expresadas en:</strong> {{ meta.currency }}</div>
      <div v-if="meta.period">
        <strong>Periodo pendiente de cierre contable</strong>
      </div>
    </div>

    <q-table
      flat
      dense
      bordered
      row-key="account_code"
      :rows="rows"
      :columns="columns"
      :pagination="pagination"
      @update:pagination="(val) => (pagination = val)"
    >
      <template #header>
        <q-tr>
          <q-th rowspan="2">CUENTA CONTABLE</q-th>
          <q-th rowspan="2">DESCRIPCIÓN</q-th>
          <q-th colspan="2">SALDO ANTERIOR</q-th>
          <q-th colspan="2">MOVIMIENTOS</q-th>
          <q-th colspan="2">SALDO ACTUAL</q-th>
        </q-tr>

        <q-tr>
          <q-th>Débito</q-th>
          <q-th>Crédito</q-th>
          <q-th>Débito</q-th>
          <q-th>Crédito</q-th>
          <q-th>Débito</q-th>
          <q-th>Crédito</q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr>
          <q-td>{{ props.row.account_code }}</q-td>
          <q-td>{{ props.row.description }}</q-td>

          <q-td class="text-right">
            {{ props.row.previous_balance?.debit }}
          </q-td>
          <q-td class="text-right">
            {{ props.row.previous_balance?.credit }}
          </q-td>

          <q-td class="text-right">
            {{ props.row.movements?.debit }}
          </q-td>
          <q-td class="text-right">
            {{ props.row.movements?.credit }}
          </q-td>

          <q-td class="text-right">
            {{ props.row.current_balance?.debit }}
          </q-td>
          <q-td class="text-right">
            {{ props.row.current_balance?.credit }}
          </q-td>
        </q-tr>
      </template>

      <template #bottom-row v-if="rows.length">
        <q-tr class="bg-grey-3 text-weight-bold">
          <q-td colspan="2">Totales</q-td>
          <q-td class="text-right">{{ total('previous_debit') }}</q-td>
          <q-td class="text-right">{{ total('previous_credit') }}</q-td>
          <q-td class="text-right">{{ total('movement_debit') }}</q-td>
          <q-td class="text-right">{{ total('movement_credit') }}</q-td>
          <q-td class="text-right">{{ total('current_debit') }}</q-td>
          <q-td class="text-right">{{ total('current_credit') }}</q-td>
        </q-tr>
      </template>

      <template #no-data>
        <div
          class="row full-width items-center justify-center q-pa-lg text-grey-7"
        >
          <p class="no-margin">Sin datos disponibles</p>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
// Interfaces
import { IGeneralLedgerBusinessTable } from '@/interfaces/customs/accounting/v2/AccountingReport'
import { IPages } from '@/interfaces/customs/IPages'

// Logic view
import { useMovementsTable } from '@/components/Lists/AccountingReport/MovementsTable/MovementsTable'

const props = defineProps<{
  business: IGeneralLedgerBusinessTable
  pages: IPages
  meta: {
    businessType: string
    book: string
    currency: string
    period: boolean
  }
}>()

const { rows, total, columns, pagination } = useMovementsTable(
  props.business,
  props.pages
)
</script>

<style scoped lang="scss" src="./MovementsTable.scss" />
