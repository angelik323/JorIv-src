<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'ExtendTrustList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('ExtendTrustCreate')"
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
          :title="tableProps.rows.length > 0 ? tableProps.title : ''"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'status_id']"
          :hideHeader="tableProps.rows.length === 0"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 1)" />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('BusinessTrust', 'ExtendTrustList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'ExtendTrustView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('BusinessTrust', 'ExtendTrustList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              :disabled="row.status_id === 56"
              @click="
                $router.push({
                  name: 'ExtendTrustEdit',
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
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

// logic
import useExtendTrustList from './ExtendTrustList'

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
  validateRouter,
  updateRowsPerPage,
} = useExtendTrustList()
</script>
