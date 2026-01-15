<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('AccountsPayableClosingCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
        ref="filterRef"
      >
        <template #customs-actions>
          <Button
            outline
            color="primary"
            class-custom="menu__action--bg-white"
            :size="$q.screen.width <= 800 ? 'sm' : 'md'"
            :left-icon="
              showAdvancedFilters
                ? defaultIconsLucide.minus
                : defaultIconsLucide.plus
            "
            color-icon="#762343"
            :label="$q.screen.width > 800 ? 'Opciones' : ''"
            :no-caps="true"
            @click="handleOptions"
          />
        </template>
      </FiltersComponent>

      <NoDataState
        v-if="isTableEmpty && !tableProps.loading"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div
        v-else
        v-show="!isTableEmpty || tableProps.loading"
        class="q-pt-md q-my-xl"
      >
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows instanceof Array ? tableProps.rows : tableProps.rows.value"
          :columns="tableProps.columns"
          :pages="tableProps.pages && 'currentPage' in tableProps.pages ? tableProps.pages : tableProps.pages.value"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status?.id ?? 0"
              :statusType="'accountsPayable'"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <div class="row q-gutter-sm justify-center">
              <Button
                :left-icon="defaultIconsLucide.eye"
                colorIcon="#5b0a2d"
                color="primary"
                :outline="false"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Ver detalle"
                @click="viewDetail(row)"
              />
              <Button
                v-if="row.status?.name === 'Con error'"
                :left-img="excelIcon"
                colorIcon="#5b0a2d"
                color="primary"
                :outline="false"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Reporte de errores"
                @click="downloadReport(row)"
              />
            </div>
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useAccountsPayableClosingList from '@/views/accounts-payable/accounts-payable-closing/v1/list/AccountsPayableClosingList'

const {
  goToURL,
  showState,
  handleFilter,
  filterConfig,
  tableProps,
  headerProps,
  updatePage,
  handleClearFilters,
  defaultIconsLucide,
  updateRowsPerPage,
  isTableEmpty,
  viewDetail,
  downloadReport,
  handleOptions,
  showAdvancedFilters,
} = useAccountsPayableClosingList()
</script>
