<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'DerivativeContracting',
          'ProjectManagementList',
          'create'
        )
          ? headerProps.btnLabel
          : undefined
      "
      @to="goToURL('ProjectManagementCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleFilterClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['check', 'status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #check="{ row }">
            <RadioYesNo
              v-model="selectedProject"
              :options="[{ label: '', value: row.id }]"
              @update:model-value="handleSelectionChange(row.id)"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status?.id ?? 0)" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ProjectManagementList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="goToURL('ProjectManagementView', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ProjectManagementList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="primary"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('ProjectManagementEdit', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ProjectManagementList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="negative"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalDeleteRef"
          :title="alertModalConfig.title"
          @confirm="deleteAction"
        />

        <TableList
          :title="associatedBusinessTableProps.title"
          :loading="associatedBusinessTableProps.loading"
          :columns="associatedBusinessTableProps.columns"
          :rows="associatedBusinessTableProps.rows"
          :pages="associatedBusinessTableProps.pages"
          :hide-pagination="true"
          :custom-columns="['status']"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status?.id ?? 0)" />
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
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useProjectManagementList from '@/views/derivative-contracting/project-management/v1/list/ProjectManagementList'

const {
  defaultIconsLucide,
  headerProps,
  filterConfig,
  tableProps,
  associatedBusinessTableProps,
  alertModalDeleteRef,
  alertModalConfig,
  selectedProject,

  handleFilter,
  handleFilterClear,
  updatePage,
  updatePerPage,
  openAlertModal,
  deleteAction,
  handleSelectionChange,
  validateRouter,
  goToURL,
} = useProjectManagementList()
</script>
