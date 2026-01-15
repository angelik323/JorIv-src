<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsList.title"
      :breadcrumbs="headerPropsList.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToCreate"
    >
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
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('BuyOrderFixedAssetsRead', row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('BuyOrderFixedAssetsEdit', row.id)"
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

    <!-- Modal autorización -->
    <AlertModalComponent
      ref="authorizeModalRef"
      styleModal="max-width: 470px"
      :showImgDefault="true"
      :title="modalConfig.authorizeTitle"
      :description_message="''"
      @confirm="handleAuthorize"
    />
  </div>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic-view
import useBuyOrderFixedAssetsList from '@/views/fixed-assets/buy-order-fixed-assets/v1/list/BuyOrderFixedAssetsList'

const {
  // header and table
  headerPropsList,
  tableProps,
  filterConfig,
  defaultIconsLucide,

  // modals
  deleteModalRef,
  authorizeModalRef,
  modalConfig,

  // table actions
  optionsActions,
  goToURL,
  goToCreate,

  // handlers filters
  handleFilter,
  updatePage,
  updateRowsPerPage,
  handleClearFilters,

  //actions table
  handleDelete,
  handleAuthorize
} = useBuyOrderFixedAssetsList()
</script>
