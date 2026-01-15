<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :key="filtersKey"
          :buttons="['more_filters']"
          :fields="filters"
          @filter="handleUpdateFilters"
          @clear-filters="handleClear"
          @show-more="onToggleOptions"
        />
      </section>

      <NoDataState
        v-if="isListEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-mt-xl">
        <TableList
          ref="tableRef"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          :pages="tableProps.pages"
          selection="multiple"
          :canDisableSelection="true"
          :selectionFilter="customSelectionFilter"
          @update:selected="onUpdateSelected"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row.status?.id)" />
          </template>

          <template #custom-header-action>
            <div class="row q-gutter-sm items-center">
              <Button
                :outline="false"
                :left-icon="defaultIconsLucide.close"
                colorIcon="white"
                :class-custom="'custom'"
                label="Rechazar"
                size="md"
                tooltip="Rechazar seleccionados"
                :disabled="selectedRows.length === 0"
                @click="openRejectForm"
              />
              <Button
                :outline="false"
                :class-custom="'custom'"
                label="Autorizar"
                size="md"
                color="orange"
                tooltip="Autorizar seleccionados"
                :disabled="selectedRows.length === 0"
                @click="openAuthorizeForm"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              :outline="false"
              :flat="true"
              color="orange"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleView(row)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <RemoteAuthorizationModal
      :openDialog="openForm"
      :mode="formMode"
      :selected="selectedRows"
      @update:openDialog="openForm = $event"
      @done="handleFormDone"
      @cancel="openForm = false"
    />
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import RemoteAuthorizationModal from '@/components/Forms/Treasury/RemoteAuthorization/Modal/RemoteAuthorizationModal.vue'
import useRemoteTreasuryAuthorizationList from './RemoteAuthorizationList'

const {
  headerProps,
  filters,
  filtersKey,
  tableProps,
  selectedRows,
  openForm,
  formMode,
  defaultIconsLucide,
  showState,
  isListEmpty,
  tableRef,
  onToggleOptions,
  handleUpdateFilters,
  handleClear,
  updatePage,
  updatePerPage,
  onUpdateSelected,
  openAuthorizeForm,
  openRejectForm,
  handleFormDone,
  handleView,
  customSelectionFilter,
} = useRemoteTreasuryAuthorizationList()
</script>
