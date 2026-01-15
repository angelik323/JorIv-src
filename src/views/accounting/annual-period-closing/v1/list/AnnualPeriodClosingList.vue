<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'AnnualPeriodClosingList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('AnnualPeriodClosingsCreate')"
    >
      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="_cleanData"
      />

      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows ?? []"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 1)" />
          </template>

          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.title }}
                </p>
              </div>
            </div>
          </template>

          <template #actions="{}">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('Accounting', 'AnnualPeriodClosingList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'

// Logic view
import useAnnualPeriodClosingList from '@/views/accounting/annual-period-closing/v1/list/AnnualPeriodClosingList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  // Props
  headerProps,
  tableProps,
  filterConfig,
  handleFilter,
  _cleanData,
  handleGoTo,
  updatePage,
  updatePerPage,
  validateRouter,
} = useAnnualPeriodClosingList()
</script>
