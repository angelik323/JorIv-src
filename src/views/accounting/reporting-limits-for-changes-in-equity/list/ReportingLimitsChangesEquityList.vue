<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'Accounting',
          'ReportingLimitsChangesEquityList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          :custom-columns="['actions']"
          @update-rows-per-page="updateRows"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'ReportingLimitsChangesEquityList',
                  'delete'
                )
              "
              :outline="false"
              :class-custom="'custom'"
              label="Eliminar"
              size="md"
              color="orange"
              @click="
                $router.push({
                  name: 'ReportingLimitsChangesEquityDelete',
                  query: {},
                })
              "
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'ReportingLimitsChangesEquityList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import { defaultIconsLucide } from '@/utils'
import useReportingLimitsForChangesInEquityList from './ReportingLimitsChangesEquityList'

const {
  headerProps,
  tableProps,
  filterConfig,
  handleClear,
  handleFilter,
  handleGoTo,
  updatePage,
  updateRows,
  handleOptions,
  validateRouter,
} = useReportingLimitsForChangesInEquityList()
</script>
