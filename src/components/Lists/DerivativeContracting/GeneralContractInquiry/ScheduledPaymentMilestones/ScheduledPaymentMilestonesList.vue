<template>
  <div>
    <!-- Tabla de Hitos de Pago Programados -->
    <div class="col-12 row q-mt-xl justify-between">
      <p class="text-black-90 text-weight-bold text-h6">
        {{ milestonesTableProps.title }}
      </p>
    </div>

    <section class="q-mt-md">
      <TableList
        :loading="milestonesTableProps.loading"
        :columns="milestonesTableProps.columns"
        :rows="milestonesTableProps.rows"
        :pages="milestonesTableProps.pages"
        :custom-columns="['applies_budget', 'milestone_status']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
        @row-click="(_evt: Event, row: IScheduledPaymentMilestone) => showMilestoneBudget(row)"
      >
        <template #applies_budget="{ row }">
          <div class="flex justify-center">
            <q-checkbox
              v-model="row.applies_budget"
              color="positive"
              size="24px"
              disable
              keep-color
            />
          </div>
        </template>

        <template #milestone_status="{ row }">
          <CustomToggle
            :value="row.status === 1"
            :width="100"
            :height="30"
            checked-text="Activo"
            unchecked-text="Inactivo"
            readonly
          />
        </template>
      </TableList>
    </section>

    <!-- Totales -->
    <section class="q-mt-md q-pa-md" style="background-color: #f5f5f5; border-radius: 8px;">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="q-mb-sm">
            <span class="text-weight-medium">Total programado - Moneda extranjera:</span>
            <span class="text-weight-bold q-ml-sm">
              {{ new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totals.totalProgrammedForeign) }}
            </span>
          </div>
          <div>
            <span class="text-weight-medium">Total pendiente por cumplir - Moneda extranjera:</span>
            <span class="text-weight-bold q-ml-sm text-orange-8">
              {{ new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totals.totalPendingForeign) }}
            </span>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="q-mb-sm">
            <span class="text-weight-medium">Total programado - COP:</span>
            <span class="text-weight-bold q-ml-sm text-primary">
              {{ new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totals.totalProgrammedCOP) }}
            </span>
          </div>
          <div>
            <span class="text-weight-medium">Total pendiente por cumplir - COP:</span>
            <span class="text-weight-bold q-ml-sm text-orange-8">
              {{ new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totals.totalPendingCOP) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de Presupuesto de Hito -->
    <div v-if="budgetTableProps.rows.length > 0" class="q-mt-xl">
      <q-separator class="q-mb-lg" />
      
      <div class="col-12 row justify-between">
        <p class="text-black-90 text-weight-bold text-h6">
          {{ budgetTableProps.title }}
        </p>
      </div>

      <section class="q-mt-md">
        <TableList
          :loading="budgetTableProps.loading"
          :columns="budgetTableProps.columns"
          :rows="budgetTableProps.rows"
          :custom-columns="['value']"
          :hide-pagination="true"
        >
          <template #value="{ row }">
            <span class="text-weight-bold text-primary">
              {{ new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(parseFloat(row.value)) }}
            </span>
          </template>
        </TableList>
      </section>
    </div>

    <!-- Mensaje cuando no hay presupuesto -->
    <div v-else class="q-mt-xl">
      <q-separator class="q-mb-lg" />
      
      <div class="col-12 row justify-between">
        <p class="text-black-90 text-weight-bold text-h6">
          {{ budgetTableProps.title }}
        </p>
      </div>

      <section class="q-mt-md">
        <q-card flat bordered class="q-pa-lg text-center">
          <q-icon name="info" size="48px" color="grey-5" />
          <p class="text-grey-7 q-mt-md">
            Seleccione un hito con presupuesto asignado para ver los detalles
          </p>
        </q-card>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'


//logic
import useScheduledPaymentMilestonesList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/ScheduledPaymentMilestones/ScheduledPaymentMilestonesList'
import { IScheduledPaymentMilestone } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

const props = withDefaults(
  defineProps<{
    contractId?: number | null
  }>(),
  {
    contractId: null,
  }
)

const {
  milestonesTableProps,
  budgetTableProps,
  totals,
  
  updatePage,
  updatePerPage,
  showMilestoneBudget,
} = useScheduledPaymentMilestonesList(props)
</script>
