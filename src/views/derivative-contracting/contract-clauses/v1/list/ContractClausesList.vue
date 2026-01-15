<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('DerivativeContracting', 'ContractClausesList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('ContractClausesCreate')"
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
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'status_id']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status_id="{ row }">
            <CustomToggle
              :value="isRowActive(row.status.id)"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="
                validateRouter(
                  'DerivativeContracting',
                  'ContractClausesList',
                  'edit'
                )
                  ? openAlertModal(row)
                  : null
              "
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ContractClausesList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('ContractClausesRead', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ContractClausesList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('ContractClausesEdit', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'ContractClausesList',
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
              @click="openDeleteModal(row)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="deleteModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar la cláusula del contrato seleccionada?"
      :show-img-default="false"
      @confirm="confirmDeleteAction"
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

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.title"
      :show-img-default="false"
      @confirm="changeStatusAction"
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
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'

// Logic view
import useContractClauses from '@/views/derivative-contracting/contract-clauses/v1/list/ContractClausesList'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

const {
  headerProps,
  tableProps,
  filterConfig,
  deleteModalRef,
  alertModalRef,
  alertModalConfig,
  defaultIconsLucide,

  goToURL,
  changeStatusAction,
  openAlertModal,
  isRowActive,
  confirmDeleteAction,
  openDeleteModal,
  handleClear,
  updatePerPage,
  handleFilter,
  updatePage,
  validateRouter,
} = useContractClauses()
</script>
