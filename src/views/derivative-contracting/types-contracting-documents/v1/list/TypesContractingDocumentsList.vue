<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'DerivativeContracting',
          'TypesContractingDocumentsList',
          'create'
        )
          ? headerProps.btnLabel
          : undefined
      "
      @to="goToURL('TypesContractingDocumentsCreate')"
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
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status_id="{ row }">
            <CustomToggle
              :value="row.status_id === StatusID.ACTIVE"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="
                validateRouter(
                  'DerivativeContracting',
                  'TypesContractingDocumentsList',
                  'edit'
                )
                  ? openAlertModal(
                      row.status_id === StatusID.ACTIVE
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
                  'TypesContractingDocumentsList',
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
              @click="goToURL('TypesContractingDocumentsView', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'TypesContractingDocumentsList',
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
              @click="goToURL('TypesContractingDocumentsEdit', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'TypesContractingDocumentsList',
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
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useTypesContractingDocumentsList from '@/views/derivative-contracting/types-contracting-documents/v1/list/TypesContractingDocumentsList'

// Interfaces
import { StatusID } from '@/interfaces/global'

const {
  defaultIconsLucide,
  headerProps,
  tableProps,
  filterConfig,
  alertModalDeleteRef,
  alertModalStatusRef,
  alertModalConfig,

  handleFilter,
  handleFilterClear,
  updatePage,
  updatePerPage,
  openAlertModal,
  changeStatusAction,
  deleteAction,
  validateRouter,
  goToURL,
} = useTypesContractingDocumentsList()
</script>
