<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'DocumentCharacteristicsList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="handlerGoTo('DocumentCharacteristicsCreate')"
    >
      <FiltersComponent
        :fields="filterConfig"
        :trigger_event_by_field="true"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <div class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'BusinessTrust',
                  'DocumentCharacteristicsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handlerGoTo('DocumentCharacteristicsView', row.id)"
            />
            <!-- Editar -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'BusinessTrust',
                  'DocumentCharacteristicsList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handlerGoTo('DocumentCharacteristicsEdit', row.id)"
            />
            <!-- Editar -->
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'BusinessTrust',
                  'DocumentCharacteristicsList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openModalDelete(row.id)"
            />
          </template>
        </TableList>
      </div>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="handleDelete()"
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
<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useDocumentCharacteristicsList from './DocumentCharacteristicsList'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import { defaultIconsLucide } from '@/utils'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProperties,
  filterConfig,
  tableProperties,
  alertModalRef,
  alertModalConfig,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  handlerGoTo,
  openModalDelete,
  handleDelete,
  validateRouter,
} = useDocumentCharacteristicsList()
</script>
