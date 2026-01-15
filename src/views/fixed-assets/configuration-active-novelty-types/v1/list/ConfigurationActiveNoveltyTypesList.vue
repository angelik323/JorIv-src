<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('ConfigurationActiveNoveltyTypesCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />

        <TableList
          ref="tableRef"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="tableProps.customColumns"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              :left-icon="useUtils().defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="goToURL('ConfigurationActiveNoveltyTypesRead', row.id)"
            />

            <!-- Editar -->
            <Button
              :left-icon="useUtils().defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('ConfigurationActiveNoveltyTypesEdit', row.id)"
            />

            <!-- Eliminar -->
            <Button
              :outline="false"
              :left-icon="useUtils().defaultIconsLucide.trash"
              color="orange"
              :flat="true"
              :class-custom="'custom'"
              tooltip="Eliminar"
              @click="openDeleteModal(row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :showImgDefault="false"
          :title="alertModalConfig.description"
          :textBtnConfirm="alertModalConfig.textBtnConfirm"
          :textBtnCancel="alertModalConfig.textBtnCancel"
          @confirm="handleDelete()"
        >
          <template #default-img>
            <q-img
              src="@/assets/images/icons/alert_popup_delete.svg"
              max-width="80px"
              width="80px"
              fit="contain"
              alt="Imagen de alerta"
            />
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Componentes
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic
import useActiveNoveltyTypeList from '@/views/fixed-assets/configuration-active-novelty-types/v1/list/ConfigurationActiveNoveltyTypesList'

// utils
import { useUtils } from '@/composables'

const {
  headerProps,
  filterConfig,
  tableProps,
  tableRef,
  alertModalConfig,
  alertModalRef,

  handleDelete,
  openDeleteModal,
  updatePage,
  updatePerPage,
  handleFilter,
  handleClearFilters,
  goToURL,
} = useActiveNoveltyTypeList()
</script>
