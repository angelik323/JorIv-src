<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponent
        show_actions
        ref="filtersRef"
        :fields="filterConfig"
        :buttons="['more_filters']"
        trigger_event_by_field
        @filter="handleFilter"
        @show-more="handleShowFilters"
        @update:values="onChangeFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isAccountBalanceEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #custom-header>
            <div class="row col-12 items-center justify-between q-mb-md">
              <p class="q-my-none text-weight-medium text-h5">
                {{ tableProperties.title }}
              </p>

              <Button
                v-if="
                  validateRouter(
                    'Accounting',
                    'AccountBalancesAndThirdPartiesList',
                    'export'
                  )
                "
                outline
                class-custom="custom"
                label="Descargar excel"
                color="orange"
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="imgButtonHeaderTable"
                @click="uploadFileExcel"
              />
            </div>
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import Button from '@/components/common/Button/Button.vue'

import useAccountBalancesAndThirdPartiesList from '@/views/accounting/account-balances-and-third-parties/v1/list/AccountBalancesAndThirdPartiesList'

const {
  showState,
  filtersRef,
  filterConfig,
  handleFilter,
  onChangeFilter,
  uploadFileExcel,
  tableProperties,
  handleUpdatePage,
  headerProperties,
  handleShowFilters,
  handleClearFilters,
  handleUpdatePerPage,
  isAccountBalanceEmpty,
  validateRouter,
} = useAccountBalancesAndThirdPartiesList()
</script>
