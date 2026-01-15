<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="validateRouter('Treasury', 'TypesCollectionList', 'create') ? 'Crear' : undefined"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('TypesCollectionCreate')"
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
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          :rowsPerPage="tableProps.rowsPerPage"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status_id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              v-if="validateRouter('Treasury', 'TypesCollectionList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />

            <!-- Eliminar -->
            <Button
              v-if="validateRouter('Treasury', 'TypesCollectionList', 'delete')"
              :left-icon="defaultIconsLucide.delete"
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
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="changeStatus()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useTypesCollectionList from '@/views/treasury/types-collection/v1/list/TypesCollectionList'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

const {
  // Props
  headerProps,
  tableProps,
  alertModalRef,
  alertModalConfig,
  defaultIconsLucide,
  filterConfig,
  // Methods
  handleFilter,
  handlerGoTo,
  handleClear,
  updatePage,
  updatePerPage,
  handleOptions,
  changeStatus,
  validateRouter,
} = useTypesCollectionList()
</script>
