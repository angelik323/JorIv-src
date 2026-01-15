<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('CashGeneratingUnitCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          :buttons="['more_filters']"
          @show-more="handleShowFilters"
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
        >
          <template #status="{ row }">
            <CustomToggle
              :value="isRowActive(row.status.id)"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="
                openModalStatus(
                  row.id,
                  row.business_trust?.name,
                  row.status?.name
                )
              "
            />
          </template>

          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              :left-icon="useUtils().defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('CashGeneratingUnitEdit', row.id)"
            />

            <!-- Eliminar -->
            <Button
              :outline="false"
              :left-icon="useUtils().defaultIconsLucide.circleOff"
              color="orange"
              :flat="true"
              :class-custom="'custom'"
              tooltip="Anular"
              @click="openDeleteModal(row.id, row.business_trust?.name)"
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
          @confirm="handleStatus()"
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

        <AlertModalComponent
          ref="alertModalDeleteRef"
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
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// utils
import { useUtils } from '@/composables'

// Logic
import useCashGeneratingUnitList from '@/views/fixed-assets/cash_generating_unit/list/CashGeneratingUnitList'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalConfig,

  alertModalRef,
  tableRef,
  alertModalDeleteRef,

  handleFilter,
  handleClearFilters,
  handleShowFilters,
  goToURL,
  isRowActive,
  openDeleteModal,
  handleStatus,
  openModalStatus,
  handleDelete,
} = useCashGeneratingUnitList()
</script>
