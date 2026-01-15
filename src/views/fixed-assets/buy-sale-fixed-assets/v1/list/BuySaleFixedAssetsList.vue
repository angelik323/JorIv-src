<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsList.title"
      :breadcrumbs="headerPropsList.breadcrumbs"
    >
      <template #addBefore>
        <div>
          <Button
            :left-icon="defaultIconsLucide.plusCircleOutline"
            label="Crear"
            color="white"
            color-icon="white"
            :outline="false"
            :dropdown-options="optionsCreate"
            :dropdown-grouped="true"
          />
        </div>
      </template>
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns as any"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 0)" status-type="trustBusiness" />
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
              @click="goToRead(row)"
            />

            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToEdit(row)"
            />

            <Button
              flat
              :label="''"
              left-icon="MoreVertical"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Opciones'"
              @click=""
              :dropdown-options="optionsActions(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <!-- Modal de eliminación -->
    <AlertModalComponent
      ref="deleteModalRef"
      styleModal="max-width: 470px"
      :showImgDefault="true"
      :title="modalConfig.deleteTitle"
      :description_message="''"
      @confirm="handleDelete"
    />

    <!-- Modal aprobación -->
    <AlertModalComponent
      ref="approveModalRef"
      styleModal="max-width: 470px"
      :showImgDefault="true"
      :title="modalConfig.approveTitle"
      :description_message="''"
      @confirm="handleApprove"
    />
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

// logic-view
import useBuySaleFixedAssetsList from '@/views/fixed-assets/buy-sale-fixed-assets/v1/list/BuySaleFixedAssetsList'

const {
  // header and table
  headerPropsList,
  tableProps,
  filterConfig,
  defaultIconsLucide,

  // modals
  deleteModalRef,
  approveModalRef,
  modalConfig,

  // options
  optionsActions,
  optionsCreate,

  // actions
  goToEdit,
  goToRead,
  handleFilter,
  updatePage,
  updateRowsPerPage,
  handleClearFilters,
  handleDelete,
  handleApprove
} = useBuySaleFixedAssetsList()
</script>
