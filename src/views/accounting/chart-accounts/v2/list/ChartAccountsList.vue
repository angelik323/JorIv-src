<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'ChartAccountsList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="useUtils().defaultIconsLucide.plusCircle"
      @to="handlerGoTo('ChartAccountsCreate')"
    >
    </ContentComponent>

    <section class="q-mt-md">
      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />
    </section>

    <section class="q-mt-xl">
      <p
        v-if="tableProps.rows.length"
        class="text-black-10 text-weight-bold text-h6 q-mb-md"
      >
        {{ tableProps.title }}
      </p>
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :hide-header="!tableProps.rows.length"
        dense
        :custom-columns="['actions', 'status_id']"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      >
        <template #status_id="{ row }">
          <div class="q-pa-md">
            <ShowStatus :type="Number(row?.status?.id ?? 1)" />
          </div>
        </template>
        <template #actions="{ row }">
          <!-- Ver -->
          <Button
            v-if="validateRouter('Accounting', 'ChartAccountsList', 'show')"
            :left-icon="useUtils().defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Ver'"
            @click="
              $router.push({
                name: 'ChartAccountsView',
                params: {
                  id: row.id,
                },
              })
            "
          />
          <!-- Editar -->
          <Button
            v-if="validateRouter('Accounting', 'ChartAccountsList', 'edit')"
            :left-icon="useUtils().defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Editar'"
            @click="
              $router.push({
                name: 'ChartAccountsEdit',
                params: {
                  id: row.id,
                },
              })
            "
          />
        </template>
      </TableList>
    </section>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useChartAccountsList from '@/views/accounting/chart-accounts/v2/list/ChartAccountsList'

// Utils
import { useUtils } from '@/composables'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

const {
  headerProps,
  tableProps,
  filterConfig,

  validateRouter,
  handleFilter,
  handlerGoTo,
  updatePage,
  updateRows,
  handleClearFilters,
} = useChartAccountsList()
</script>
