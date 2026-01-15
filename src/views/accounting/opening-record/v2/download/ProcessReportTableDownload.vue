<template>
  <div class="q-mx-xl">
    <section class="q-mt-xl">
      <TableList
        :title="tablePendingProps.title"
        :loading="tablePendingProps.loading"
        :columns="tablePendingProps.columns"
        :rows="tablePendingProps.rows"
        :pages="tablePendingProps.pages"
        @update-page=""
      >
        <template #custom-header-action>
          <Button
            :outline="true"
            :label="'Descargar excel'"
            :leftImg="excelIcon"
            :tooltip="'Descargar excel'"
            :size="'100%'"
            color="'white'"
            :colorIcon="'black'"
            :classCustom="'custom'"
            @click="exportExcel"
          />
        </template>
      </TableList>

      <TableList
        :title="tableSuccessProps.title"
        :loading="tableSuccessProps.loading"
        :columns="tableSuccessProps.columns"
        :rows="tableSuccessProps.rows"
        :pages="tableSuccessProps.pages"
        @update-page=""
      />
    </section>
  </div>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Interfaces
import type { IOpeningRecordProcessReportData } from '@/interfaces/customs/accounting/OpeningRecord'

// Composables
import useProcessReportTableDownload from '@/views/accounting/opening-record/v2/download/ProcessReportTableDownload'

const props = defineProps<{
  data: IOpeningRecordProcessReportData
}>()

const { tablePendingProps, tableSuccessProps, exportExcel } =
  useProcessReportTableDownload(props.data)
</script>
