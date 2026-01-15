<template>
  <div class="flex justify-end q-mb-md w-full">
    <Button
      :outline="true"
      label="Descargar excel"
      :leftImg="excelIcon"
      tooltip="Descargar excel"
      :disabled="
        tableInformProcessPendingProps.rows.length === 0 &&
        tableSuccessProcessProps.rows.length === 0
      "
      @click="exportExcelFile"
    />
  </div>
  <VCard>
    <template #content-card>
      <section class="q-mt-xl mx-3 mb-3">
        <TableList
          :title="tableInformProcessPendingProps.title"
          :loading="tableInformProcessPendingProps.loading"
          :columns="tableInformProcessPendingProps.columns"
          :rows="tableInformProcessPendingProps.rows"
          :pages="tableInformProcessPendingProps.pages"
          :hideHeader="tableInformProcessPendingProps.rows.length === 0"
          customNoDataMessageTitle="No hay procesos pendientes"
          customNoDataMessageSubtitle=""
          @update-page="updatePageInformProcessPending"
          @update-rows-per-page="updateRowsInformProcessPending"
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
      </section>
    </template>
  </VCard>
  <VCard>
    <template #content-card>
      <section class="q-mt-xl mx-3 mb-3">
        <TableList
          :title="tableSuccessProcessProps.title"
          :loading="tableSuccessProcessProps.loading"
          :columns="tableSuccessProcessProps.columns"
          :rows="tableSuccessProcessProps.rows"
          :pages="tableSuccessProcessProps.pages"
          :hideHeader="tableSuccessProcessProps.rows.length === 0"
          customNoDataMessageTitle="No hay negocios desactualizados"
          customNoDataMessageSubtitle=""
          @update-page="updatePageSuccessProcess"
          @update-rows-per-page="updateRowsSuccessProcess"
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
      </section>
    </template>
  </VCard>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

//Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic component
import useDesactivateDailyClosingVouchersInformProcess from '@/components/Lists/Accounting/DesactivateDailyClosingVouchers/create/DesactivateDailyClosingVouchersInformProcess'

const props = defineProps<{
  revert_vouchers_id: number
}>()

const {
  tableInformProcessPendingProps,
  tableSuccessProcessProps,
  updatePageInformProcessPending,
  updateRowsInformProcessPending,
  updatePageSuccessProcess,
  updateRowsSuccessProcess,
  exportExcelFile,
} = useDesactivateDailyClosingVouchersInformProcess(props.revert_vouchers_id)
</script>
