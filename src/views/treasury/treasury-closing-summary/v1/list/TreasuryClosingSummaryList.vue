<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="handleGoBack"
    >
      <section>
        <FiltersComponentV2 :fields="filterConfig" @filter="handleFilter" />
        <NoDataState
          v-if="isTreasuryClosingSummaryEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          />
          <div class="q-mt-lg flex q-gutter-x-md justify-end">
            <Button
              :outline="true"
              label="Descargar excel"
              size="md"
              color="orange"
              :style-text="{ color: '#333', fontWeight: 'bold' }"
              class="btn-filter custom"
              @click="downloadAction"
            />
            <Button
              :outline="false"
              label="Errores"
              size="md"
              color="orange"
              :style-text="{ color: 'white' }"
              class="btn-filter custom"
              @click="handleGoErrorList"
            />
          </div>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useTreasuryClosingSummaryList from './TreasuryClosingSummaryList'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  handleGoBack,
  filterConfig,
  handleFilter,
  tableProps,
  updatePage,
  updateRowsPerPage,
  showState,
  isTreasuryClosingSummaryEmpty,
  downloadAction,
  handleGoErrorList,
} = useTreasuryClosingSummaryList()
</script>
