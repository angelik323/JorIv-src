<template>
  <section>
    <div class="q-mb-lg">
      <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
        Observaciones de autorización del registro
      </p>
    </div>

    <TableList
      v-if="hasObservations"
      :title="tableProperties.title"
      :columns="tableProperties.columns"
      :rows="tableProperties.rows"
      :loading="tableProperties.loading"
    />

    <div v-else class="text-center q-pa-lg">
      <p class="text-grey-7">No hay observaciones de autorización</p>
    </div>
  </section>
</template>

<script setup lang="ts">
// components
import TableList from '@/components/table-list/TableList.vue'

// interfaces
import { IFinancialObligationAuthorizationObservation } from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// logic
import useObservationsTab from '@/components/Forms/FinancialObligations/FinancialObligation/v2/ObservationsTab/ObservationsTab'

const props = defineProps<{
  observations: IFinancialObligationAuthorizationObservation[]
}>()

const { tableProperties, hasObservations } = useObservationsTab(props)
</script>
