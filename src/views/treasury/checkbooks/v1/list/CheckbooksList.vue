<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Treasury', 'CheckbooksList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'CheckbooksCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filterRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @update:values="handleUpdateValues"
          @clear-filters="clearFilters"
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
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 0)" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Treasury', 'CheckbooksList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'CheckbooksEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <Button
              v-if="validateRouter('Treasury', 'CheckbooksList', 'delete')"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          title="¿Desea eliminar la chequera?"
          @confirm="changeStatusAction"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useCheckbooksList from '@/views/treasury/checkbooks/v1/list/CheckbooksList'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,
  filterRef,
  handleFilter,
  clearFilters,
  updatePage,
  updateRowsPerPage,
  openAlertModal,
  changeStatusAction,
  validateRouter,
  handleUpdateValues,
} = useCheckbooksList()
</script>
