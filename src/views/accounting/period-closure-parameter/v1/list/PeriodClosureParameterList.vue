<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'PeriodClosureParameterList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('PeriodClosureParameterCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          @filter="handleFilter"
          :fields="filterConfig"
          @clear-filters="_cleanPeriodClosureParametersData"
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
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'PeriodClosureParameterList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'PeriodClosureParameterView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <!-- Editar -->
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'PeriodClosureParameterList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'PeriodClosureParameterEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
// Utils
import { defaultIconsLucide } from '@/utils'
// Logic view
import usePeriodClosureParameterList from './PeriodClosureParameterList'

const {
  // Props
  headerProps,
  tableProps,
  filterConfig,
  // Methods
  handleFilter,
  handleGoTo,
  updatePage,
  updatePerPage,
  _cleanPeriodClosureParametersData,
  validateRouter,
} = usePeriodClosureParameterList()
</script>
