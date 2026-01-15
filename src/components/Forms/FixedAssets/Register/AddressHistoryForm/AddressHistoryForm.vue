<template>
  <div class="q-mx-xl">
    <section>
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
    </section>
  </div>
</template>
<script setup lang="ts">
// interface
import { INoveltyHistory } from '@/interfaces/customs/fixed-assets/v1/Register'

// components
import TableList from '@/components/table-list/TableList.vue'

// logic
import useAddressHistoryForm from '@/components/Forms/FixedAssets/Register/AddressHistoryForm/AddressHistoryForm'

const props = defineProps<{
  data: INoveltyHistory[]
}>()

const { tableProps } = useAddressHistoryForm({ data: props.data })
</script>
