<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :btn-label="
        validateRouter('Accounting', 'AccountingRestatementList', 'undo')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-outline="true"
      :btn-color="headerProperties.btn.color"
      :btn-class="headerProperties.btn.class"
      :btn-text-color="headerProperties.btn.textColor"
      @to="goToURL('ExchangeDifferenceRestatementUndo')"
    >
      <template #addAfter>
        <div
          v-if="
            validateRouter('Accounting', 'AccountingRestatementList', 'process')
          "
        >
          <Button
            :outline="false"
            :label="'Procesar'"
            :left-icon="defaultIconsLucide.cached"
            :color-icon="'white'"
            :class="'custom' + ' full-width'"
            @click="goToURL('ExchangeDifferenceRestatementCreate')"
          />
        </div>
      </template>

      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          @update:values="handleUpdateValues"
          @show-more="handleShowMoreFilters"
          :buttons="['more_filters']"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <NoDataState
          v-if="isListEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />
        <TableList
          v-else
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row.status?.id ?? 0)"
              statusType="accounting"
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'AccountingRestatementList',
                  'show'
                )
              "
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              size=""
              @click="
                goToURL('ExchangeDifferenceRestatementView', { id: row.id })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

//Logic
import useExchangeDifferenceRestatementList from './ExchangeDifferenceRestatementList'

const {
  //States
  headerProperties,
  filterComponentRef,
  filterConfig,
  tableProperties,
  isListEmpty,
  showState,

  //Methods
  updatePage,
  updateRowsPerPage,
  handleFilterSearch,
  handleClearFilters,
  handleUpdateValues,
  handleShowMoreFilters,
  validateRouter,
  //Navigate
  goToURL,

  //Icons
  defaultIconsLucide,
} = useExchangeDifferenceRestatementList()
</script>
