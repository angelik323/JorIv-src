<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <FiltersComponentV2
          ref="filtersComponentRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @update:values="onChangeFilter"
          @clear-filters="clearFilters"
        />
        <NoDataState
          v-if="isTreasuryCloseListEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />
        <section v-else>
          <FiltersComponentV2
            :fields="businessCodeNameFilterConfig"
            @filter="handleBusinessCodeNameFilter"
          />
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          />

          <div class="flex justify-end q-mb-lg q-mt-sm">
            <Button
              label="ejecutar"
              size="md"
              :outline="false"
              unelevated
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="executeTreasuryClosing()"
            />
          </div>
        </section>
        <VCard custom-style="padding:1rem" v-if="treasury_closing_execution_id">
          <template #content-card>
            <section>
              <div class="text-subtitle2 text-weight-bold">
                Ejecucion de cierre
              </div>
              <TableList
                v-if="!isTreasureExecutionListEmpty"
                :hide-header="true"
                :custom-columns="['execution_procces']"
                :loading="tableExecutionProps.loading"
                :columns="tableExecutionProps.columns"
                :rows="treasury_closing_execution_list"
                :pages="tableExecutionProps.pages"
                @update-page="updateExecutionPage"
                @update-rows-per-page="updateExecutionRowsPerPage"
              >
                <template #execution_procces="{ row }">
                  {{
                    row.business +
                    ' ' +
                    row.bank_account +
                    ' ' +
                    row.process +
                    ' - ' +
                    row.message
                  }}
                </template>
              </TableList>
            </section>
            <section>
              <div class="flex q-gutter-x-md justify-end">
                <Button
                  :outline="false"
                  label="Resumen"
                  size="md"
                  color="orange"
                  :style-text="{ color: 'white' }"
                  class="btn-filter custom"
                  @click="goToSummary"
                />
                <Button
                  :outline="true"
                  label="Errores"
                  size="md"
                  color="orange"
                  :style-text="{ color: '#333', fontWeight: 'bold' }"
                  class="btn-filter custom"
                  @click="goToErrorsSummary"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useTreasuryClosingList from './TreasuryClosingList'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  filtersComponentRef,
  filterConfig,
  handleFilter,
  onChangeFilter,
  clearFilters,
  tableProps,
  updatePage,
  updateRowsPerPage,
  showState,
  isTreasuryCloseListEmpty,
  businessCodeNameFilterConfig,
  tableExecutionProps,
  updateExecutionPage,
  updateExecutionRowsPerPage,
  handleBusinessCodeNameFilter,
  executeTreasuryClosing,
  treasury_closing_execution_list,
  treasury_closing_execution_id,
  isTreasureExecutionListEmpty,
  goToSummary,
  goToErrorsSummary,
} = useTreasuryClosingList()
</script>
