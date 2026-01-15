<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'AccountingConsolidationList', 'create')
          ? 'Crear'
          : undefined
      "
      @to="
        $router.push({
          name: 'AccountingConsolidationCreate',
        })
      "
    >
      <section>
        <FiltersComponentv2
          :fields="filterConfig"
          @clear-filters="handleClear"
          @filter="handleFilter"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'AccountingConsolidationList',
                  'show'
                )
              "
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'AccountingConsolidationView',
                  params: { id: row.id },
                })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import { useAccountingConsolidationList } from './AccountingConsolidationList'
import FiltersComponentv2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  filterConfig,
  tableProps,
  updatePage,
  updatePerPage,
  handleFilter,
  handleClear,
  validateRouter,
} = useAccountingConsolidationList()
</script>
