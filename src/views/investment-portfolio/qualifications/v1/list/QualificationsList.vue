<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('InvestmentPortfolio', 'QualificationsList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="goToURL('QualificationsCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status_id ?? 0"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'QualificationsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('QualificationsView', row.id)"
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'QualificationsList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('QualificationsEdit', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useQualificationsList from '@/views/investment-portfolio/qualifications/v1/list/QualificationsList'

const {
  defaultIconsLucide,
  filterComponentRef,
  headerProperties,
  tableProps,
  filterConfig,
  validateRouter,
  goToURL,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
} = useQualificationsList()
</script>
