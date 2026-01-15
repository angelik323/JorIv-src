<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :breadcrumbs="headerProps.breadcrumbs"
      :title="headerProps.title"
    >
      <template #addBefore>
        <div class="row q-gutter-sm">
          <Button
            :left-icon="defaultIconsLucide.plusCircleOutline"
            label="Crear"
            color="white"
            color-icon="white"
            :outline="false"
            @click="goToURL('SarlaftOwnListCreate')"
          />
        </div>
      </template>
      <div class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="onFilterHandler"
          @clear-filters="onCleanFilters"
        >
        </FiltersComponent>
      </div>
      <div class="q-mt-lg">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          :pages="tableProps.pages"
          @updatePage="onPaginateHandler"
          @updateRowsPerPage="onRowsPerPageHandler"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="row.status === 'Activo'"
              :width="100"
              :height="27"
              :readonly="true"
              checked-text="Activo"
              unchecked-text="Inactivo"
              @click="onSwitchChange(row, row.status !== 'Activo')"
            />
          </template>
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('SarlaftOwnListEdit', row.id)"
            />
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('SarlaftOwnListDetail', row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>

  <MainLoader />

  <AlertModalComponent
    ref="alertModalRef"
    title="Cambiar estado"
    :description_message="stateChangeMessage"
    :show-img-default="true"
    text-btn-confirm="Aceptar"
    text-btn-cancel="Cancelar"
    @confirm="onConfirmStateChange"
    @close="onCancelStateChange"
  />
</template>
<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import MainLoader from '@/components/loader/MainLoader.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

// Logic
import useOwnListRecord from '@/views/sarlaft/own-list/v1/record/OwnListRecord'

const {
  headerProps,
  tableProps,
  defaultIconsLucide,
  filterConfig,
  stateChangeMessage,
  alertModalRef,
  goToURL,
  onSwitchChange,
  onConfirmStateChange,
  onCancelStateChange,
  onFilterHandler,
  onPaginateHandler,
  onRowsPerPageHandler,
  onCleanFilters,
} = useOwnListRecord()
</script>
