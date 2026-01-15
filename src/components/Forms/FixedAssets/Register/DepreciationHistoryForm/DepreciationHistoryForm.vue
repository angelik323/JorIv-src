<template>
  <TableList
    :loading="tableProps.loading"
    :columns="tableProps.columns"
    :rows="tableProps.rows"
    :pages="tableProps.pages"
  >
    <template #custom-no-data>
      <span>No hay registros</span>
    </template>
  </TableList>
</template>
<script setup lang="ts">
// interfaces
import { IDepreciationHistory } from '@/interfaces/customs/fixed-assets/v1/Register'

// components
import TableList from '@/components/table-list/TableList.vue'

// logic
import useDepreciationHistoryForm from '@/components/Forms/FixedAssets/Register/DepreciationHistoryForm/DepreciationHistoryForm'

const props = defineProps<{
  data: IDepreciationHistory[]
}>()

const { tableProps } = useDepreciationHistoryForm({ data: props.data })
</script>
