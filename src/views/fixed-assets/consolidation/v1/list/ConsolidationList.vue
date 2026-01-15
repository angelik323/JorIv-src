<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsList.title"
      :breadcrumbs="headerPropsList.breadcrumbs"
      :btn-label="
        validateRouter('FixedAssets', 'ConsolidationList', 'create')
          ? 'Crear'
          : ''
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'ConsolidationCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          :buttons="['more_filters']"
          @filter="handleFilter"
          @show-more="handleShowFilters"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 0)" />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'ConsolidationRead',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- <Button
              v-if="validateRouter('FixedAssets', 'ConsolidationList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'ConsolidationEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            /> -->

            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              :disabled="row.status_id !== 56"
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :title="alertModalConfig.description"
          @confirm="changeStatusAction"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// composables
import { useUtils } from '@/composables'
const { defaultIconsLucide } = useUtils()

// logic-view
import useConsolidationList from '@/views/fixed-assets/consolidation/v1/list/ConsolidationList'

const {
  headerPropsList,
  tableProps,
  alertModalRef,
  alertModalConfig,
  filterConfig,

  handleFilter,
  handleShowFilters,
  handleClearFilters,
  validateRouter,
  updatePage,
  updateRowsPerPage,
  changeStatusAction,
  openAlertModal,
} = useConsolidationList()
</script>
