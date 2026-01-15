<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponentV2
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilter"
        @update:values="onChangeFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          selection="single"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
          @selected="handleSelected($event.selected)"
        />
      </div>

      <div v-if="isSelected">
        <NoDataState
          v-if="isTableDetailEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />

        <div v-else class="q-pt-md q-my-xl">
          <TableList
            :title="tablePropsDetail.title"
            :loading="tablePropsDetail.loading"
            :rows="tablePropsDetail.rows"
            :columns="tablePropsDetail.columns"
            :pages="tablePropsDetail.pages"
          >
            <template #custom-header-action>
              <Button
                outline
                class-custom="custom"
                label="Descargar excel"
                color="orange"
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="excelIcon"
                @click="handleDownload"
              />
            </template>
          </TableList>
        </div>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useConsultClosingProcessInvestmentFundsList from '@/views/fics/consult-closing-process-investment-funds/v1/list/ConsultClosingProcessInvestmentFundsList'

const {
  showState,
  tableProps,
  filtersRef,
  isSelected,
  headerProps,
  handleFilter,
  isTableEmpty,
  filterConfig,
  handleDownload,
  handleSelected,
  onChangeFilter,
  tablePropsDetail,
  handleUpdatePage,
  isTableDetailEmpty,
  handleClearFilters,
  handleUpdateRowsPerPage,
} = useConsultClosingProcessInvestmentFundsList()
</script>
