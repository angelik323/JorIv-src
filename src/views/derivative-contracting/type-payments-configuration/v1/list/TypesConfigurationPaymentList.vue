<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'DerivativeContracting',
          'TypesConfigurationPaymentList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('TypesConfigurationPaymentCreate')"
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
          :custom-columns="['require_authorization', 'status', 'actions']"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #require_authorization="{ row }">
            <div class="flex flex-start">
              <q-checkbox
                :model-value="Boolean(row.require_authorization)"
                color="orange"
                dense
                class="cde-checkbox q-ml-xl"
                readonly
              />
            </div>
          </template>

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
                  'TypesConfigurationPaymentList',
                  'edit'
                )
                  ? handleOptions(
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
            <!-- Editar -->
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'TypesConfigurationPaymentList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('TypesConfigurationPaymentEdit', row.id)"
            />

            <!-- Eliminar -->
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'TypesConfigurationPaymentList',
                  'delete'
                )
              "
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
        ref="alertModalDelete"
        styleModal="min-width: 480px"
        title="¿Desea eliminar el tipo de pago configurado seleccionado?"
        @confirm="deletePaymentTypeAction(Number(alertModalDeleteConfig.id))"
      >
      </AlertModalComponent>

      <AlertModalComponent
        ref="alertModalUpdate"
        styleModal="min-width: 480px"
        :title="alertModalUpdateConfig.title"
        @confirm="changeStatus(Number(alertModalUpdateConfig.id))"
      />
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useTypesConfigurationPaymentList from '@/views/derivative-contracting/type-payments-configuration/v1/list/TypesConfigurationPaymentList'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import TableList from '@/components/table-list/TableList.vue'

// Interfaces
import { StatusID } from '@/interfaces/global'

const {
  headerProps,
  tableProps,
  alertModalUpdate,
  alertModalDelete,
  alertModalUpdateConfig,
  defaultIconsLucide,
  filterConfig,
  handleFilter,
  handleClear,
  updatePage,
  updatePerPage,
  handleOptions,
  changeStatus,
  deletePaymentTypeAction,
  alertModalDeleteConfig,
  goToURL,
  validateRouter,
} = useTypesConfigurationPaymentList()
</script>

<style scoped>
/* fuerza el checkbox cuadrado aunque haya estilos globales redondeando */
:deep(.cde-checkbox .q-checkbox__bg) {
  border-radius: 4px !important;
}
:deep(.cde-checkbox .q-checkbox__inner) {
  border-radius: 4px !important;
}
</style>
