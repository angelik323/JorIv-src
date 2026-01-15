<template>
  <div class="q-mx-xl">
    <ContentComponent
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'DerivativeContracting',
          'AttachedDocumentsList',
          'create'
        )
          ? headerProps.actionLabel
          : undefined
      "
      :btn-icon="headerProps.actionIcon"
      @to="goToURL('AttachedDocumentsCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-md">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          :no-data-label="'Haga clic en Buscar para ver los documentos anexos'"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="row.status.id === StatusID.ACTIVE"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="
                validateRouter(
                  'DerivativeContracting',
                  'AttachedDocumentsList',
                  'edit'
                )
                  ? openAlertModal(
                      row.status.id === StatusID.ACTIVE
                        ? 'inactivar'
                        : 'activar',
                      row.id
                    )
                  : null
              "
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'AttachedDocumentsList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('AttachedDocumentsEdit', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'AttachedDocumentsList',
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
        >
        </AlertModalComponent>

        <AlertModalComponent
          ref="alertModalStatusRef"
          :title="alertModalConfig.title"
          @confirm="changeStatusAction"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

//logic
import useAttachedDocumentsList from '@/views/derivative-contracting/attached-documents-list/v1/list/AttachedDocumentsList'
import { StatusID } from '@/interfaces/global'

const {
  alertModalDeleteRef,
  alertModalStatusRef,
  alertModalConfig,

  headerProps,
  handleFilter,
  handleClear,
  filterConfig,
  tableProps,
  validateRouter,
  defaultIconsLucide,
  goToURL,
  updatePage,
  updatePerPage,

  openAlertModal,
  changeStatusAction,
  deleteAction,
} = useAttachedDocumentsList()
</script>
