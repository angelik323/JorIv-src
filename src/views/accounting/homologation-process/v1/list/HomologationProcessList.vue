<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'Accounting',
          'HomologationProcessList',
          'action_homologate'
        )
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('HomologationProcessCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          v-if="validateRouter('Accounting', 'HomologationProcessList', 'list')"
          ref="filterComponentRef"
          :fields="filterConfig"
          :buttons="['more_filters']"
          @filter="handleFilter"
          @show-more="handleShowFilters"
          @clear-filters="_cleanHomologationProcessData"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          v-if="validateRouter('Accounting', 'HomologationProcessList', 'list')"
          :title="tableProps.rows.length ? tableProps.title : undefined"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :hide-header="!tableProps.rows.length"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="row.status_id" status-type="accounting" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Accounting', 'HomologationProcessList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'HomologationProcessView',
                  params: { id: row.id },
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
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useHomologationProcessList from '@/views/accounting/homologation-process/v1/list/HomologationProcessList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  validateRouter,
  headerProps,
  tableProps,
  filterConfig,
  filterComponentRef,
  handleFilter,
  handleGoTo,
  updatePage,
  updatePerPage,
  handleShowFilters,
  _cleanHomologationProcessData,
} = useHomologationProcessList()
</script>
