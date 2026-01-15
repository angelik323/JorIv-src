<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('InvestmentPortfolio', 'PaperTypesList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="goToURL('PaperTypesCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('InvestmentPortfolio', 'PaperTypesList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('PaperTypesView', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Composables
import { useGoToUrl } from '@/composables'

// Logic view
import usePaperTypesList from './PaperTypesList'

const { goToURL } = useGoToUrl()

const {
  defaultIconsLucide,
  headerProperties,
  tableProperties,
  filterComponentRef,
  filterConfig,
  validateRouter,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
} = usePaperTypesList()
</script>
