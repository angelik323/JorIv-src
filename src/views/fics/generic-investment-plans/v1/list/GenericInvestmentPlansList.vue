<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('GenericInvestmentPlansCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isGenericInvestmentPlansEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Fics', 'GenericInvestmentPlansList', 'export')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Consultar"
              @click="handleOption('view', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'Fics',
                  'GenericInvestmentPlansList',
                  'action_legalize'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Legalizar"
              @click="handleOption('create', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'Fics',
                  'GenericInvestmentPlansList',
                  'action_annul'
                )
              "
              :left-icon="defaultIconsLucide.circleOff"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Anular"
              @click="handleOption('delete', row.id)"
            />
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

// Logic view
import useGenericInvestmentPlansList from '@/views/fics/generic-investment-plans/v1/list/GenericInvestmentPlansList'

const {
  goToURL,
  showState,
  tableProps,
  headerProps,
  filterConfig,
  handleFilter,
  handleOption,
  validateRouter,
  handleUpdatePage,
  defaultIconsLucide,
  handleClearFilters,
  handleUpdateRowsPerPage,
  isGenericInvestmentPlansEmpty,
} = useGenericInvestmentPlansList()
</script>
