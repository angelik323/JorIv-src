<template>
  <section class="q-mt-xl q-px-md">
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="paginated"
      :pages="tableProps.pages"
      @updatePage="(val) => (tableProps.pages.currentPage = val)"
      @updateRowsPerPage="update_rows_per_page"
      :hide-header="hide_header"
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
  <div class="q-mt-md q-mb-xl">
    <div class="row items-center justify-end q-gutter-md mr-4">
      <div class="col-3">
        <div class="row justify-end items-center full-height">
          <p class="text-weight-medium no-margin">Total % de participación</p>
        </div>
      </div>

      <div class="col-3">
        <div>
          <GenericInput
            :default_value="total_percentaje"
            :placeholder="''"
            @update:modelValue="total_percentaje = $event"
            :readonly="true"
            :hide_bottom_space="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: ITrustBusinessRegisterThird[]
    hide_header: boolean
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:models', value: ITrustBusinessRegisterThird[]) => void
  >()

// components
import TableList from '@/components/table-list/TableList.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// logic
import useTableThirds from './TableThirds'

// interfaces
import { ITrustBusinessRegisterThird } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

const { tableProps, paginated, total_percentaje, update_rows_per_page } =
  useTableThirds(props, emits)
</script>
