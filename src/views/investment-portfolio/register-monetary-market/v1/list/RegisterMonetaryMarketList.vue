<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addAfter>
        <Button
          :outline="headerProps.btn.outline"
          :label="headerProps.btn.label"
          :icon="headerProps.btn.icon"
          :color="headerProps.btn.color"
          :size="headerProps.btn.size"
          :class-custom="headerProps.btn.class"
          :disabled="headerProps.btn.disable"
          :dropdown-options="headerProps.btn.options"
          color-icon="white"
        />
      </template>

      <section class="q-mt-md">
        <FiltersComponent
          :key="filtersKey"
          :buttons="['more_filters', 'search', 'clear']"
          :fields="visibleFilters"
          @filter="handleUpdateFilters"
          @clear-filters="handleClear"
          @show-more="handleShowMoreFilters"
        />
      </section>

      <NoDataState
        v-if="isListEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          :rows-per-page-options="[10, 25, 50, 100]"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <div class="row q-gutter-sm justify-center items-center no-wrap">
              <Button
                v-if="
                  validateRouter(
                    'InvestmentPortfolio',
                    'RegisterMonetaryMarketList',
                    'show'
                  )
                "
                :left-icon="defaultIconsLucide.eye"
                flat
                outline
                color="orange"
                tooltip="Ver"
                @click="handleView(row)"
              />
              <Button
                v-if="
                  validateRouter(
                    'InvestmentPortfolio',
                    'RegisterMonetaryMarketList',
                    'edit'
                  )
                "
                :left-icon="defaultIconsLucide.edit"
                flat
                outline
                color="orange"
                tooltip="Editar"
                @click="handleEdit(row)"
              />
            </div>
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'
import useMonetaryMarketOperationsList from './RegisterMonetaryMarketList'

const {
  headerProps,
  visibleFilters,
  filtersKey,
  tableProps,
  showState,
  isListEmpty,
  handleClear,
  updatePage,
  updatePerPage,
  handleView,
  handleEdit,
  validateRouter,
  handleShowMoreFilters,
  handleUpdateFilters,
} = useMonetaryMarketOperationsList()
</script>
