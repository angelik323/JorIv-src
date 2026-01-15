<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      indentation
      content-indentation
    >
      <div class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="onFilterHandler"
          @clear-filters="onCleanFilters"
        />
      </div>

      <div v-if="hasSearched" class="q-mt-lg">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @updatePage="onPaginateHandler"
          @updateRowsPerPage="onRowsPerPageHandler"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.listCheck"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Gestionar"
              @click="handleManage(row)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic
import useRemoteMassAuthorizationView from '@/views/sarlaft/remote-mass-authorization/v1/list/RemoteMassAuthorizationList'

const {
  headerProps,
  defaultIconsLucide,
  tableProps,
  handleManage,
  filterConfig,
  onFilterHandler,
  onPaginateHandler,
  onRowsPerPageHandler,
  onCleanFilters,
  hasSearched,
} = useRemoteMassAuthorizationView()
</script>
