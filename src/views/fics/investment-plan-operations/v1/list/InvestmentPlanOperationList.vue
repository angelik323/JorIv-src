<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('InvestmentPlanOperationCreate')"
    >
      <FiltersComponent
        ref="filterComponentRef"
        :fields="filterConfig"
        @filter="handleFilter"
        @update:values="handleFilterUpdate"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.state_id ?? 25)"
              status-type="fics"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="row.state_id === FicStatusID.AUTHORIZED"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('InvestmentPlanOperationView', row.id)"
            />

            <Button
              v-if="row.state_id === FicStatusID.AUTHORIZED"
              :left-icon="defaultIconsLucide.circleOff"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Anular"
              @click="goToURL('InvestmentPlanOperationAnnulate', row.id)"
            />

            <Button
              v-if="
                ![
                  FicStatusID.AUTHORIZED,
                  FicStatusID.REJECTED,
                  FicStatusID.ANNULED,
                ].includes(row.state_id)
              "
              :left-icon="defaultIconsLucide.listCheck"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Autorizar/Rechazar"
              @click="goToURL('InvestmentPlanOperationCompliance', row.id)"
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
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { FicStatusID } from '@/interfaces/global'

// Logic view
import useInvestmentPlanOperationList from '@/views/fics/investment-plan-operations/v1/list/InvestmentPlanOperationList'

const {
  goToURL,
  showState,
  tableProps,
  updatePage,
  headerProps,
  filterConfig,
  handleFilter,
  isTableEmpty,
  updatePerPage,
  defaultIconsLucide,
  handleClearFilters,
  filterComponentRef,
  handleFilterUpdate,
} = useInvestmentPlanOperationList()
</script>
