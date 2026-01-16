<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('LocationsCreate')"
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
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="isRowActive(row.status.id)"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="openAlertModal(row, 'change-status')"
            />
          </template>

          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              v-if="row.id"
              :left-icon="useUtils().defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                goToURL('LocationsEdit', row.id, {
                  created_by_name: row.created_by?.name,
                  updated_by_name: row.updated_by?.name,
                  updated_at: row.updated_at,
                  created_at: row.created_at,
                  country_name: row.country?.name,
                  address: row.address,
                  city_name: row.city?.name,
                  department_name: row.department?.name,
                  location_types: row.location_type?.name,
                  locations: row.parent?.address,
                })
              "
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleConfirmButtonModal()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
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

// Logic
import useLocationsList from '@/views/fixed-assets/locations/v1/list/LocationsList'

// utils
import { useUtils } from '@/composables'

const {
  headerProps,
  filterConfig,
  tableProps,
  tableRef,
  alertModalRef,
  updatePage,
  updatePerPage,
  handleFilter,
  handleClearFilters,
  goToURL,
  handleConfirmButtonModal,
  alertModalConfig,
  isRowActive,
  openAlertModal,
} = useLocationsList()
</script>
