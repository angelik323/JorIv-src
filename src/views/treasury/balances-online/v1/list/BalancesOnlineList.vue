<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          @filter="handleFilter"
          @clear-filters="handleClear"
          :fields="filterConfig"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status']"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #status="{ row }">
            <ShowStatus :type="row?.status === 'Activo' ? 1 : 2" />
          </template>

          <template #custom-header-action>
            <Button
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              @click="onDdownloadExcel"
              :left-img="imgButtonHeaderTable"
              :disabled="tableProps.rows.length === 0"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBalancesOnlineList from '@/views/treasury/balances-online/v1/list/BalancesOnlineList'

// Utils
import imgButtonHeaderTable from '@/assets/images/excel.svg'

const {
  filterComponentRef,
  filterConfig,
  headerProps,
  tableProps,

  onDdownloadExcel,
  handleFilter,
  handleClear,
  updatePage,
  updateRows,
} = useBalancesOnlineList()
</script>
