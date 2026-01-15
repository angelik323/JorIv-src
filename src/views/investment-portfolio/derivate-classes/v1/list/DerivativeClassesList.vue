<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('InvestmentPortfolio', 'DerivativeClassesList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="() => goToURL('DerivativeClassesCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
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
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="row.status === StatusID.ACTIVE"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="handleStatus(row)"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'DerivativeClassesList',
                  'show'
                )
              "
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('DerivativeClassesView', row.id)"
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'DerivativeClassesList',
                  'edit'
                )
              "
              :right-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('DerivativeClassesEdit', row.id)"
            />

            <!-- Eliminar -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'DerivativeClassesList',
                  'delete'
                )
              "
              :right-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete(row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalDeleteRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalDeleteConfig.description"
        :description_message="''"
        @confirm="deleteDerivativeClass()"
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
        ref="alertModalStatusRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalStatusConfig.description"
        :description_message="''"
        @confirm="changeStatus()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup.svg"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import { StatusID } from '@/interfaces/global'
import { useDerivativeClassesList } from '@/views/investment-portfolio/derivate-classes/v1/list/DerivativeClassesList'

const {
  defaultIconsLucide,
  filterComponentRef,
  headerProperties,
  tableProps,
  filterConfig,
  alertModalDeleteRef,
  alertModalStatusRef,
  alertModalStatusConfig,
  alertModalDeleteConfig,
  validateRouter,
  goToURL,
  handleClear,
  handleFilter,
  updatePage,
  updateRowsPerPage,
  deleteDerivativeClass,
  handleDelete,
  changeStatus,
  handleStatus,
} = useDerivativeClassesList()
</script>
