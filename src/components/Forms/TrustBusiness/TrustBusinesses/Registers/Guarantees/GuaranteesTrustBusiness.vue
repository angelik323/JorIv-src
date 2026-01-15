<template>
  <TableList
    :loading="tableProps.loading"
    :columns="tableProps.columns"
    :rows="tableProps.rows"
    :custom-columns="['registration_status', 'guarantee_status', 'actions']"
    :rowsPerPageOptions="[7]"
    :hide-header="tableProps.rows?.length === 0"
  >
    <template #registration_status="{ row }">
      <ShowStatus :type="Number(row?.registration_status?.id ?? 0)" />
    </template>

    <template #guarantee_status="{ row }">
      <ShowStatus :type="Number(row?.guarantee_status?.id ?? 0)" />
    </template>

    <template #actions="{ row }">
      <Button
        :left-icon="defaultIconsLucide.eye"
        color="orange"
        class-custom="custom"
        :outline="false"
        flat
        colorIcon="#f45100"
        tooltip="Ver"
        @click="
          $router.push({
            name: 'GuaranteesRead',
            params: {
              id: row.id,
            },
            query: {
              from: JSON.stringify({
                name: 'TrustBusinessesRead',
                params: { id: businessId },
              }),
            },
          })
        "
      />
    </template>

    <template #custom-no-data>
      <div class="column justify-center items-center q-col-gutter-y-lg q-mt-sm">
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
</template>

<script setup lang="ts">
// components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// utils
import { defaultIconsLucide } from '@/utils'

// logic
import useGuaranteesTrustBusiness from './GuaranteesTrustBusiness'

const props = withDefaults(
  defineProps<{
    businessId: number
  }>(),
  {}
)

const { tableProps } = useGuaranteesTrustBusiness(props)
</script>
