<template>
  <div class="q-mx-xl">
    <ContentComponent indentation content-indentation :title="headerProps.title" :breadcrumbs="headerProps.breadcrumbs">
      <section class="q-mt-md">
        <FiltersComponentV2 :fields="filterConfig" @filter="handleFilter" @clear-filters="handleClear"
          @update:values="updateValue" />
      </section>

      <section class="q-mt-xl">
        <TableList :title="tableProps.title" :loading="tableProps.loading" :columns="tableProps.columns"
          :rows="tableProps.rows" :pages="tableProps.pages" :custom-columns="['status', 'actions']"
          @update-page="updatePage">
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 0)" />
          </template>

          <template #custom-header-action>
            <Button v-if="validateRouter('Accounting', 'CheckingBalancesAndTransactionsByAccount', 'export')" class-custom="custom" :outline="true" label="Descargar excel" color="orange" :styleContent="{
              'place-items': 'center',
              color: 'black',
            }" @click="downloadExcel" :left-img="imgButtonHeaderTable" :disabled="isDisableDownloadExcel" />
          </template>

          <template #action="{ row }">
            <Button :right-icon="defaultIconsLucide.eye" color="orange" :class-custom="'custom'" :outline="false"
              :flat="true" colorIcon="#f45100" tooltip="Ver" @click="
                $router.push({
                  name: 'ConsecutiveVoucherView',
                  params: { id: row.id },
                })
                ">
            </Button>
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Composables
import { useRouteValidator } from '@/composables'

// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Logic view
import useCheckingBalancesAndTransactionsByAccount from '@/views/accounting/checking-balances-and-transactions-by-account/list/CheckingBalancesAndTransactionsByAccount'

// Utils
import { defaultIconsLucide } from '@/utils'

const { validateRouter } = useRouteValidator()

const {
  headerProps,
  tableProps,
  filterConfig,
  isDisableDownloadExcel,
  handleFilter,
  updatePage,
  handleClear,
  updateValue,
  downloadExcel
} = useCheckingBalancesAndTransactionsByAccount()
</script>
