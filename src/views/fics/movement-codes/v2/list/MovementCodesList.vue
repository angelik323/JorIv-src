<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('MovementCodesCreate')"
    >
      <FiltersComponentV2
        :fields="filterConfig"
        :buttons="['more_filters']"
        @show-more="handleShowMoreFilters"
        @filter="handleFilter"
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
          <template #custom-header-action>
            <Button
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              :disabled="tableProps.rows.length === 0"
              tooltip="Descargar excel"
              @click="exportExcel"
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Fics', 'MovementCodesList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('MovementCodesRead', row.id)"
            />
            <Button
              v-if="validateRouter('Fics', 'MovementCodesList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('MovementCodesEdit', row.id)"
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
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useMovementCodesList from '@/views/fics/movement-codes/v2/list/MovementCodesList'

const {
  goToURL,
  showState,
  tableProps,
  updatePage,
  exportExcel,
  headerProps,
  handleFilter,
  filterConfig,
  isTableEmpty,
  updatePerPage,
  validateRouter,
  defaultIconsLucide,
  handleClearFilters,
  handleShowMoreFilters,
} = useMovementCodesList()
</script>
