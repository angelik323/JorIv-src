<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('DerivativeContracting', 'WorkPlansList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('WorkPlansCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status?.id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('DerivativeContracting', 'WorkPlansList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'WorkPlansList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalDelete"
        styleModal="min-width: 480px"
        :title="
          alertModalDeleteConfig.description ||
          '¿Desea eliminar el plan de obra seleccionado?'
        "
        @confirm="deleteWorkPlanAction()"
      />
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

// Composables
import useWorkPlansList from '@/views/derivative-contracting/work-plans/v1/list/WorkPlansList'

const {
  headerProps,
  defaultIconsLucide,
  tableProps,
  filterConfig,
  handleFilter,
  handleClear,
  updatePage,
  updatePerPage,
  handleOptions,
  alertModalRef: alertModalDelete,
  alertModalConfig: alertModalDeleteConfig,
  confirmOption: deleteWorkPlanAction,
  goToURL,
  validateRouter,
} = useWorkPlansList()
</script>
