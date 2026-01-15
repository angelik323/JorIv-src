<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'SaleRealEstateList', 'create')
          ? 'Crear'
          : ''
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('SaleRealEstateCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="filtersUpdate"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'SaleRealEstateList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'SaleRealEstateView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'SaleRealEstateList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'SaleRealEstateEdit',
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
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'

// logic
import useSaleRealEstateList from './SaleRealEstateList'

// utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  filterConfig,

  handleFilter,
  handlerGoTo,
  updatePage,
  handleClearFilters,
  filtersUpdate,
  updateRowsPerPage,
  validateRouter,
} = useSaleRealEstateList()
</script>
