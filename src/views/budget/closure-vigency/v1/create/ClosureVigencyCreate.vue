<template>
  <div class="q-mx-lg">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleBack"
    >
      <!-- Filtros -->
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filterRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="filtersUpdate"
        />
      </section>

      <!-- Listado de negocios para seleccionar -->
      <section v-if="searchPerformed" class="q-mt-xl">
        <TableList
          :loading="tablePropsBusinesses.loading"
          :columns="tablePropsBusinesses.columns"
          :rows="tablePropsBusinesses.rows ?? []"
          :pages="tablePropsBusinesses.pages"
          :custom-columns="[
            'select',
            'sequential_number',
            'last_closed_vigency',
          ]"
          :hideHeader="tablePropsBusinesses.rows.length === 0"
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-9 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{
                    tablePropsBusinesses.rows.length > 0
                      ? tablePropsBusinesses.title
                      : ''
                  }}
                </p>
              </div>
              <div
                v-if="tablePropsBusinesses.rows.length > 0"
                class="col-xs-12 col-sm-12 col-md-4 col-lg-3 self-center"
              >
                <Button
                  label="Ejecutar"
                  color="secondary"
                  class-custom="full-width"
                  :outline="false"
                  :disable="!hasSelectedBusinesses"
                  @click="handleExecute"
                />
              </div>
            </div>
          </template>

          <template #select="{ row }">
            <q-checkbox v-model="row.selected" color="primary" dense />
          </template>

          <template #sequential_number="{ index }">
            {{ String(index + 1).padStart(2, '0') }}
          </template>

          <template #last_closed_vigency="{ row }">
            {{ row.last_closed_vigency ?? 'Sin cierre previo' }}
          </template>

          <!-- Header con checkbox para seleccionar todos -->
          <template #header-cell-select>
            <q-checkbox
              v-model="selectAll"
              color="primary"
              dense
              :disable="tablePropsBusinesses.rows.length === 0"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import { useClosureVigencyCreate } from '@/views/budget/closure-vigency/v1/create/ClosureVigencyCreate'

const {
  headerProps,
  tablePropsBusinesses,
  filterRef,
  filterConfig,
  selectAll,
  searchPerformed,
  hasSelectedBusinesses,
  filtersUpdate,
  handleFilter,
  handleClearFilters,
  handleExecute,
  handleBack,
} = useClosureVigencyCreate()
</script>
