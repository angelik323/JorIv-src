<template>
  <section class="q-mt-xl q-px-md" v-if="!isLoading">
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="paginated"
      :pages="tableProps.pages"
      @updatePage="(val) => (tableProps.pages.currentPage = val)"
      @updateRowsPerPage="update_rows_per_page"
      :hide-header="hide_header"
      :custom-columns="['actions']"
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

      <template #actions="{ row }">
        <Button
          v-if="!props.hide_actions"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          class-custom="custom"
          :outline="false"
          flat
          colorIcon="#f45100"
          tooltip="Eliminar"
          @click="deleteRow(row)"
        />

        <Button
          v-if="!row.is_new"
          :left-icon="defaultIconsLucide.download"
          color="orange"
          class-custom="custom"
          :outline="false"
          flat
          colorIcon="#f45100"
          tooltip="Descargar"
          @click="downloadFile(row)"
        />
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: IDocumentsTrustBusiness[]
    hide_header: boolean
    hide_actions?: boolean
  }>(),
  {}
)

const emits = defineEmits<{
  'update:delete': [item: IDocumentsTrustBusiness]
  'update:download': [item: IDocumentsTrustBusiness]
}>()

// components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// logic
import useTableDocuments from './TableDocuments'

// interfaces
import { IDocumentsTrustBusiness } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

const {
  tableProps,
  paginated,
  defaultIconsLucide,
  isLoading,

  deleteRow,
  downloadFile,
  update_rows_per_page,
} = useTableDocuments(props, emits)
</script>
